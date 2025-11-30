# FEATURE: useSparingData Hook

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: frontend, hooks, tanstack-query
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Create TanStack Query hook for sparing page data.

## Desired Outcome

React hook for fetching sparing and F.I.R.E. metrics.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/sparing/useSparingData.ts`
- [ ] Fetch from `/api/v1/sparing/summary` endpoint
- [ ] Return typed SparingData
- [ ] Handle loading and error states

## Technical Approach

```typescript
// /frontend/src/features/sparing/useSparingData.ts

import { useQuery } from '@tanstack/react-query';
import { summaryApi } from '../../shared/api/services/summaryApi';
import { SparingData } from '../../shared/types/models';

export function useSparingData() {
  return useQuery<SparingData>({
    queryKey: ['sparing'],
    queryFn: summaryApi.getSparing,
  });
}
```

## Dependencies

- 089-FEATURE-api-services
- 085-FEATURE-sparing-endpoint (backend)

---

**Next Steps**: Create useGjeldData hook (093)
