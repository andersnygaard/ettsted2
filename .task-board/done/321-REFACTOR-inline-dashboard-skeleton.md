# REFACTOR: Inline Dashboard Skeleton

**Status**: Backlog
**Created**: 2025-12-14
**Priority**: Medium
**Labels**: frontend, vertical-slicing
**Estimated Effort**: Simple - 30 min
**Depends On**: #320

## Context & Motivation

`DashboardSkeleton` lives in `shared/components/skeletons/` but is only used by DashboardPage. Violates vertical slicing. Feature-specific code should stay in feature folder.

Better: Inline the skeleton JSX directly into the page's loading block.

## Current State

```
frontend/src/shared/components/skeletons/DashboardSkeleton.tsx  ← wrong location
frontend/src/features/dashboard/DashboardPage.tsx               ← imports it
```

## Desired Outcome

Skeleton JSX inlined into DashboardPage.tsx loading block. No separate file.

## Acceptance Criteria

- [x] Skeleton JSX moved inline into DashboardPage.tsx `if (isLoading)` block
- [x] Import removed from DashboardPage.tsx
- [x] Uses `PageLayout` (after #320 rename)
- [x] Visual result unchanged
- [x] Build passes

## Affected Components

### Frontend
- `frontend/src/features/dashboard/DashboardPage.tsx` - inline skeleton JSX

## Technical Approach

1. Copy skeleton JSX from DashboardSkeleton.tsx
2. Paste into DashboardPage.tsx loading block
3. Remove DashboardSkeleton import
4. Update PageSkeleton → PageLayout
5. Verify visual match

## Code Reference

Current DashboardSkeleton structure to inline:
- Hero section skeleton
- Quick stats grid (4 cards)
- Milestone section
- Section links (3 cards)

---

**Next Steps**: Ready for implementation after #320 completes.
