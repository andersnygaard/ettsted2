# FEATURE: usePensjonData Hook

**Status**: Done
**Created**: 2025-11-30
**Completed**: 2025-11-30
**Priority**: Medium
**Labels**: frontend, hooks, tanstack-query
**Estimated Effort**: Simple - 45 min

## Context & Motivation

Create TanStack Query hook for Pensjon (pension) page data.

## Desired Outcome

React hook for fetching and calculating pensjon metrics with breakdown.

## Acceptance Criteria

- [x] Create `/frontend/src/features/pensjon/usePensjonData.ts`
- [x] Fetch snapshots from `/api/v1/snapshots`
- [x] Calculate: sumPensjon, breakdown array, OTP%, estimatedAtRetirement, history
- [x] Return typed PensjonData
- [x] Handle loading and error states

## Resolution

Successfully created usePensjonData hook:

**Files created**:
- `features/pensjon/usePensjonData.ts` - Full hook implementation
- `features/pensjon/index.ts` - Feature exports

**Metrics calculated**:
- sumPensjon: Total pension value
- breakdown: Pension sources (arbeidsgiver, folketrygden) with %
- otpPercent: Employer pension as % of total
- estimatedAtRetirement: Future value with 5% growth
- history: Stacked time series for charting

**Uses shared services**: snapshotApi, getAccountCategory
**Build verified**: Frontend builds successfully

---

**Next Steps**: Create usePortfolioData hook (095)
