# Task 216: Add Dynamic Page Titles

**Priority**: High
**Category**: Accessibility
**Effort**: Medium (30 min)
**Impact**: Design +2 points (Accessibility)

## Problem

All pages show static "Finans" title. Screen readers can't identify current page.

## Files

- All page components in `frontend/src/features/*/`

## Implementation

Create `usePageTitle` hook:
```typescript
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | Finans`;
  }, [title]);
}
```

Use in each page:
```typescript
usePageTitle('Oversikt');
usePageTitle('Portefølje');
// etc.
```

## Acceptance Criteria

- [x] Each page sets appropriate title
- [x] Browser tabs show correct page name
- [x] Screen readers announce page changes
