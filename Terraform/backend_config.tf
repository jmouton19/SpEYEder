terraform {
  backend "s3"{
  bucket = "speyeder-terraform-state-store"
  key = "terrraform.tfstate"
  region = "eu-west-1"
  }
}