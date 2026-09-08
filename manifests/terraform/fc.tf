# 函数计算（FC 3.0）：custom-container 容器镜像。
# 与 qtcloud-delib 的差异：无 RDS/VPC 依赖（provider 只读本地数据文件），
# 故不需要 RAM 角色、VPC 配置与系统级 platform remote state。
resource "alicloud_fcv3_function" "this" {
  function_name   = "${var.project}-${var.environment}"
  description     = "qtfounder 创作数据 API"
  runtime         = "custom-container"
  handler         = "index.handler" # custom-container 必填占位，实际由容器监听端口决定
  cpu             = 0.5
  memory_size     = var.fc_memory
  disk_size       = 512 # FC 3.0 必填（MB）
  timeout         = var.fc_timeout
  internet_access = true

  custom_container_config {
    image = var.image
    port  = 8080
  }

  # 访问控制：provider 内置 SecretKeyAuth 中间件（internal/creative/auth.go），
  # 客户端以 Authorization: Bearer <key> 访问；QTFOUNDER_FICTION_PATH / QTFOUNDER_MEMORY_PATH
  # 已在镜像内固化（/data/fiction、/data/memory），无需注入
  environment_variables = {
    QTFOUNDER_SECRET_KEY = var.secret_key
  }

  tags = {
    project     = var.project
    environment = var.environment
  }
}

# HTTP 触发器：使服务可直接访问；鉴权由应用层密钥承担（匿名触发器 + Bearer 校验）
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
