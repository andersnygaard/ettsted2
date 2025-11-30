# FEATURE: usePortfolioData Hook

**Status**: Done
**Created**: 2025-11-30
**Completed**: 2025-11-30
**Priority**: Medium
**Labels**: frontend, hooks, tanstack-query
**Estimated Effort**: Medium - 45 min

## Context & Motivation

Create TanStack Query hook for Portfolio page table data with mutations for CRUD operations.

## Desired Outcome

React hook for fetching portfolio data and mutations for create/update/delete operations.

## Acceptance Criteria

- [x] Create `/frontend/src/features/portfolio/usePortfolioData.ts`
- [x] Fetch snapshots from `/api/v1/snapshots`
- [x] Transform data for spreadsheet table display
- [x] Implement `useCreateSnapshot()` mutation
- [x] Implement `useUpdateSnapshot()` mutation
- [x] Implement `useDeleteSnapshot()` mutation
- [x] Handle query invalidation on mutations

## Resolution

Successfully created usePortfolioData hook:

**Files created**:
- `features/portfolio/usePortfolioData.ts` - Full hook implementation

**Exports**:
- `usePortfolioData()` - Fetches all snapshots as PortfolioRow[]
- `useCreateSnapshot()` - Creates new snapshot
- `useUpdateSnapshot()` - Updates existing snapshot
- `useDeleteSnapshot()` - Deletes snapshot
- `PortfolioRow` interface for table display

**Features**:
- Category totals calculation (sparing, gjeld, pensjon)
- Full query invalidation on mutations
- Uses snapshotApi service
- 5-minute stale time

**Build verified**: Frontend builds successfully

---

**This completes the entire backlog! All frontend data layer tasks done.**
