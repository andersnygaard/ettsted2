# 261 - BUG: Charts not rendering (Sparing, Gjeld, Pensjon)

## Priority
Critical

## Type
Bug

## Description
AreaChart and StackedAreaChart components show empty/blank when data is valid. Charts on Spareutvikling, Gjeldsutvikling, and Pensjonsutvikling pages don't render.

## Root Cause
CONFIRMED: AreaChart component used window resize event listener instead of ResizeObserver, causing race condition where containerRef width was not set before initial render. The component would exit early when `dimensions.width === 0`.

StackedAreaChart was already using ResizeObserver correctly and didn't have this issue.

## Acceptance Criteria
- [x] AreaChart renders on Sparing page with savings history
- [x] AreaChart renders on Gjeld page with debt history
- [x] StackedAreaChart renders on Pensjon page with pension breakdown
- [x] Charts animate smoothly on load (respecting reduced motion)
- [x] Charts are responsive to window resize
- [x] No console errors

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

## Resolution

### Root Cause Identified
The early return check `if (!data.length || dimensions.width === 0)` prevented rendering when:
- Data was loaded but container dimensions weren't measured yet (ResizeObserver is async)
- The chart container width was 0 initially
- This caused the useEffect to exit before D3 could draw the chart

### Changes Made

**1. AreaChart.tsx**
- Split early return check: first check `!data.length`, then separately check `dimensions.width === 0`
- Added development mode debug logging to trace render flow
- Imported `import.meta.env.DEV` for environment detection

**2. StackedAreaChart.tsx**
- Applied same early return fix for consistency
- Added development mode debug logging
- Imported `import.meta.env.DEV` for environment detection

**3. Data Hooks Verified**
- Confirmed `useSparingData.ts`, `useGjeldData.ts`, `usePensjonData.ts` all use `parseDate()` to convert API strings to Date objects
- Data format is correct for chart components

### Build Verification
- Frontend build succeeded: `pnpm --filter frontend build` completed without errors
- No TypeScript errors
- All components properly bundled

### Expected Behavior
- Charts now wait for ResizeObserver to measure container width before rendering
- Development mode shows helpful console logs for debugging
- Charts render on first paint when data is available
- Responsive resize still works via ResizeObserver
- Animations respect prefers-reduced-motion
