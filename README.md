# SpEYEder Project Readme

## Introduction
Welcome to SpEYEder, a project aimed to reveal what information the web has on you.

## Setting up the Database
### AWS RDS Setup
1. Ensure you have an AWS account.
2. Set up an RDS instance using the PostgreSQL database engine.
3. Set the appropriate GitHub secrets for your AWS credentials.
4. Run the "deploy aws infrastructure" workflow to deploy the necessary infrastructure on AWS.
5. Run the Flyway migration script to create the necessary database schema and tables.

### Local Database Setup
1. If you prefer, you can set up a database locally.
2. Run the Flyway migration script to create the necessary database schema and tables.

## Running the Program
1. Clone this repository to your local machine.
2. Navigate to the `backend` folder in your terminal.
3. Run `npm i` to install the required dependencies.
4. Run `npm start` to start the SpEYEder program.
5. Login via Google and Github to reveal your information.
