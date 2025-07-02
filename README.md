# Movie Rating App

This is a REST API written in Node.js/TypeScript/NestJS that allows users to rate movies.

### Prerequisites

Node.js/npm
PostgreSQL
Docker

### Creating a PostgreSQL database on localhost

This assumes that PostgreSQL is already installed and running on the developer machine.

- Run the `./scripts/setup-local-db.sh` script.
- Install dependencies with `npm install`.
- Generate SQL schema migrations with `npm run db:schema:generate`
- Add test data to the database with `npm run db:testdata`

# Running the app locally in watch mode (for development)

`npm run start:dev`

# API Documentation in Swagger

The API is self-documented with swagger. Docs can be reached at `http://localhost:3000/api`.

# Running unit tests in watch mode

`npm run test:watch`

# Running E2E tests

The E2E tests use Testcontainers to start isolated PostgreSQL instances for each E2E test suite. This requires Docker to be running on the developer machine.

`npm run test:e2e`

# Lint

We use ESLint and Prettier for code formatting. Set up your IDE for auto-format on save, for a better developer experience.

Run linting with `npm run lint:eslint` and `npm run lint:prettier`.

# Building the code

`npm run build`
