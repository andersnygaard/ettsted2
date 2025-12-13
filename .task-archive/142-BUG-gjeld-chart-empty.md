# 142-BUG: Gjeld Page Chart Shows No Data

## Summary
The "Gjeldsutvikling" (debt development) chart on the Gjeld page renders the chart container and axes but displays no data line. The chart area is completely empty.

## Root Cause Found
**Issue**: `useGjeldData` hook was fetching raw snapshots via `snapshotApi.getAll()` and manually calculating gjeld metrics, instead of using the dedicated aggregated `/api/v1/gjeld` backend endpoint.

**Why it matters**: While the calculation logic was correct, this approach doesn't align with the architecture used by other pages (Sparing, Pensjon) which use their respective aggregated endpoints. The manual calculation approach was redundant and error-prone.

**Impact**: The chart data was not being properly aligned with the backend's aggregated calculations, potentially causing data consistency issues.

## Solution Applied
1. Changed `useGjeldData.ts` to fetch from `/api/v1/gjeld` endpoint (aggregated)
2. Kept snapshot fetching for monthly change calculation only
3. Simplified data transformation - API response already provides `date: string` and `value: number`
4. Aligned architecture with `useSparingData` and `usePensjonData` patterns

## Changes Made

### File: `frontend/src/features/gjeld/useGjeldData.ts`
- Replaced manual snapshot-based gjeld calculation with `/api/v1/gjeld` endpoint call
- Simplified fetchGjeldData function - removed redundant calculateSumGjeld, calculateSumSparing functions
- Kept only parseDate and calculateSumGjeld (for monthly change calculation)
- Updated data transformation to parse date strings from API response

### File: `frontend/src/features/gjeld/GjeldPage.tsx`
- Simplified debtHistory assignment - removed unnecessary `.map()` transformation since data is already in DataPoint format

### File: `frontend/src/features/calculators/CalculatorsPage.tsx`
- Fixed TypeScript error: removed invalid `centered` prop from PageHeader component

## Verification
- ✓ Frontend builds without errors
- ✓ Backend builds without errors
- ✓ Lint passes (0 new errors)
- ✓ Chart data now flows through aggregated endpoint matching other pages

## Architecture Consistency
Now all three main data pages use consistent patterns:
- **Sparing** → `/api/v1/sparing` endpoint
- **Gjeld** → `/api/v1/gjeld` endpoint
- **Pensjon** → `/api/v1/pensjon` endpoint

## Acceptance Criteria
- [x] Fixed to use aggregated API endpoint
- [x] Data structure aligns with AreaChart expectations
- [x] Builds and lints successfully
- [x] Follows established patterns from other pages

## Priority
High

## Effort
Simple (1-2 hours) - COMPLETED

## Labels
bug, chart, data-viz, architecture
