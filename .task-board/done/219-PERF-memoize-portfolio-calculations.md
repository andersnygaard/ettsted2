# Task 219: Memoize Portfolio Calculations

**Priority**: Medium
**Category**: Performance
**Effort**: Low (20 min)
**Impact**: Code Quality +1 point

## Problem

`usePortfolioData.ts` recreates expensive calculations on every render.

## Files

- `frontend/src/features/portfolio/usePortfolioData.ts`

## Implementation

Wrap in useMemo:
```typescript
const milestones = useMemo(
  () => detectMilestones(snapshots),
  [snapshots]
);
```

## Acceptance Criteria

- [x] detectMilestones memoized
- [x] calculateTotals memoized
- [x] No unnecessary re-renders
