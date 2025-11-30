# FEATURE: useGjeldData Hook

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: frontend, hooks, tanstack-query
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Create TanStack Query hook for gjeld page data.

## Desired Outcome

React hook for fetching gjeld metrics and loans.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/gjeld/useGjeldData.ts`
- [ ] Fetch from `/api/v1/gjeld/summary` endpoint
- [ ] Return typed GjeldData
- [ ] Handle loading and error states

## Technical Approach

```typescript
// /frontend/src/features/gjeld/useGjeldData.ts

import { useQuery } from '@tanstack/react-query';
import { summaryApi } from '../../shared/api/services/summaryApi';
import { GjeldData } from '../../shared/types/models';

export function useGjeldData() {
  return useQuery<GjeldData>({
    queryKey: ['gjeld'],
    queryFn: summaryApi.getGjeld,
  });
}
```

## Dependencies

- 089-FEATURE-api-services
- 086-FEATURE-gjeld-endpoint (backend)

---

**Next Steps**: Create usePensjonData hook (094)
