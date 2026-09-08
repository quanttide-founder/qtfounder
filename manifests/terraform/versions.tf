terraform {
  required_version = ">= 1.5"

  required_providers {
    alicloud = {
      source  = "aliyun/alicloud"
      version = "~> 1.240"
    }
  }

  # 远程状态：OSS（本机与 CI 共用）。初始化时通过 -backend-config 指定：
  #   terraform init \
  #     -backend-config="bucket=<OSS桶>" \
  #     -backend-config="key=qtfounder/terraform.tfstate" \
  #     -backend-config="region=cn-hangzhou"
  backend "oss" {}
}

# 阿里云凭证通过环境变量注入（不在代码中写死）：
#   export ALICLOUD_ACCESS_KEY=...
#   export ALICLOUD_SECRET_KEY=...
provider "alicloud" {
  region = var.region
}
