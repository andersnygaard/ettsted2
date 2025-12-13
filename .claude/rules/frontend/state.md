---
paths:
  - frontend/**/*
---

# State Rules

## Stack
TanStack Query v5 (server state), React Context (auth), zustand (future), useState (local)

## Structure
- `/shared/api/queryClient.ts` - QueryClient singleton with defaults
- `/shared/api/queryHelpers.ts` - QUERY_KEYS constants, helper functions
- `/features/*/use*Data.ts` - Feature-specific query hooks
- `/features/auth/AuthContext.tsx` - Auth state via Context

## Patterns

### Query Hooks Pattern
```typescript
// features/dashboard/useDashboardData.ts
export function useDashboardData() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD,
    queryFn: fetchDashboardData,
    staleTime: QUERY_CONFIG.STALE_TIME,  // 5 minutes
    retry: QUERY_CONFIG.RETRY_COUNT      // 1
  });
}
```

### Query Keys
```typescript
// shared/api/queryHelpers.ts
export const QUERY_KEYS = {
  DASHBOARD: ['dashboard'],
  SNAPSHOTS: ['snapshots'],
  USER: ['user'],
  SPARING: ['sparing'],
  GJELD: ['gjeld'],
  PENSJON: ['pensjon'],
} as const;
```

### Mutations Pattern
```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    const response = await client.post('/endpoint', data);
    return response.data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SNAPSHOTS });
  },
});
```

### Global Query Defaults
```typescript
// queryClient.ts
defaultOptions: {
  queries: {
    staleTime: 5 * 60 * 1000,  // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  mutations: {
    retry: false,
  },
}
```

## Decisions
- TanStack Query for all server state (no Redux/zustand for API data)
- Constants in `/config/constants.ts` for stale times, retry counts
- Invalidate related queries on mutations rather than optimistic updates
- Auth state uses Context because it's synchronous and session-based

## Gotchas
- **Import queryClient**: Always use the singleton from `queryClient.ts`
- **Keys must match**: Invalidation keys must exactly match query keys
- **Use QUERY_KEYS constants**: Never hardcode `['user']` - use `QUERY_KEYS.USER`
- **Error handling**: Use `useApiError` hook or handle in onError callback
- **Loading states**: Always check `isLoading` and `isError` before rendering data
- **Cache invalidation timing**: Call invalidation AFTER mutation success, not before
