# 310: Sticky Action Column Overlaps Adjacent Columns on Narrow Viewports

## Summary
On the Portfolio page, when narrowing the viewport (769px-1024px range), the sticky action column overlaps adjacent data columns instead of allowing horizontal scroll.

## Current Behavior
- Action column has `position: sticky; right: 0`
- Wrapper has no `overflow-x: auto`
- When viewport narrows, sticky column overlaps content to its left
- Particularly visible at tablet widths before mobile card view kicks in

## Expected Behavior
- Table scrolls horizontally when content exceeds viewport
- Action column remains sticky but doesn't overlap other columns
- Action column is minimal width (44px for touch target)

## Root Cause
```css
.spreadsheet-wrapper {
  /* No overflow - let table expand naturally */
}
```

## Implementation

### File: `components/src/data/SpreadsheetTable/SpreadsheetTable.css`

**1. Add horizontal scroll to wrapper:**
```css
.spreadsheet-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

**2. Minimize action column width:**
```css
.action-header {
  width: 44px;
  min-width: 44px;
  padding: 0;
}

.action-cell {
  width: 44px;
  min-width: 44px;
  padding: 0;
}
```

**3. Compact delete button:**
```css
.delete-button {
  padding: 0;
  margin: 0;
  width: 44px;
  height: 44px;
}
```

## Acceptance Criteria
- [x] Action column stays 44px (minimum touch target)
- [x] Table scrolls horizontally when content exceeds viewport
- [x] No column overlap at any viewport width
- [x] Delete button remains accessible (44x44px)
- [x] Lint + build pass

## Files to Modify
- `components/src/data/SpreadsheetTable/SpreadsheetTable.css`

## Priority
High - Visual bug affecting usability

## Labels
bug, css, responsive, components

## Effort
Small (< 1 hour)
