variable "project" {
  description = "Project slug used in resource names"
  type        = string
  default     = "minfyr-site"
}

variable "env" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region for S3 bucket (CloudFront is global)"
  type        = string
  default     = "us-east-1"
}
