# REFACTOR: Inline Gjeld Skeleton

**Status**: Backlog
**Created**: 2025-12-14
**Priority**: Medium
**Labels**: frontend, vertical-slicing
**Estimated Effort**: Simple - 30 min
**Depends On**: #320

## Context & Motivation

`GjeldSkeleton` lives in `shared/components/skeletons/` but is only used by GjeldPage. Violates vertical slicing.

## Current State

```
frontend/src/shared/components/skeletons/GjeldSkeleton.tsx  ← wrong location
frontend/src/features/gjeld/GjeldPage.tsx                   ← imports it
```

## Desired Outcome

Skeleton JSX inlined into GjeldPage.tsx loading block.

## Acceptance Criteria

- [x] Skeleton JSX moved inline into GjeldPage.tsx `if (isLoading)` block
- [x] Import removed
- [x] Uses `PageLayout`
- [x] Visual result unchanged
- [x] Build passes

## Affected Components

### Frontend
- `frontend/src/features/gjeld/GjeldPage.tsx`

## Technical Approach

1. Copy skeleton JSX from GjeldSkeleton.tsx
2. Paste into GjeldPage.tsx loading block
3. Remove import
4. Update to PageLayout

---

**Next Steps**: Ready for implementation after #320 completes.
