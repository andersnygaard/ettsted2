# FEATURE: useDashboardData Hook

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: frontend, hooks, tanstack-query
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Create TanStack Query hook for dashboard page data.

## Desired Outcome

React hook for fetching aggregated dashboard data.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/dashboard/useDashboardData.ts`
- [ ] Fetch from `/api/v1/dashboard` endpoint
- [ ] Return typed DashboardData
- [ ] Handle loading and error states
- [ ] Refetch on window focus

## Technical Approach

```typescript
// /frontend/src/features/dashboard/useDashboardData.ts

import { useQuery } from '@tanstack/react-query';
import { summaryApi } from '../../shared/api/services/summaryApi';
import { DashboardData } from '../../shared/types/models';

export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: summaryApi.getDashboard,
    refetchOnWindowFocus: true,
  });
}
```

## Dependencies

- 089-FEATURE-api-services
- 084-FEATURE-dashboard-endpoint (backend)

---

**Next Steps**: Create useSparingData hook (092)
