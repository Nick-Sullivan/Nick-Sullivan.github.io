resource "aws_cloudwatch_log_group" "api" {
  name              = "/aws/lambda/${local.prefix}-API"
  retention_in_days = 90
}

resource "aws_lambda_function" "api" {
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.lambda.repository_url}@${data.aws_ecr_image.lambda.id}"
  function_name = "${local.prefix}-API"
  role          = aws_iam_role.lambda_api.arn
  timeout       = 5
  image_config {
    entry_point = ["/ws_handler_cloud"]
  }
  depends_on = [
    aws_cloudwatch_log_group.api,
    terraform_data.lambda_push,
  ]
  environment {
    variables = {
      WEBSOCKET_TABLE_NAME = aws_dynamodb_table.websocket_connection.name,
      API_GATEWAY_URL      = aws_apigatewayv2_stage.websocket.invoke_url,
    }
  }
}

resource "aws_iam_role" "lambda_api" {
  name               = "${local.prefix}-API"
  description        = "Allows Lambda run"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_role_policy" "api_connections" {
  name   = "ApiConnections"
  role   = aws_iam_role.lambda_api.name
  policy = data.aws_iam_policy_document.api_connections.json
}

resource "aws_iam_role_policy" "access_dynamodb" {
  name   = "DynamoDB"
  role   = aws_iam_role.lambda_api.name
  policy = data.aws_iam_policy_document.access_dynamodb.json
}

resource "aws_iam_role_policy_attachment" "execute_api_lambda" {
  role       = aws_iam_role.lambda_api.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "api_connections" {
  # Allow Lambda to send messages to API gateway connections
  statement {
    actions = [
      "execute-api:ManageConnections",
    ]
    effect    = "Allow"
    resources = ["arn:aws:execute-api:${local.region}:${local.aws_account_id}:${aws_apigatewayv2_api.websocket.id}/*"]
  }
}

data "aws_iam_policy_document" "access_dynamodb" {
  statement {
    actions = [
      "dynamodb:ConditionCheckItem",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:UpdateItem",
    ]
    effect = "Allow"
    resources = [
      aws_dynamodb_table.websocket_connection.arn,
      "${aws_dynamodb_table.websocket_connection.arn}/index/*"
    ]
  }
}
