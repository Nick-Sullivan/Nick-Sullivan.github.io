terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.56.1"
    }
  }
  backend "s3" {
    bucket = "nicks-terraform-states"
    region = "ap-southeast-2"
    key    = "pw-rust-chat-room.tfstate"
  }
}

provider "aws" {
  region = local.region
  default_tags {
    tags = local.tags
  }
}

data "aws_caller_identity" "identity" {}

locals {
  region           = "eu-west-2"
  prefix           = "RustChatRoom"
  prefix_lower     = "rust-chat-room"
  prefix_parameter = "/RustChatRoom"
  aws_account_id   = data.aws_caller_identity.identity.account_id
  root_dir         = "${path.root}/../.."
  lambda_dir       = "${local.root_dir}/server/rust-chat-room"
  browser_dir      = "${local.root_dir}/browser"
  tags = {
    Project = "Rust Chat Room"
  }
}
