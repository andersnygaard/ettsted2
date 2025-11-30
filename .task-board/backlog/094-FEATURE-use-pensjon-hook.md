# FEATURE: usePensjonData Hook

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: frontend, hooks, tanstack-query
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Create TanStack Query hook for pensjon page data.

## Desired Outcome

React hook for fetching pensjon metrics and breakdown.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/pensjon/usePensjonData.ts`
- [ ] Fetch from `/api/v1/pensjon/summary` endpoint
- [ ] Return typed PensjonData
- [ ] Handle loading and error states

## Technical Approach

```typescript
// /frontend/src/features/pensjon/usePensjonData.ts

import { useQuery } from '@tanstack/react-query';
import { summaryApi } from '../../shared/api/services/summaryApi';
import { PensjonData } from '../../shared/types/models';

export function usePensjonData() {
  return useQuery<PensjonData>({
    queryKey: ['pensjon'],
    queryFn: summaryApi.getPensjon,
  });
}
```

## Dependencies

- 089-FEATURE-api-services
- 087-FEATURE-pensjon-endpoint (backend)

---

**Next Steps**: Create usePortfolioData hook (095)
