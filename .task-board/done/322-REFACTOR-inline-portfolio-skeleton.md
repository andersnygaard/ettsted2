# REFACTOR: Inline Portfolio Skeleton

**Status**: Backlog
**Created**: 2025-12-14
**Priority**: Medium
**Labels**: frontend, vertical-slicing
**Estimated Effort**: Simple - 30 min
**Depends On**: #320

## Context & Motivation

`PortfolioSkeleton` lives in `shared/components/skeletons/` but is only used by PortfolioPage. Violates vertical slicing.

## Current State

```
frontend/src/shared/components/skeletons/PortfolioSkeleton.tsx  ← wrong location
frontend/src/features/portfolio/PortfolioPage.tsx               ← imports it
```

## Desired Outcome

Skeleton JSX inlined into PortfolioPage.tsx loading block.

## Acceptance Criteria

- [x] Skeleton JSX moved inline into PortfolioPage.tsx `if (isLoading)` block
- [x] Import removed
- [x] Uses `PageLayout`
- [x] Visual result unchanged
- [x] Build passes

## Affected Components

### Frontend
- `frontend/src/features/portfolio/PortfolioPage.tsx`

## Technical Approach

1. Copy skeleton JSX from PortfolioSkeleton.tsx
2. Paste into PortfolioPage.tsx loading block
3. Remove import
4. Update to PageLayout

## Code Reference

PortfolioSkeleton structure:
- Breadcrumb
- Page header + actions
- Table header with filters
- Table rows (6)
- Table footer

---

**Next Steps**: Ready for implementation after #320 completes.
