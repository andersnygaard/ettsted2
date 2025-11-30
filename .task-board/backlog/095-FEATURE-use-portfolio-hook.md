# FEATURE: usePortfolioData Hook

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: frontend, hooks, tanstack-query
**Estimated Effort**: Medium - 45 min

## Context & Motivation

Create TanStack Query hook for portfolio table data.

## Desired Outcome

React hook for fetching and managing portfolio snapshots with account details.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/portfolio/usePortfolioData.ts`
- [ ] Fetch snapshots and user accounts
- [ ] Combine data for table display (JOIN accounts to get names)
- [ ] Implement `useCreateSnapshot()` mutation
- [ ] Implement `useUpdateSnapshot()` mutation
- [ ] Handle pagination

## Technical Approach

```typescript
// /frontend/src/features/portfolio/usePortfolioData.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { snapshotApi } from '../../shared/api/services/snapshotApi';
import { userApi } from '../../shared/api/services/userApi';
import { MonthlySnapshot, AccountConfig, AccountBalance } from '../../shared/types/models';

interface PortfolioRow {
  date: string;
  balances: Record<string, number>; // accountId -> balance
  totals: {
    sparing: number;
    gjeld: number;
    pensjon: number;
  };
}

export function usePortfolioData(options?: { limit?: number; offset?: number }) {
  const { data: user } = useQuery({ queryKey: ['user'], queryFn: userApi.getMe });

  return useQuery({
    queryKey: ['portfolio', options],
    queryFn: async () => {
      const snapshots = await snapshotApi.getSnapshots(options);
      return snapshots;
    },
    enabled: !!user,
    select: (snapshots) => {
      if (!user) return [];

      return snapshots.map(snapshot => {
        const balances: Record<string, number> = {};
        const totals = { sparing: 0, gjeld: 0, pensjon: 0 };

        snapshot.balances.forEach(b => {
          balances[b.accountId] = b.balance;
          const account = user.accounts.find(a => a.id === b.accountId);
          if (account) {
            totals[account.category] += b.balance;
          }
        });

        return { date: snapshot.date, balances, totals };
      });
    },
  });
}

export function useCreateSnapshot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { date: Date; balances: AccountBalance[] }) =>
      snapshotApi.createSnapshot(data.date, data.balances),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
```

## Dependencies

- 089-FEATURE-api-services
- 083-FEATURE-snapshot-routes (backend)

---

**Next Steps**: Implementation complete
