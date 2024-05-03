output "s3_bucket_name" {
  value = aws_s3_bucket.speyeder_site_bucket.bucket
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.static_site_distribution.id
}

# website url https://
output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.static_site_distribution.domain_name
}

output  "s3_origin_id" {
  value = aws_s3_bucket.speyeder_site_bucket.id
}

output  "s3_origin_arn"{
 value = aws_s3_bucket.speyeder_site_bucket.arn 
} 

output "s3_origin_domain" {
    value = aws_s3_bucket.speyeder_site_bucket.bucket_regional_domain_name
    }

output  "cloudfront_arn" {
    value = aws_cloudfront_distribution.static_site_distribution.arn
}

output  "beanstalk_endpoint" {
    value = aws_elastic_beanstalk_environment.speyeder_env.endpoint_url
}

output  "rds_endpoint" {
    value = aws_db_instance.speyeder_db.address
}