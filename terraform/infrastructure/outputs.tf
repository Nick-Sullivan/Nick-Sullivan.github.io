
resource "aws_ssm_parameter" "s3_bucket_id" {
  name  = "${local.prefix_parameter}/S3/BucketId"
  type  = "String"
  value = aws_s3_bucket.website.id
}