# REFACTOR: Two-Layer Validation Framework

**Status**: Backlog
**Created**: 2025-11-28
**Priority**: Medium
**Labels**: backend, validation, security, refactor
**Estimated Effort**: Medium - 2-3 days

## Context & Motivation

CLAUDE.md specifies two-layer validation: input validation (format, types) and business validation (uniqueness, authorization). This refactor consolidates validation patterns into reusable middleware and utilities.

## Current State

- Some validation in route handlers (inconsistent)
- **No unified validation framework**

## Desired Outcome

- Input validation middleware (Zod schemas)
- Business validation service methods
- Validation error responses in standard format
- Reusable validation schemas

## Acceptance Criteria

- [ ] Input validation middleware using Zod
- [ ] Validation error responses: `{ error: { message, code: 'VALIDATION_ERROR', details }, success: false }`
- [ ] Business validation in service layer (uniqueness, ownership)
- [ ] All API endpoints use validation middleware
- [ ] Unit tests for validation logic

## Technical Approach

**Input Validation Middleware**:
```typescript
import { z } from 'zod';

export const validate = (schema: z.ZodSchema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.errors
      },
      success: false
    });
  }
};

// Usage
const createSnapshotSchema = z.object({
  date: z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/),
  accounts: z.array(z.object({
    name: z.string().min(1).max(100),
    assetClass: z.string(),
    value: z.number().positive()
  }))
});

router.post('/snapshots', validate(createSnapshotSchema), createSnapshot);
```

**Business Validation** (in services):
```typescript
// Check username uniqueness
const existing = await UserService.getUserByUsername(username);
if (existing) {
  throw new ConflictError('Username already taken');
}

// Check resource ownership
if (snapshot.userId !== req.user.userId) {
  throw new ForbiddenError('Not authorized');
}
```

## Dependencies

- `FEATURE-backend-express-server.md`
- All API endpoint plans (apply validation to all)

---

**Next Steps**: Ready after initial API endpoints implemented.
