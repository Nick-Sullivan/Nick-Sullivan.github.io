output "api_gateway_url" {
  description = "URL for invoking API Gateway."
  value       = aws_apigatewayv2_stage.websocket.invoke_url
}

resource "local_file" "browser_config" {
  content  = <<-EOT
    // This file is dynamically generated by Terraform.
    export const wsUrl = "${aws_apigatewayv2_stage.websocket.invoke_url}";
  EOT
  filename = "${local.browser_dir}/terraform-output.js"
}
