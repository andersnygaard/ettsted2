# Task 221: Remove Dead Code

**Priority**: Medium
**Category**: Code Quality
**Effort**: Low (15 min)
**Impact**: Code Quality +1 point

## Problem

Unused code found:
- `components/src/ui/Container/` (duplicate)
- `frontend/src/shared/utils/__manual-test.ts`
- `frontend/src/shared/components/ErrorHandlingExample.tsx`
- Deprecated `getAuthToken` export

## Files to Delete

- `components/src/ui/Container/` (entire directory)
- `frontend/src/shared/utils/__manual-test.ts`
- `frontend/src/shared/components/ErrorHandlingExample.tsx`

## Files to Edit

- `frontend/src/shared/api/authToken.ts` - Remove deprecated export

## Acceptance Criteria

- [x] Duplicate Container removed
- [x] Test files removed
- [x] Demo components removed
- [x] Deprecated exports removed
- [x] Build passes
