---
paths:
  - backend/**/*
---

# Errors Rules

## Stack
Custom error classes, express global error handler

## Structure
- `/errors/AppError.ts` - Base class + subclasses
- `/errors/index.ts` - Re-exports
- `/middleware/errorHandler.ts` - Global handler

## Error Hierarchy
```typescript
AppError (base)
├── ValidationError (400, VALIDATION_ERROR)
├── ForbiddenError (403, FORBIDDEN)
├── NotFoundError (404, NOT_FOUND)
├── ConflictError (409, CONFLICT)
└── InternalServerError (500, INTERNAL_SERVER_ERROR)
```

## Patterns
- All errors have: statusCode, code, message, details (optional)
- Global handler catches all sync/async errors
- Stack traces only in development
- `asyncHandler` wrapper required for async route handlers

## Response Format
```json
{
  "error": {
    "message": "User not found",
    "code": "NOT_FOUND",
    "details": {...}  // dev only
  },
  "success": false
}
```

## Decisions
- Never expose internal errors to client in production
- Always use typed error classes (not generic Error)
- Log full context: path, method, IP, status code

## Gotchas
- Express doesn't catch async errors by default - use asyncHandler
- CosmosDB 404 → return null in service, not throw NotFoundError
- CosmosDB 409 → throw ConflictError (let controller decide response)
- Validation errors include field-level details from Zod
