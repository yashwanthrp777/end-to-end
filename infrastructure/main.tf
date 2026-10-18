terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "CloudCart"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# 1. VPC Module
module "vpc" {
  source      = "./modules/vpc"
  app_name    = var.app_name
  environment = var.environment
}

# 2. RDS PostgreSQL Module
module "rds" {
  source             = "./modules/rds"
  app_name           = var.app_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  subnet_ids         = module.vpc.private_subnet_ids
  db_security_group  = module.vpc.db_security_group_id
  db_name            = var.db_name
  db_username        = var.db_username
  db_password        = var.db_password
}

# 3. ECS Fargate Cluster & Services Module
module "ecs" {
  source             = "./modules/ecs"
  app_name           = var.app_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  public_subnets     = module.vpc.public_subnet_ids
  private_subnets    = module.vpc.private_subnet_ids
  frontend_image     = var.frontend_image
  backend_image      = var.backend_image
  db_host            = module.rds.endpoint
  db_name            = var.db_name
  db_user            = var.db_username
  db_password        = var.db_password
  jwt_secret         = var.jwt_secret
}
