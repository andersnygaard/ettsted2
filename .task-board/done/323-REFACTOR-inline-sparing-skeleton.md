# REFACTOR: Inline Sparing Skeleton

**Status**: Backlog
**Created**: 2025-12-14
**Priority**: Medium
**Labels**: frontend, vertical-slicing
**Estimated Effort**: Simple - 30 min
**Depends On**: #320

## Context & Motivation

`SparingSkeleton` lives in `shared/components/skeletons/` but is only used by SparingPage. Violates vertical slicing.

## Current State

```
frontend/src/shared/components/skeletons/SparingSkeleton.tsx  ← wrong location
frontend/src/features/sparing/SparingPage.tsx                 ← imports it
```

## Desired Outcome

Skeleton JSX inlined into SparingPage.tsx loading block.

## Acceptance Criteria

- [x] Skeleton JSX moved inline into SparingPage.tsx `if (isLoading)` block
- [x] Import removed
- [x] Uses `PageLayout`
- [x] Visual result unchanged
- [x] Build passes

## Affected Components

### Frontend
- `frontend/src/features/sparing/SparingPage.tsx`

## Technical Approach

1. Copy skeleton JSX from SparingSkeleton.tsx
2. Paste into SparingPage.tsx loading block
3. Remove import
4. Update to PageLayout

## Code Reference

SparingSkeleton structure:
- Page header
- Hero section (total + change)
- Stats row (3 cards)
- Fire section
- Chart area

---

**Next Steps**: Ready for implementation after #320 completes.
