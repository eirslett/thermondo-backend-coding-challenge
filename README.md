# Movie Rating App

This is a REST API written in Node.js/TypeScript/NestJS that allows users to rate movies.

### Prerequisites

Node.js/npm
PostgreSQL

### Creating a PostgreSQL database on localhost

This assumes that PostgreSQL is already installed and running on the developer machine.

- Run the `./scripts/setup-local-db.sh` script.
- Install dependencies with `npm install`.
- Generate SQL schema migrations with `npm run db:schema:generate`
- Add test data to the database with `npm run db:testdata`

# Running the app locally in watch mode (for development)

`npm run start:dev`

# Running unit tests in watch mode

`npm run test:watch`

# Building the code

`npm run build`
