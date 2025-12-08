# Task 213: Add Param Validation to Account Routes

**Priority**: High
**Category**: Bug
**Effort**: Low (15 min)
**Impact**: Code Quality +1 point

## Problem

PATCH/DELETE `/accounts/:id` missing path param validation.

## Files

- `backend/src/routes/accountRoutes.ts`

## Implementation

Add `validateParams(accountConfigIdSchema)` to PATCH and DELETE routes.

## Acceptance Criteria

- [x] PATCH validates accountId param
- [x] DELETE validates accountId param
- [x] Invalid IDs return 400
- [x] E2E tests pass
