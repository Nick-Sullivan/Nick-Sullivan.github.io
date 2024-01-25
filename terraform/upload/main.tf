terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.33.0"
    }
  }
  backend "s3" {
    bucket = "nicks-terraform-states"
    key    = "resume_website/website_upload/terraform.tfstate"
    region = "ap-southeast-2"
  }
}

locals {
  prefix_parameter = "/WebsiteCv/production"
  build_folder     = "${path.root}/../../docs/_site" # Generated as part of build
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

module "template_files" {
  # Calculates the content_type of each file.
  # https://registry.terraform.io/modules/hashicorp/dir/template/latest
  source   = "hashicorp/dir/template"
  base_dir = local.build_folder
}

resource "aws_s3_object" "static_files" {
  # Loads all files to the s3 bucket
  for_each     = module.template_files.files
  bucket       = data.aws_ssm_parameter.s3_bucket_id.value
  key          = each.key
  content_type = each.value.content_type
  source       = each.value.source_path
  content      = each.value.content
  etag         = each.value.digests.md5
}


resource "terraform_data" "clear_cloudfront_cache" {
  depends_on = [aws_s3_object.static_files]

  provisioner "local-exec" {
    command     = "aws cloudfront create-invalidation --distribution-id ${data.aws_ssm_parameter.cloudfront_distribution_id.value} --paths '/*'"
  }

}
