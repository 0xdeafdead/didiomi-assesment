# Didomi Assessment

This project is a **NestJS** starter application written in TypeScript, designed for efficient and scalable server-side development.
This project was develop to comply with [Didomi Backend Challenge](https://github.com/didomi/challenges/tree/master/backend)

## Features

- Built with the [NestJS](https://nestjs.com) framework.
- Ready-to-use setup for developing RESTful APIs and backend services.
- Includes testing configuration and scripts.

## Intended Software Architecture
![didiomi-code-challenge drawio](https://github.com/user-attachments/assets/e58e2d60-9049-47c4-a334-663a62e508a8)



## Prerequisites

- **Node.js** and **pnpm** installed globally.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/0xdeafdead/didiomi-assesment.git
   cd didiomi-assesment
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run databases and message broker
   Docker compose is used to run instance of PostgreSQL, MongoDB and RabbitMQ
   You will need [Docker Compose](https://docs.docker.com/compose/install/) installed to run it.
   ```bash
   docker compose up
   ```
4. Setup Environemnt Variables
   Since this is an assesment, most of the variable that would be envs were hardcoded. A .env is still needed.
   The proper values for this string connection can be found in the docker-compose.yml
   ```text
     DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
   ```
5. Setup Prisma
   [Prisma CLI](https://www.prisma.io/docs/orm/tools/prisma-cli#installation) is required for the next comamnds. Or `npx` can be used.
   First run the migrations:
   ```bash
     prisma migrate deploy
   ```
   Then, generate the Prisma Client
   ```bash
     prisma generate
   ```

## If no error has arose at this point, were ready to run the app

6. Running the project

- User-Manager: This app is in charge of creating, fetching and deleting user in postgres database. It also receives requests to update the users consents and send them to queue in RabbitMQ.
  To start user-manager application:
  ```bash
  npm run start:users
  ```
- Consent-Manager: This microservice is in charge of receiving the user's "change consent" messages from the queue to try to modify user's consent in the postgres database.
  If the user's consent is not changed by an error, the request is enqueue again. If the user's consent is done, a message is emitted to register the event through the logger-manager;
  To start the consent-manager microservice:
  ```bash
  npm run start:consent
  ```
- Logger-Manager: This microservice is in charge of receive event messages when a user consent is changed. This event's are registered in a mongo database with the name of the user that requested the change, the time the event was realized and the data that was modified converted to JSON.
  To start the logger-manager microservice:
  ```bash
  npm run start:logger
  ```

8. Running unit tests for each app
   To run user-manager application tests:
   ```bash
   npm run test:users
   ```
   To run consent-manager microservice tests:
   ```bash
   npm run test:consent
   ```
   To run logger-manager microservice tests:
   ```bash
   npm run test:logger
   ```
