# FEATURE: useUser Hook

**Status**: Done
**Created**: 2025-11-30
**Completed**: 2025-11-30
**Priority**: Medium
**Labels**: frontend, hooks, tanstack-query
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Create TanStack Query hook for user data management.

## Desired Outcome

React hook for fetching and managing user data with mutations.

## Acceptance Criteria

- [x] Create `/frontend/src/shared/hooks/useUser.ts`
- [x] Implement `useUser()` - fetch current user from `/users/me`
- [x] Implement `useUserSetup()` - mutation for first-time setup
- [x] Implement `useUpdateUser()` - mutation for profile updates
- [x] Handle loading, error, and success states
- [x] Invalidate queries on mutation success

## Resolution

Successfully created user hooks:

**Files created**:
- `useUser.ts` with 3 exported hooks: useUser, useUserSetup, useUpdateUser

**Key features**:
- Uses userApi service (clean separation)
- 5-minute stale time for user query
- Query invalidation on mutations
- Full TypeScript types with JSDoc
- Frontend builds successfully

---

**Next Steps**: Create useGjeldData hook (093)
