# 147-BUG: Dashboard Missing Container Wrapper

## Summary
Dashboard page doesn't use the `.container.container--narrow` wrapper that all other pages use. This causes inconsistent max-width and padding across the app.

## Context
Other pages pattern:
```tsx
<main className="sparing-page">
  <div className="container container--narrow">
    {/* content */}
  </div>
</main>
```

Dashboard pattern:
```tsx
<div className="dashboard-page">
  {/* content directly, no container */}
</div>
```

This likely causes Dashboard to have different margins/max-width than other pages.

## Acceptance Criteria
- [ ] Dashboard uses consistent container wrapper
- [ ] Max-width matches other pages
- [ ] Responsive behavior consistent

## Technical Approach
1. Add container wrapper to DashboardPage
2. Or implement via PageSkeleton (task 145)
3. Verify responsive breakpoints match

## Files to Modify
- [DashboardPage.tsx](frontend/src/features/dashboard/DashboardPage.tsx)
- [DashboardPage.css](frontend/src/features/dashboard/DashboardPage.css)

## Priority
Low

## Effort
Simple (30 min)

## Labels
bug, consistency, layout
