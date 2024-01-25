
data "aws_ssm_parameter" "s3_bucket_id" {
  name = "${local.prefix_parameter}/S3/BucketId"
}

