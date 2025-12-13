---
paths:
  - backend/**/*
---

# Services Rules

## Stack
TypeScript, pure functions

## Structure
- `/services/userService.ts` - User CRUD + profile management
- `/services/portfolioService.ts` - Snapshot/account CRUD + querying
- `/services/accountService.ts` - Account configuration management
- `/services/calculatorService.ts` - Financial calculations (Monte Carlo, FIRE, etc.)
- `/services/calculationService.ts` - Utility calculations (net worth, coverage, savings rate)
- `/services/onboardingService.ts` - User setup flow
- `/services/importAgentService.ts` - LLM import agent
- `/services/openaiService.ts` - OpenAI API wrapper
- `/services/langfuseService.ts` - Observability/tracing

## Patterns
- Pure functions: calculationService has no side effects
- Static methods: `UserService.getUserById(userId)`
- Error propagation: throw AppError subclasses, let middleware handle
- Logging: all operations logged with context (userId, operation, outcome)

## Decisions
- Services encapsulate ALL database operations (not controllers)
- Controllers only handle HTTP concerns (req/res/validation)
- Business validation in services (ownership checks, uniqueness)

## Gotchas
- Portfolio service fetches ALL snapshots then sorts in JS (string date limitation)
- Never return raw CosmosDB documents - always map to typed models
- updateUser/updateSnapshot preserve immutable fields (id, createdAt)
- deleteAllSnapshotsForUser for account cleanup
