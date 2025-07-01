# Code Style enforced with Prettier

Date: 2025-07-01

### Status

Accepted

### Context

We should keep a consistent code style. Developers seem to never agree on what code style is perfect, but most importantly, there must be a consistent code style.

### Decision

The code is formatted using Prettier's default settings, with no customization whatsoever.

The default ESLint setup bundled with NestJS is used.

### Consequences

No time is wasted on nit-picky discussions about code style. This lets us focus on higher-level architecture discussions. On the flip side, everybody doesn't necessarily like Prettier's opiniated style.
