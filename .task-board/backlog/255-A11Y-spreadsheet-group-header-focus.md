# 255 - Add SpreadsheetTable Group Header Focus

## Type
Accessibility

## Priority
Medium

## Description
SpreadsheetTable group headers (`<th>` elements) are clickable (cursor: pointer) but have no focus indicator. Keyboard users cannot see which group header is focused.

## Source
Due Diligence Report - Design Issue #4

## Implementation

### File: `components/src/components/SpreadsheetTable/SpreadsheetTable.css`

Add focus-visible to group headers:
```css
.spreadsheet .group-header-row th:focus-visible {
  outline: 2px solid var(--charcoal);
  outline-offset: -2px; /* Inside border for table cells */
}
```

Also ensure group headers are keyboard accessible (tabindex="0" if needed).

## Acceptance Criteria
- [ ] Group headers show focus ring when focused via keyboard
- [ ] Tab navigation includes group headers
- [ ] Focus ring visible inside cell boundary
- [ ] Storybook stories demonstrate focus states

## Effort
Low (20 min)
