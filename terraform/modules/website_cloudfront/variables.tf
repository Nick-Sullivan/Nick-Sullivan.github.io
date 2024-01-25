
variable "domain_name" {
  description = "The domain, e.g. nickdavesullivan.com"
  type        = string
}

variable "alternative_names" {
  description = "Other names pointing to this domain, e.g. www.nickdavesullivan.com"
  type        = list(string)
}

variable "zone_id" {
  description = "The Route53 zone ID to add records to"
  type        = string
}

variable "redirect_url" {
  description = "The URL of the web page containing the index.html"
  type        = string
}