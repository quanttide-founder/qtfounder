output "function_name" {
  description = "FC 函数名"
  value       = alicloud_fcv3_function.this.function_name
}

output "http_trigger_url" {
  description = "HTTP 触发器公网 URL（客户端以 Authorization: Bearer <QTFOUNDER_SECRET_KEY> 访问）"
  value       = alicloud_fcv3_trigger.http.http_trigger[0].url_internet
}
