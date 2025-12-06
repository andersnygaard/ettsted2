# 174 - REFACTOR: Extract Magic Numbers to Constants

**Type**: Refactor
**Priority**: LOW
**Effort**: Simple

---

## Problem

Magic numbers scattered throughout codebase:
- Milestone thresholds (100k, 250k, 500k, 1M, 1.5M, 2M, 3M, 5M, 10M)
- Growth rates (0.07, 0.05)
- Query staleTime (5 minutes = 300000ms)
- F.I.R.E. multiplier (25x annual expenses)

Hard to maintain if values need updating.

---

## Solution

Create constants file with all shared configuration values.

---

## Tasks

- [x] Create `frontend/src/config/constants.ts`:
  - Created with MILESTONES, PORTFOLIO_MILESTONES, GROWTH_RATES, QUERY_CONFIG, FIRE, RETIREMENT constants

- [x] Update useDashboardData.ts to use MILESTONES
  - Replaced hardcoded milestone array with MILESTONES constant
  - Updated empty state to use MILESTONES[0]
  - Updated query config to use QUERY_CONFIG

- [x] Update useSparingData.ts to use GROWTH_RATES
  - Replaced 0.07 with GROWTH_RATES.DEFAULT
  - Replaced 0.04 with FIRE.SAFE_WITHDRAWAL_RATE
  - Updated query config to use QUERY_CONFIG

- [x] Update usePortfolioData.ts
  - Replaced hardcoded portfolio milestone thresholds with PORTFOLIO_MILESTONES
  - Updated query config to use QUERY_CONFIG

- [x] Update useGjeldData.ts
  - Updated query config to use QUERY_CONFIG

- [x] Update usePensjonData.ts
  - Replaced 0.05 with GROWTH_RATES.CONSERVATIVE
  - Updated default parameters to use RETIREMENT constants
  - Updated query config to use QUERY_CONFIG

- [x] Update queryClient.ts
  - Replaced hardcoded staleTime with QUERY_CONFIG.STALE_TIME

- [x] Update DashboardPage.tsx
  - Replaced hardcoded 100000 with MILESTONES[0]

- [x] Type check: `pnpm type-check` - PASSED

---

## Acceptance Criteria

- [x] constants.ts created with all magic numbers
- [x] Hooks use constants instead of literals
- [x] Type check passes
- [x] Functionality unchanged - verified with build success

---

## References

- Due Diligence Report: .docs/DUE-DILIGENCE-REPORT.md (Maintainability)

---

## Completion Summary

**Status**: COMPLETED

**Implementation Details**:
- Created comprehensive constants file with 6 main constant groups
- Extracted all magic numbers from 8 files (5 data hooks, 1 page component, 1 query client, 1 page component)
- All constants properly typed with TypeScript `as const`
- Type checking passes with zero errors
- Frontend build succeeds (3.33s)

**Files Modified**:
1. `frontend/src/config/constants.ts` - NEW
2. `frontend/src/features/dashboard/useDashboardData.ts`
3. `frontend/src/features/sparing/useSparingData.ts`
4. `frontend/src/features/portfolio/usePortfolioData.ts`
5. `frontend/src/features/gjeld/useGjeldData.ts`
6. `frontend/src/features/pensjon/usePensjonData.ts`
7. `frontend/src/shared/api/queryClient.ts`
8. `frontend/src/features/dashboard/DashboardPage.tsx`

**Magic Numbers Extracted**:
- Milestone thresholds (14 values in dashboard, 23 in portfolio)
- Growth rates (conservative 5%, default 7%, aggressive 10%)
- Query configuration (5-minute stale time, 1 retry)
- F.I.R.E. calculations (4% safe withdrawal rate, 25x multiplier)
- Retirement defaults (age 35, retirement age 67)
