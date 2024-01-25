
data "aws_ssm_parameter" "s3_bucket_id" {
  name = "${local.prefix_parameter}/S3/BucketId"
}

data "aws_ssm_parameter" "cloudfront_distribution_id" {
  name = "${local.prefix_parameter}/CloudFront/DistributionId"
}