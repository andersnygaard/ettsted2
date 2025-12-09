# 253 - Consolidate Error Interfaces

## Type
Refactor

## Priority
Medium

## Description
`ApiError` is defined in two places with different structures:
1. `frontend/src/shared/utils/errorTypes.ts` - Generic interface
2. `frontend/src/shared/api/client.ts` - Custom class

This causes type confusion. Consolidate to single source.

## Source
Due Diligence Report - Improvement #3

## Implementation

1. Keep `ApiError` class in `client.ts`
2. Export from `errorTypes.ts` (re-export)
3. Remove duplicate interface
4. Add runtime type guards for all error scenarios
5. Update all imports

### Files to modify:
- `frontend/src/shared/api/client.ts` - Keep class
- `frontend/src/shared/utils/errorTypes.ts` - Re-export, remove duplicate
- Any files importing from both locations

## Acceptance Criteria
- [x] Single `ApiError` definition
- [x] Type guards work correctly
- [x] All error handling still works
- [x] TypeScript compiles without errors

## Effort
Low (30 min)
