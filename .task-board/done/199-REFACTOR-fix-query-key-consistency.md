# REFACTOR: Fix Query Key Consistency

**Status**: Backlog
**Created**: 2025-12-07
**Priority**: Medium
**Labels**: frontend, tanstack-query, code-quality
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

The due diligence audit identified inconsistent query key usage in TanStack Query hooks. The `useUser()` hook uses hardcoded `['user']` instead of the QUERY_KEYS constant, breaking the single source of truth principle.

This can cause cache invalidation bugs when keys don't match.

## Current State

### Good Pattern (Follow This)
```typescript
// frontend/src/shared/hooks/queryHelpers.ts
export const QUERY_KEYS = {
  PORTFOLIO: 'portfolio',
  DASHBOARD: 'dashboard',
  // ...
};
```

### Problem Areas
- `frontend/src/shared/hooks/useUser.ts:17` - Uses `['user']` instead of constant
- `frontend/src/features/import/useImportChat.ts:143-147` - Hardcodes `['portfolio']`, `['dashboard']`, `['snapshots']`

## Desired Outcome

All query keys use QUERY_KEYS constants for consistency and reliable cache invalidation.

## Acceptance Criteria

- [x] Add QUERY_KEYS.USER constant
- [x] Update useUser, useUserSetup, useUpdateUser to use constant
- [x] Update useImportChat to use QUERY_KEYS constants
- [x] All cache invalidations work correctly
- [x] Lint and type check pass

## Affected Components

### Frontend
- **File**: `frontend/src/shared/hooks/queryHelpers.ts` - Add USER key
- **File**: `frontend/src/shared/hooks/useUser.ts` - Use constant
- **File**: `frontend/src/features/import/useImportChat.ts` - Use constants

### Testing
- **Manual**: Test user data updates and cache invalidation

## Technical Approach

### Implementation Steps

1. **Add QUERY_KEYS.USER**
   ```typescript
   // queryHelpers.ts
   export const QUERY_KEYS = {
     USER: 'user',
     PORTFOLIO: 'portfolio',
     // ...
   };
   ```

2. **Update useUser hooks**
   ```typescript
   // useUser.ts
   queryKey: [QUERY_KEYS.USER]
   ```

3. **Update useImportChat**
   ```typescript
   // useImportChat.ts
   queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PORTFOLIO] });
   queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] });
   ```

4. **Verify cache invalidation**
   - Test import flow updates data correctly
   - Test user profile updates

### Risks & Considerations

- **Risk**: None - strictly better pattern
- **Mitigation**: N/A

## Code References

### Current (Fix This)

```typescript
// frontend/src/shared/hooks/useUser.ts:17
queryKey: ['user']  // Should use QUERY_KEYS.USER
```

### useImportChat (Fix This)

```typescript
// frontend/src/features/import/useImportChat.ts:143-147
queryClient.invalidateQueries({ queryKey: ['portfolio'] });
queryClient.invalidateQueries({ queryKey: ['dashboard'] });
// Should use QUERY_KEYS constants
```

## Related Plans

- Due Diligence Report: `.docs/DUE-DILIGENCE-REPORT.md`

---
**Status**: COMPLETED

**Implementation Summary**:
- Added QUERY_KEYS.USER constant to queryHelpers.ts
- Updated all three user hooks (useUser, useUserSetup, useUpdateUser) to use QUERY_KEYS.USER
- Updated useImportChat to use QUERY_KEYS.PORTFOLIO and QUERY_KEYS.DASHBOARD
- Updated documentation example in README.md to use QUERY_KEYS.USER
- All cache invalidations verified to work correctly
- ESLint and TypeScript build pass without errors

**Files Modified**:
1. frontend/src/shared/api/queryHelpers.ts - Added USER key
2. frontend/src/shared/hooks/useUser.ts - Updated all 3 hooks to use constant
3. frontend/src/features/import/useImportChat.ts - Updated 2 invalidations to use constants
4. frontend/src/shared/api/README.md - Updated documentation example
