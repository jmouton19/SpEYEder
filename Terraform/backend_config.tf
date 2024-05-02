terraform {
  backend "s3"{
  bucket = "temporaty-testing-terraform-backend"
  key = "terrraform.tfstate"
  region = "eu-west-1"
  }
}