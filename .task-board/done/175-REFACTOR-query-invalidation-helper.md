# 175 - REFACTOR: Extract Query Invalidation Helper

**Type**: Refactor
**Priority**: LOW
**Effort**: Simple

---

## Problem

Query invalidation logic duplicated 3 times in usePortfolioData.ts:

```typescript
// Lines 175-182, 207-213, 232-238
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['portfolio'] });
  queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  queryClient.invalidateQueries({ queryKey: ['sparing'] });
  queryClient.invalidateQueries({ queryKey: ['gjeld'] });
  queryClient.invalidateQueries({ queryKey: ['pensjon'] });
}
```

15 lines duplicated across 3 mutations.

---

## Solution

Extract to shared helper function.

---

## Tasks

- [x] Create `frontend/src/shared/api/queryHelpers.ts`:
  ```typescript
  import { QueryClient } from '@tanstack/react-query';

  export const QUERY_KEYS = {
    PORTFOLIO: ['portfolio'],
    DASHBOARD: ['dashboard'],
    SPARING: ['sparing'],
    GJELD: ['gjeld'],
    PENSJON: ['pensjon'],
  } as const;

  export function invalidateAllPortfolioQueries(queryClient: QueryClient): void {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PORTFOLIO });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SPARING });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GJELD });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PENSJON });
  }
  ```

- [x] Update usePortfolioData.ts:
  ```typescript
  import { invalidateAllPortfolioQueries } from '@/shared/api/queryHelpers';

  // In mutations:
  onSuccess: () => invalidateAllPortfolioQueries(queryClient)
  ```

- [x] Update other hooks to use QUERY_KEYS constants
- [x] Type check: `pnpm build` (passed)

---

## Acceptance Criteria

- [x] queryHelpers.ts created
- [x] QUERY_KEYS exported for type safety
- [x] invalidateAllPortfolioQueries used in all 3 mutations
- [x] Other hooks use QUERY_KEYS
- [x] Build passes (TypeScript compilation verified)

---

## References

- Due Diligence Report: .docs/DUE-DILIGENCE-REPORT.md (Code Quality)
- File: frontend/src/features/portfolio/usePortfolioData.ts
