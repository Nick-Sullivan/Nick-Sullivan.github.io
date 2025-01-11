

resource "aws_dynamodb_table" "websocket_connection" {
  name         = "${local.prefix}Websocket"
  hash_key     = "id"
  billing_mode = "PAY_PER_REQUEST"
  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "room_id"
    type = "S"
  }

  global_secondary_index {
    name            = "room_id_index"
    hash_key        = "room_id"
    projection_type = "ALL"
  }
}
