variable "password" {
    description = "A super secret password"
    type = string
    default = "password"  
}

variable "db_instance_type" {
    description = "Rds instance size"
    type = string
    default = "db.t3.micro"  
}

variable "ec2_instance_type" {
    description = "ec2 instance size"
    type = string
    default = "t3.micro"  
}

variable "username" {
    description = "Rds instance master user"
    type = string
    default = "postgres"  
}

variable "eng_version" {
    description = "Rds engine version"
    type = string
    default = "16"  
}

variable "eng" {
    description = "Rds engine"
    type = string
    default = "postgres"  
}

variable "database_name" {
    description = "Rds db name"
    type = string
    default = "speyederdb" 
}

variable "aws_region" {
    description = "Default region"
    type = string
    default = "eu-west-1"
}

variable "public_avz" {
    description = "Public availabity zone"
    type = string
    default = "eu-west-1a"
}

variable "private_avz" {
    description = "Private availabity zone"
    type = string
    default = "eu-west-1b"
}

variable "identifier" {
    description = "Identifier for your DB"
    type = string
    default = "rds-db"
}

variable "storage_type" {
    description = "Storage type"
    type = string
    default = "gp2"
}

variable "storage" {
    description = "Storage size in GB"
    type = number
    default = 20
}

variable "s3_prefix" {
    description = "S3 bucket prefix"
    type = string
    default = "speyeder"
}

variable "enabled_true" {
    description = "enabled"
    type = string
    default = "Enabled"
}

variable "min_value" {
    description = "Zero Value"
    type = number
    default = 0
}

variable "default_time" {
    description = "Minimum time to live"
    type = number
    default = 30
}

variable "max_time" {
    description = "Minimum time to live"
    type = number
    default = 60
}

variable "postgres_license_model" {
    description = "license model"
    type = string
    default = "postgresql-license"
}

variable "truthy" {
    description = "True"
    type = bool
    default = true
}

variable "falsy" {
    description = "False"
    type = bool
    default = false
}

variable "Environment_Type" {
    description = "False"
    type = string
    default = "SingleInstance"
}

variable "beanstalk_solution_stack" {
    description = "solution stack name"
    type = string
    default = "64bit Amazon Linux 2 v5.9.1 running Node.js 18"
}

variable "beanstalk_tier" {
    description = "application tier"
    type = string
    default = "WebServer"
}

variable "vpc_namespace" {
    description = "namespace"
    type = string
    default = "aws:ec2:vpc"
}

variable "asg_namespace" {
    description = "namespace"
    type = string
    default = "aws:autoscaling:asg"
}

variable "launchconfig_namespace" {
    description = "namespace"
    type = string
    default = "aws:autoscaling:launchconfiguration"
}

variable "env_namespace" {
    description = "namespace"
    type = string
    default = "aws:elasticbeanstalk:environment"
}