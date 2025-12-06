# 162-BUG: Dashboard Uses Placeholder Spacing Hack

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
- [x] Remove Placeholder usage from Dashboard
- [x] Add proper CSS spacing to PageHeader or page wrapper
- [x] Consider if Placeholder component should be deprecated

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

## Status
COMPLETED

## Implementation Details

### Changes Made
1. **Removed Placeholder import** from DashboardPage.tsx (line 5)
   - Removed `Placeholder` from the imports of `@finans/components`

2. **Removed all three Placeholder usages**:
   - Line 62: Removed from loading state
   - Line 73: Removed from error state
   - Line 83: Removed from main render

3. **Added proper CSS spacing**:
   - Updated `.dashboard-page` padding in DashboardPage.css
   - Changed from `padding: 0 var(--space-4xl)` to `padding: var(--space-xl) var(--space-4xl) 0`
   - This provides 32px top padding equivalent to the removed Placeholder (--space-xl = 32px)

### Placeholder Component Status
- Placeholder is NOT used anywhere else in the codebase
- The component is still exported from components library (may be used in future or external projects)
- No action taken to deprecate it, as it could be useful for other pages

### Build Verification
- Frontend builds successfully with no TypeScript or compilation errors
- All 879 modules transformed without warnings
