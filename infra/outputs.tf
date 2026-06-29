output "cloudfront_domain" {
  description = "CloudFront distribution domain (use as site URL until custom domain is configured)"
  value       = "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "Distribution ID — required by the deploy CI for cache invalidation"
  value       = aws_cloudfront_distribution.site.id
}

output "s3_bucket" {
  description = "S3 bucket name for deploy CI sync"
  value       = aws_s3_bucket.site.bucket
}
