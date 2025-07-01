# Choice of web frameworok: NestJS

Date: 2025-07-01

### Status

Accepted

### Context

The "team" (consisting of 1 person) is most familiar with the Node.js/TypeScript/NestJS stack or Kotlin/Spring stack. Node.js is chosen because it's the most familiar, and the task can be solved in any language of choice.

One could build the application using Node.js directly, or via a low-level library like Express. Alternatively, a high-level library like NestJS can be chosen.

### Decision

NestJS was chosen, because it provides many benefits in this use case.

### Consequences

The framework has built-in functionality for dependency injection, session handling etc., and also a good philosophy for automated unit testing and E2E testing. It dictates a certain code structuring and pattern, which scales well to bigger teams.

The trade-off is a somewhat bigger bundle size, and slower startup time. Other developers will also have to learn the NestJS framework. However, since it's a commenly used framework, one can expect many developers to already know it, or to learn it relatively quickly.
