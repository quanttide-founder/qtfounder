# 函数计算（FC 3.0）：custom.debian12 runtime + ZIP 代码包。
# 参考 qtcloud-asset-provider 模式（无 Docker/镜像仓库依赖）：
#   - Go 静态编译为 bootstrap，与数据源（fiction/memory）一起打 ZIP 上传 OSS
#   - custom runtime 经 custom_runtime_config 指定启动命令与监听端口（9000）
#   - HTTP 触发器公开访问，鉴权由应用层 SecretKeyAuth 中间件承担
resource "alicloud_fcv3_function" "this" {
  function_name        = "${var.project}-${var.environment}"
  description          = "qtfounder 创作数据 API"
  runtime              = "custom.debian12"
  handler              = "not-used"
  memory_size          = var.fc_memory
  cpu                  = 0.5
  disk_size            = 512
  timeout              = var.fc_timeout
  instance_concurrency = 10
  internet_access      = true

  code {
    oss_bucket_name = var.code_bucket
    oss_object_name = var.code_object
  }

  custom_runtime_config {
    command = ["./bootstrap"]
    port    = 9000
  }

  # 访问控制：provider 内置 SecretKeyAuth 中间件（internal/creative/auth.go），
  # 客户端以 Authorization: Bearer <key> 访问。
  # 注意：/health 在鉴权范围内返回 401，但 FC 健康检查不受应用层 HTTP 状态影响（仅探测端口连通性）
  environment_variables = {
    QTFOUNDER_SECRET_KEY   = var.secret_key
    QTFOUNDER_ADDR         = ":9000"
    QTFOUNDER_FICTION_PATH = "./data/fiction"
    QTFOUNDER_MEMORY_PATH  = "./data/memory"
  }

  tags = {
    project     = var.project
    environment = var.environment
  }
}

# HTTP 触发器：公开访问 + 应用层 Bearer 鉴权
resource "alicloud_fcv3_trigger" "http" {
  function_name = alicloud_fcv3_function.this.function_name
  trigger_name  = "http"
  trigger_type  = "http"
  qualifier     = "LATEST"
  trigger_config = jsonencode({
    authType = "anonymous"
    methods  = ["GET", "OPTIONS"]
  })
}
