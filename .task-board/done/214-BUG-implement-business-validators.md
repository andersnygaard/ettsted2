# Task 214: Implement Business Validators

**Priority**: High
**Category**: Bug/Security
**Effort**: Medium (1 hour)
**Impact**: Security +3 points

## Problem

`validateSnapshotOwnership()` and `validateUniqueDateForUser()` are placeholders.

## Files

- `backend/src/middleware/businessValidators.ts`
- `backend/src/services/portfolioService.ts`

## Implementation

1. validateSnapshotOwnership: Check userId matches snapshot owner
2. validateUniqueDateForUser: Prevent duplicate dates per user

## Acceptance Criteria

- [x] Ownership validation returns 403 if not owner
- [x] Date uniqueness returns 409 on conflict
- [x] E2E tests pass
