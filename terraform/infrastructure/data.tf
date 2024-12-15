
data "aws_ssm_parameter" "delegation_set_id" {
  name = "${local.prefix_parameter}/Route53/DelegationSetId"
}

