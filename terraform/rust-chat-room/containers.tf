

resource "aws_ecr_repository" "lambda" {
  name                 = "${local.prefix_lower}-lambda"
  image_tag_mutability = "MUTABLE"
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = false
  }
}

resource "aws_ecr_lifecycle_policy" "lambda" {
  repository = aws_ecr_repository.lambda.name

  # May take up to 24 hours to expire old images
  policy = <<EOF
    {
        "rules": [
        {
            "rulePriority": 1,
            "description": "Keep last image",
            "selection": {
            "tagStatus": "any",
            "countType": "imageCountMoreThan",
            "countNumber": 1
            },
            "action": {
            "type": "expire"
            }
        }
        ]
    }
    EOF
}

resource "terraform_data" "lambda_build" {
  # always trigger a rebuild. In bigger projects we can split this
  # out into a deployment script instead of bundling it with the infrastructure.
  depends_on       = [aws_ecr_repository.lambda]
  triggers_replace = [timestamp()]
  provisioner "local-exec" {
    working_dir = local.lambda_dir
    command     = "docker build -t ${aws_ecr_repository.lambda.repository_url} ."
  }
}

resource "terraform_data" "lambda_push" {
  depends_on = [terraform_data.lambda_build]
  lifecycle {
    replace_triggered_by = [terraform_data.lambda_build]
  }
  provisioner "local-exec" {
    working_dir = local.lambda_dir
    command     = "aws ecr get-login-password --region ${local.region} | docker login --username AWS --password-stdin ${local.aws_account_id}.dkr.ecr.${local.region}.amazonaws.com"
  }
  provisioner "local-exec" {
    working_dir = local.lambda_dir
    command     = "docker push ${aws_ecr_repository.lambda.repository_url}:latest"
  }
}

data "aws_ecr_image" "lambda" {
  depends_on = [
    terraform_data.lambda_push
  ]
  repository_name = aws_ecr_repository.lambda.name
  image_tag       = "latest"
}
