# Task 223: Add Loading State Announcements

**Priority**: Medium
**Category**: Accessibility
**Effort**: Medium (30 min)
**Impact**: Design +1 point (UX)

## Problem

Loading states not announced to screen readers.

## Files

- `frontend/src/features/dashboard/DashboardPage.tsx`
- `frontend/src/features/portfolio/PortfolioPage.tsx`
- Other page components

## Implementation

Add aria-busy and live region:
```tsx
<main aria-busy={isLoading}>
  {isLoading && (
    <div role="status" aria-live="polite">
      Laster data...
    </div>
  )}
</main>
```

## Acceptance Criteria

- [x] Loading states announced
- [x] Completion announced
- [x] No duplicate announcements
