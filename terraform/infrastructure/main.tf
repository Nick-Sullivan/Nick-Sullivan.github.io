terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.33.0"
    }
  }
  backend "s3" {
    bucket = "nicks-terraform-states"
    key    = "resume_website/website_contents/terraform.tfstate"
    region = "ap-southeast-2"
  }
}

locals {
  prefix_parameter = "/WebsiteCv/production"
  url              = "nickdavesullivan.com"
  url_www          = "www.${local.url}"
  tags = {
    Project     = "Website CV"
    Environment = "production"
  }
}

provider "aws" {
  region = "ap-southeast-2"
  default_tags {
    tags = local.tags
  }
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"
  default_tags {
    tags = local.tags
  }
}

# S3 bucket to hold website files

resource "aws_s3_bucket" "website" {
  bucket = local.url
}

resource "aws_s3_bucket_website_configuration" "website" {
  bucket = aws_s3_bucket.website.bucket
  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id
}

resource "aws_s3_bucket_policy" "website" {
  depends_on = [aws_s3_bucket_public_access_block.website]
  bucket     = aws_s3_bucket.website.id
  policy     = data.aws_iam_policy_document.allow_public_get.json
}

data "aws_iam_policy_document" "allow_public_get" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    resources = [
      "arn:aws:s3:::${aws_s3_bucket.website.id}/*"
    ]
    sid = "PublicReadGetObject"
  }
}

# Create a CloudFront distribution that redirects to the S3 bucket, and allows SSL

module "cloudfront" {
  source            = "./../modules/website_cloudfront"
  domain_name       = local.url
  alternative_names = [local.url_www]
  # We use the URL rather than the bucket_regional_domain_name so that subfolders can be loaded correctly.
  # From https://stackoverflow.com/questions/31017105/how-do-you-set-a-default-root-object-for-subdirectories-for-a-statically-hosted/65146447#65146447
  redirect_url = aws_s3_bucket.website.website_endpoint
  zone_id      = aws_route53_zone.website.zone_id
  providers = {
    aws = aws.us-east-1
  }
}

# Create a hosted zone for our domain and point it to CloudFront.

resource "aws_route53_zone" "website" {
  name              = local.url
  delegation_set_id = data.aws_ssm_parameter.delegation_set_id.value
}

resource "aws_route53_record" "ipv4" {
  zone_id = aws_route53_zone.website.zone_id
  name    = local.url
  type    = "A"
  alias {
    name                   = module.cloudfront.domain_name
    zone_id                = module.cloudfront.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "ipv6" {
  zone_id = aws_route53_zone.website.zone_id
  name    = local.url
  type    = "AAAA"
  alias {
    name                   = module.cloudfront.domain_name
    zone_id                = module.cloudfront.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "ipv4_www" {
  zone_id = aws_route53_zone.website.zone_id
  name    = local.url_www
  type    = "A"
  alias {
    name                   = module.cloudfront.domain_name
    zone_id                = module.cloudfront.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "ipv6_www" {
  zone_id = aws_route53_zone.website.zone_id
  name    = local.url_www
  type    = "AAAA"
  alias {
    name                   = module.cloudfront.domain_name
    zone_id                = module.cloudfront.hosted_zone_id
    evaluate_target_health = false
  }
}
