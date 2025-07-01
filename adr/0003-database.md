# Choice of PostgreSQL and Prisma

Date: 2025-07-02

### Status

Accepted

### Context

We need a way to store and retrieve data. We choose PostgreSQL because it is open source, tried and tested, widely available and most developers know it or can easily pick it up.

Prisma is the go-to ORM library nowadays. We could alternatively have written SQL queries by hand, instead of using an ORM.

### Consequences

Developers need to learn PostgreSQL and Prisma. We have less control over exactly which SQL is executed, because it is abstracted away by the library.
