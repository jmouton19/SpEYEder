# RDS PostgreSQL Instance
resource "aws_db_instance" "speyeder_db" {
  identifier              = var.identifier
  allocated_storage       = var.storage
  storage_type            = var.storage_type
  db_name                 = var.database_name
  engine                  = var.eng
  engine_version          = var.eng_version
  instance_class          = var.db_instance_type
  username                = var.username
  password                = var.password
  skip_final_snapshot     = var.truthy
  publicly_accessible     = var.truthy
  backup_retention_period = var.min_value
  multi_az                = var.falsy
  db_subnet_group_name    = aws_db_subnet_group.default_group.name
  vpc_security_group_ids  = [aws_security_group.db_sg.id]
  availability_zone       = var.public_avz
  license_model           = var.postgres_license_model
}
