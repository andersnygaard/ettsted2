# 148-BUG: Dashboard Uses Placeholder Spacing Hack

## Summary
Dashboard is the only page using `<Placeholder/>` component (empty 32px div) for spacing. This is a layout hack that should be replaced with proper CSS.

## Context
DashboardPage.tsx lines 62, 71, 79:
```tsx
<Placeholder/>
<PageHeader title={...} />
```

The Placeholder component:
```tsx
export function Placeholder({ height = 32 }) {
  return <div style={{ height }} aria-hidden="true" />
}
```

No other page uses this pattern - they rely on proper CSS margins.

## Acceptance Criteria
- [ ] Remove Placeholder usage from Dashboard
- [ ] Add proper CSS spacing to PageHeader or page wrapper
- [ ] Consider if Placeholder component should be deprecated

## Technical Approach
1. Remove `<Placeholder/>` from DashboardPage
2. Add margin-top to `.dashboard-page` or PageHeader
3. Consider removing Placeholder component if unused elsewhere

## Files to Modify
- [DashboardPage.tsx](frontend/src/features/dashboard/DashboardPage.tsx)
- [DashboardPage.css](frontend/src/features/dashboard/DashboardPage.css)

## Priority
Low

## Effort
Simple (30 min)

## Labels
bug, cleanup, css
