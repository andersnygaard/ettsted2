# REFACTOR: Inline Pensjon Skeleton

**Status**: Backlog
**Created**: 2025-12-14
**Priority**: Medium
**Labels**: frontend, vertical-slicing
**Estimated Effort**: Simple - 30 min
**Depends On**: #320

## Context & Motivation

`PensjonSkeleton` lives in `shared/components/skeletons/` but is only used by PensjonPage. Violates vertical slicing.

## Current State

```
frontend/src/shared/components/skeletons/PensjonSkeleton.tsx  ← wrong location
frontend/src/features/pensjon/PensjonPage.tsx                 ← imports it
```

## Desired Outcome

Skeleton JSX inlined into PensjonPage.tsx loading block.

## Acceptance Criteria

- [x] Skeleton JSX moved inline into PensjonPage.tsx `if (isLoading)` block
- [x] Import removed
- [x] Uses `PageLayout`
- [x] Visual result unchanged
- [x] Build passes

## Affected Components

### Frontend
- `frontend/src/features/pensjon/PensjonPage.tsx`

## Technical Approach

1. Copy skeleton JSX from PensjonSkeleton.tsx
2. Paste into PensjonPage.tsx loading block
3. Remove import
4. Update to PageLayout

---

**Next Steps**: Ready for implementation after #320 completes.
