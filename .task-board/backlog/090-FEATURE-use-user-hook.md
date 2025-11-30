# FEATURE: useUser Hook

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: frontend, hooks, tanstack-query
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Create TanStack Query hook for user data.

## Desired Outcome

React hook for fetching and managing user data.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/hooks/useUser.ts`
- [ ] Implement `useUser()` - fetch current user
- [ ] Implement `useUpdateProfile()` - mutation for profile updates
- [ ] Handle loading, error, and success states
- [ ] Invalidate queries on mutation success

## Technical Approach

```typescript
// /frontend/src/shared/hooks/useUser.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/services/userApi';
import { UserProfile } from '../types/models';

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: userApi.getMe,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profile: Partial<UserProfile>) => userApi.updateProfile(profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
```

## Dependencies

- 089-FEATURE-api-services
- TanStack Query (already configured)

---

**Next Steps**: Create useDashboardData hook (091)
