# FEATURE: Dashboard Data Hook

**Status**: Completed
**Created**: 2025-11-29
**Completed**: 2025-11-30
**Priority**: High
**Labels**: frontend, hooks, data
**Estimated Effort**: Simple - 1-2 hours

## Context & Motivation

Custom hook to fetch and aggregate data for the dashboard page from multiple sources.

## Reference

Dashboard page requirements

## Desired Outcome

TanStack Query hook providing all dashboard data.

## Acceptance Criteria

- [x] Create `/frontend/src/features/dashboard/useDashboardData.ts`
- [x] Fetches snapshots from portfolio API
- [x] Calculates net worth (sum sparing - sum gjeld)
- [x] Calculates monthly change percentage
- [x] Aggregates sum sparing, sum gjeld, pensjon
- [x] Calculates sparerate (if income data available)
- [x] Determines next milestone target
- [x] Handles loading and error states

## Technical Approach

```typescript
// useDashboardData.ts
interface DashboardData {
  netWorth: number;
  monthlyChange: number;
  sumSparing: number;
  sumGjeld: number;
  pensjon: number;
  sparerate: number;
  nextMilestone: number;
  currentTowardsMilestone: number;
}

export function useDashboardData() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async (): Promise<DashboardData> => {
      const { data: snapshots } = await apiClient.get('/snapshots');

      if (!snapshots.length) {
        return getEmptyDashboardData();
      }

      const latest = snapshots[0];
      const previous = snapshots[1];

      const sumSparing = calculateSumSparing(latest.accounts);
      const sumGjeld = calculateSumGjeld(latest.accounts);
      const pensjon = calculatePensjon(latest.accounts);
      const netWorth = sumSparing - sumGjeld;

      const previousNetWorth = previous
        ? calculateNetWorth(previous.accounts)
        : netWorth;

      const monthlyChange = ((netWorth - previousNetWorth) / previousNetWorth) * 100;
      const nextMilestone = findNextMilestone(netWorth);

      return {
        netWorth,
        monthlyChange,
        sumSparing,
        sumGjeld,
        pensjon,
        sparerate: 35.88, // TODO: Calculate from income/expenses
        nextMilestone,
        currentTowardsMilestone: netWorth
      };
    }
  });
}

function findNextMilestone(current: number): number {
  const milestones = [100000, 250000, 500000, 750000, 1000000, 2000000, 5000000, 10000000];
  return milestones.find(m => m > current) || current * 2;
}
```

## Dependencies

- Portfolio API endpoints (complete)
- TanStack Query setup (complete)

## Implementation Summary

### Files Created

1. **`/frontend/src/features/dashboard/useDashboardData.ts`** (180 lines)
   - TanStack Query hook with proper error handling and caching
   - Fetches snapshots from `/api/v1/snapshots`
   - Implements asset class categorization logic
   - Calculates all required metrics

2. **`/frontend/src/features/dashboard/types.ts`** (70 lines)
   - TypeScript interfaces mirroring backend models
   - `Account` and `MonthlySnapshot` types
   - Ensures type safety across the application

### Files Modified

1. **`/frontend/src/features/dashboard/index.ts`**
   - Added exports for `useDashboardData`, `DashboardData`, and type interfaces

2. **`/frontend/src/features/dashboard/DashboardPage.tsx`**
   - Integrated `useDashboardData` hook
   - Replaced placeholder data with real API calls
   - Added loading and error state handling
   - Updated milestone label to "Neste milepæl"

### Key Features

- **Asset Class Categorization**: Intelligently categorizes accounts as sparing/gjeld/pensjon
- **Milestone Detection**: Finds next milestone from predefined array, defaults to doubling current value
- **Monthly Change**: Calculates percentage change from previous month with safe division
- **Empty State**: Returns zero-filled object when no snapshots exist
- **Error Handling**: Proper try-catch with console logging for debugging
- **Query Configuration**: 5-minute cache with 1 retry

### Build Status
✓ Build successful (pnpm --filter frontend build)

---

**Next Steps**: Use hook in other dashboard features or integrate with remaining calculator pages
