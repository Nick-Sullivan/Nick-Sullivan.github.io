
resource "aws_ssm_parameter" "s3_bucket_id" {
  name  = "${local.prefix_parameter}/S3/BucketId"
  type  = "String"
  value = aws_s3_bucket.website.id
}

resource "aws_ssm_parameter" "cloudfront_distribution_id" {
  name  = "${local.prefix_parameter}/CloudFront/DistributionId"
  type  = "String"
  value = module.cloudfront.distribution_id
}

output "cloudfront_distribution_id" {
  value = module.cloudfront.distribution_id
}
