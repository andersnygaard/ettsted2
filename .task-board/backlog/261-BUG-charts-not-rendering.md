# 261 - BUG: Charts not rendering (Sparing, Gjeld, Pensjon)

## Priority
Critical

## Type
Bug

## Description
AreaChart and StackedAreaChart components show empty/blank when data is valid. Charts on Spareutvikling, Gjeldsutvikling, and Pensjonsutvikling pages don't render.

## Root Cause
Likely issues:
1. Data validation check `if (!data.length || dimensions.width === 0)` may exit early
2. SVG dimensions not calculated correctly during initial render
3. D3 scales may have invalid domain (min/max calculation issue)
4. Missing data transformation from API format to chart format

## Acceptance Criteria
- [ ] AreaChart renders on Sparing page with savings history
- [ ] AreaChart renders on Gjeld page with debt history
- [ ] StackedAreaChart renders on Pensjon page with pension breakdown
- [ ] Charts animate smoothly on load (respecting reduced motion)
- [ ] Charts are responsive to window resize
- [ ] No console errors

## Files to Change
- `components/src/charts/AreaChart/AreaChart.tsx`
- `components/src/charts/StackedAreaChart/StackedAreaChart.tsx`
- `frontend/src/features/sparing/useSparingData.ts` (verify data format)
- `frontend/src/features/gjeld/useGjeldData.ts` (verify data format)
- `frontend/src/features/pensjon/usePensjonData.ts` (verify data format)

## Technical Notes
Check:
1. Data format from API - ensure dates are Date objects, not strings
2. D3 scale domain calculation - handle edge cases (zero values, negative values)
3. SVG dimensions - ensure containerRef width is set before drawing
4. Add debug logging in development mode to trace render flow

## Testing
- Test with demo user data (12 months of snapshots)
- Test with single snapshot
- Test with zero values
- Test responsive behavior (resize browser)
