# FEATURE: Dashboard Data Hook

**Status**: Backlog
**Created**: 2025-11-29
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

- [ ] Create `/frontend/src/features/dashboard/useDashboardData.ts`
- [ ] Fetches snapshots from portfolio API
- [ ] Calculates net worth (sum sparing - sum gjeld)
- [ ] Calculates monthly change percentage
- [ ] Aggregates sum sparing, sum gjeld, pensjon
- [ ] Calculates sparerate (if income data available)
- [ ] Determines next milestone target
- [ ] Handles loading and error states

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

---

**Next Steps**: Implement for dashboard page
