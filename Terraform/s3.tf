# S3 Bucket for Static Website

resource "aws_s3_bucket" "speyeder_site_bucket" {
  bucket_prefix = var.s3_prefix
}

locals {
  s3_origin_id = aws_s3_bucket.speyeder_site_bucket.id
  s3_origin_arn = aws_s3_bucket.speyeder_site_bucket.arn
  s3_origin_domain = aws_s3_bucket.speyeder_site_bucket.bucket_regional_domain_name
  s3_origin_name = aws_s3_bucket.speyeder_site_bucket.bucket
}

resource "aws_s3_bucket_versioning" "versioning_bucket" {
  bucket = local.s3_origin_id
  versioning_configuration {
    status = var.enabled_true
  }
}

resource "aws_s3_bucket_website_configuration" "static_site" {
  bucket = local.s3_origin_id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_policy" "cloudfront_access_policy" {
  bucket = local.s3_origin_id
  policy = jsonencode({
    Id = "Policy1714406826883"
    Statement = [
      {
        Sid = "Stmt1714406819936"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action = "s3:GetObject"        
        Resource = "${local.s3_origin_arn}/*"
        Condition = {
            StringEquals = {
                "AWS:SourceArn" = aws_cloudfront_distribution.static_site_distribution.arn
            }
        }
      }
    ]
    Version = "2012-10-17"
  })
}



