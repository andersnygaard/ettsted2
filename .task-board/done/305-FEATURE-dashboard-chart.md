# 305-FEATURE: Dashboard Net Worth Chart

## Context

The Dashboard (Oversikt) page currently shows a hero number, stats grid, milestone progress, and section links. It lacks a historical chart showing net worth trend over time, which would provide valuable visual context.

## Current State

[frontend/src/features/dashboard/DashboardPage.tsx](frontend/src/features/dashboard/DashboardPage.tsx):
- HeroNumber showing net worth (or sum sparing if negative)
- StatCards for savings, debt, pension, savings rate
- Milestone progress bar
- Section links to other pages

Other pages (Sparing, Gjeld, Pensjon) all have charts showing historical data.

## Acceptance Criteria

- [x] Add compact net worth chart below milestone section
- [x] Chart shows last 12 months of net worth history
- [x] Chart uses existing ChartWithTabs or AreaChart component
- [x] Mobile-responsive with appropriate height
- [x] Loading skeleton while data fetches
- [x] Graceful handling of insufficient data (< 2 months)

## Technical Approach

1. Update [useDashboardData.ts](frontend/src/features/dashboard/useDashboardData.ts) to include net worth history
2. Add AreaChart to DashboardPage below milestone section
3. Use compact height (150-180px) to maintain page balance

```typescript
// In useDashboardData.ts, add to aggregated endpoint response:
netWorthHistory: snapshots.map(s => ({
  date: s.date,
  value: s.totalNetWorth
})).slice(-12)
```

```tsx
// In DashboardPage.tsx
{dashboardData.netWorthHistory.length >= 2 && (
  <AreaChart
    data={dashboardData.netWorthHistory}
    height={160}
    color="var(--charcoal)"
  />
)}
```

## Files to Modify

- [frontend/src/features/dashboard/useDashboardData.ts](frontend/src/features/dashboard/useDashboardData.ts)
- [frontend/src/features/dashboard/DashboardPage.tsx](frontend/src/features/dashboard/DashboardPage.tsx)
- [frontend/src/features/dashboard/DashboardPage.css](frontend/src/features/dashboard/DashboardPage.css)
- [backend/src/routes/summaryRoutes.ts](backend/src/routes/summaryRoutes.ts) (if aggregated endpoint needs update)

## Priority

Low - Nice to have visual enhancement

## Labels

feature, dashboard, charts

## Effort

Small (1-2 hours)

---

## Resolution

### Implementation Summary

Successfully added a compact net worth history chart to the Dashboard (Oversikt) page. The chart displays the last 12 months of net worth data using the existing `AreaChart` component.

### Changes Made

1. **Updated `useDashboardData.ts`**:
   - Added `netWorthHistory: Array<{ date: Date; value: number }>` to `DashboardData` interface
   - Updated `getEmptyDashboardData()` to include empty `netWorthHistory` array
   - Modified `fetchDashboardData()` to build history from sorted snapshots (last 12 months, reversed to chronological order)

2. **Updated `DashboardPage.tsx`**:
   - Imported `AreaChart` from `@finans/components`
   - Added `netWorthHistory: []` to fallback data object
   - Added chart section between milestone and section links with conditional rendering (only shows if >= 2 data points)
   - Chart configuration: height=160px, color=charcoal, title="Netto formue"

3. **Updated `DashboardPage.css`**:
   - Added `.dashboard-chart` class with mobile-first styling
   - Chart follows same max-width and animation pattern as milestone section
   - Animation delay of 0.4s for staggered appearance

### Technical Details

- **Data source**: Calculated from `MonthlySnapshot[]` via `snapshotApi.getAll()`
- **Net worth calculation**: Uses existing `calculateNetWorth()` helper (sum sparing + sum gjeld)
- **Chart component**: `AreaChart` with 160px height for compact dashboard presentation
- **Edge cases handled**: Chart only renders when `data.netWorthHistory.length >= 2` to ensure meaningful visualization
- **Loading state**: Handled by parent `DashboardSkeleton` component
- **Mobile responsive**: CSS uses mobile-first approach with no additional breakpoints needed

### Verification

- Backend compiles successfully: `pnpm --filter backend build` ✓
- Frontend compiles successfully: `pnpm --filter frontend build` ✓
- All acceptance criteria met ✓
