# FEATURE: Frontend API Services

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: frontend, api, services
**Estimated Effort**: Simple - 45 min

## Context & Motivation

Create API service functions to call backend endpoints.

## Desired Outcome

Type-safe API functions using Axios client.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/api/services/userApi.ts`
- [ ] Create `/frontend/src/shared/api/services/accountApi.ts`
- [ ] Create `/frontend/src/shared/api/services/snapshotApi.ts`
- [ ] Create `/frontend/src/shared/api/services/summaryApi.ts`
- [ ] All functions use existing Axios client
- [ ] All functions are properly typed

## Technical Approach

```typescript
// /frontend/src/shared/api/services/userApi.ts

import { apiClient } from '../client';
import { User, UserProfile } from '../../types/models';

export const userApi = {
  getMe: () => apiClient.get<{ data: User }>('/users/me').then(r => r.data.data),

  setup: (nickname: string, email: string, profile: UserProfile) =>
    apiClient.post<{ data: User }>('/users/me/setup', { nickname, email, profile }).then(r => r.data.data),

  updateProfile: (profile: Partial<UserProfile>) =>
    apiClient.patch<{ data: User }>('/users/me/profile', profile).then(r => r.data.data),
};

// /frontend/src/shared/api/services/summaryApi.ts

import { apiClient } from '../client';
import { DashboardData, SparingData, GjeldData, PensjonData } from '../../types/models';

export const summaryApi = {
  getDashboard: () =>
    apiClient.get<{ data: DashboardData }>('/dashboard').then(r => r.data.data),

  getSparing: () =>
    apiClient.get<{ data: SparingData }>('/sparing/summary').then(r => r.data.data),

  getGjeld: () =>
    apiClient.get<{ data: GjeldData }>('/gjeld/summary').then(r => r.data.data),

  getPensjon: () =>
    apiClient.get<{ data: PensjonData }>('/pensjon/summary').then(r => r.data.data),
};
```

## Dependencies

- 088-FEATURE-frontend-types
- Existing Axios client

---

**Next Steps**: Create useUser hook (090)
