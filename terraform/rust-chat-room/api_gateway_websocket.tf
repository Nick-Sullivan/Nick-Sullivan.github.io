resource "aws_apigatewayv2_api" "websocket" {
  name                       = "${local.prefix}-Websocket"
  protocol_type              = "WEBSOCKET"
  route_selection_expression = "$request.body.action"
}

resource "aws_apigatewayv2_stage" "websocket" {
  api_id      = aws_apigatewayv2_api.websocket.id
  name        = "production"
  auto_deploy = true # needed, otherwise it requires a manual deploy to overcome 403 error
  default_route_settings {
    data_trace_enabled     = false
    throttling_burst_limit = 5000
    throttling_rate_limit  = 10000
  }
}

resource "aws_apigatewayv2_deployment" "websocket" {
  depends_on = [
    aws_apigatewayv2_route.connect,
    aws_apigatewayv2_route.disconnect,
    aws_apigatewayv2_route.default,
    aws_apigatewayv2_integration.websocket
  ]
  api_id      = aws_apigatewayv2_api.websocket.id
  description = "Terraform deployment"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lambda_permission" "websocket" {
  statement_id  = "AllowExecutionFromAPIGatewayWebsocket"
  action        = "lambda:InvokeFunction"
  function_name = "${local.prefix}-API"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:${local.region}:${local.aws_account_id}:${aws_apigatewayv2_api.websocket.id}/*/*"
}
