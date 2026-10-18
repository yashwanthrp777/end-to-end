output "vpc_id" {
  description = "ID of the VPC created for CloudCart"
  value       = module.vpc.vpc_id
}

output "rds_endpoint" {
  description = "PostgreSQL RDS connection endpoint"
  value       = module.rds.endpoint
}

output "alb_dns_name" {
  description = "Application Load Balancer public DNS URL"
  value       = module.ecs.alb_dns_name
}
