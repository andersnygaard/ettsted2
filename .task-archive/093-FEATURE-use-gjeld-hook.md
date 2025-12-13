# FEATURE: useGjeldData Hook

**Status**: Done
**Created**: 2025-11-30
**Completed**: 2025-11-30
**Priority**: Medium
**Labels**: frontend, hooks, tanstack-query
**Estimated Effort**: Simple - 45 min

## Context & Motivation

Create TanStack Query hook for Gjeld (debt) page data.

## Desired Outcome

React hook for fetching and calculating gjeld metrics including dekning (coverage).

## Acceptance Criteria

- [x] Create `/frontend/src/features/gjeld/useGjeldData.ts`
- [x] Fetch snapshots from `/api/v1/snapshots`
- [x] Calculate: sumGjeld, monthlyChange, dekning%, remaining, loans array, history
- [x] Return typed GjeldData
- [x] Handle loading and error states

## Resolution

Successfully created useGjeldData hook:

**Files created**:
- `features/gjeld/useGjeldData.ts` - Full hook implementation
- `features/gjeld/index.ts` - Feature exports

**Metrics calculated**:
- sumGjeld: Total debt (absolute value)
- monthlyChange: Month-over-month difference
- dekning: Coverage ratio (sparing/gjeld * 100)
- remaining: Uncovered debt amount
- loans: Individual loan details
- history: Time series for charting

**Uses shared services**: snapshotApi, getAccountCategory
**Build verified**: Frontend builds successfully

---

**Next Steps**: Create usePensjonData hook (094)
