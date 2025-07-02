# Choice of cache

Date: 2025-07-02

### Status

Undecided

### Context

We might want to cache data from the database, to improve performance.
There are several solutions:

- In-memory cache in Node.js
- Redis
- Relying on PostgreSQL's built-in query cache
- (potential other solutions)

We could also improve performance by tweaking SQL queries, adjusting database indexes etc.

A combination of all techniques would be ideal for a very scalable solution, but would also be much more complex technically. The chosen solution should be the simplest implementation that still satisfies requirements for scalability and performance. We need to consider how many users, movies and ratings we have, and how much traffic the application will receive.
