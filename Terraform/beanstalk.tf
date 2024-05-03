# Beanstalk Application
resource "aws_elastic_beanstalk_application" "speyeder_app" {
  name        = "speyeder-app"
  description = "Node.js Beanstalk Application"
}

# Beanstalk environment
resource "aws_elastic_beanstalk_environment" "speyeder_env" {
  name                = "speyeder-env"
  application         = aws_elastic_beanstalk_application.speyeder_app.name
  solution_stack_name = var.beanstalk_solution_stack
  tier                = var.beanstalk_tier

  setting {
    namespace = var.vpc_namespace
    name      = "VPCId"
    value     = aws_vpc.main.id
  }

  setting {
    namespace = var.vpc_namespace
    name      = "Subnets"
    value     = aws_subnet.subnet_1.id
  }

  setting {
    namespace = var.launchconfig_namespace
    name      = "IamInstanceProfile"
    value     =  aws_iam_instance_profile.beanstalk_profile.id
  }

  setting {
    namespace = var.vpc_namespace
    name      = "AssociatePublicIpAddress"
    value     =  var.truthy
  }

  setting {
    namespace = var.launchconfig_namespace
    name      = "InstanceType"
    value     = var.ec2_instance_type
  }

  setting {
    namespace = var.launchconfig_namespace
    name      = "SecurityGroups"
    value     = aws_security_group.beanstalk_sg.id
  }

  setting {
    namespace = var.asg_namespace
    name      = "MinSize"
    value     = 1
  }

  setting {
    namespace = var.asg_namespace
    name      = "MaxSize"
    value     = 1
  }

  setting {
    namespace = var.env_namespace
    name      = "EnvironmentType"
    value     = var.Environment_Type 
  }
}

# Beanstalk IAM Role
resource "aws_iam_role" "beanstalk_ec2_role" {
  name = "beanstalk_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })

  managed_policy_arns = [
    "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier",
    "arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker",
    "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier"
  ]

}

resource "aws_iam_instance_profile" "beanstalk_profile" {
  name = "beanstalk_profile"
  role = aws_iam_role.beanstalk_ec2_role.name
}

