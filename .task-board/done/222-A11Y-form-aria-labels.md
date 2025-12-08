# Task 222: Add Missing ARIA Labels

**Priority**: Medium
**Category**: Accessibility
**Effort**: Medium (30 min)
**Impact**: Design +2 points (Accessibility)

## Problem

Missing aria-labels on:
- TableHeader year select
- ImportPage textarea
- SpreadsheetTable group toggles
- LoginPage SVG icons

## Files

- `components/src/data/TableHeader/TableHeader.tsx`
- `frontend/src/features/import/ImportPage.tsx`
- `components/src/data/SpreadsheetTable/SpreadsheetTable.tsx`
- `frontend/src/features/auth/LoginPage.tsx`

## Implementation

Add aria-labels:
```tsx
<select aria-label="Velg år">
<textarea aria-label="Skriv eller lim inn porteføljedata">
<th role="button" aria-expanded={!collapsed} aria-label={`Toggle ${group.label}`}>
<svg aria-hidden="true"> // When button text exists
```

## Acceptance Criteria

- [x] All form controls have accessible names
- [x] Screen readers announce controls correctly
