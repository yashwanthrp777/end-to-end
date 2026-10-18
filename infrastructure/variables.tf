variable "aws_region" {
  description = "The AWS region to deploy CloudCart infrastructure"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (e.g. staging, production)"
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "cloudcart"
}

variable "db_username" {
  description = "Database administrator username"
  type        = string
  default     = "cloudcartadmin"
}

variable "db_password" {
  description = "Database administrator password"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Initial PostgreSQL database name"
  type        = string
  default     = "cloudcart_db"
}

variable "frontend_image" {
  description = "Docker image for the frontend service"
  type        = string
  default     = "cloudcart-frontend:latest"
}

variable "backend_image" {
  description = "Docker image for the backend service"
  type        = string
  default     = "cloudcart-backend:latest"
}

variable "jwt_secret" {
  description = "Secret key for signing JSON Web Tokens"
  type        = string
  sensitive   = true
}
