---
paths:
  - frontend/src/features/portfolio/**/*
  - components/src/data/SpreadsheetTable/**/*
---

# Portfolio Rules

## Components
- **SpreadsheetTable** - Main data table for monthly snapshots
- **PortfolioPage** - Feature page consuming SpreadsheetTable

## SpreadsheetTable Architecture

### Dual View System
```
Desktop (e769px): <table class="spreadsheet spreadsheet--desktop">
Mobile  (<769px): <div class="spreadsheet--mobile"> ’ Card view
```

### Sticky Positioning
| Element | Position | Z-Index | Notes |
|---------|----------|---------|-------|
| Date column (first) | `sticky; left: 0` | 20 | Always visible on horizontal scroll |
| Group headers | `sticky; top: 0` | 15 | Column group labels |
| Column headers | `sticky; top: 0` | 10 | Account names |
| Action column (last) | `sticky; right: 0` | 4 | Delete button |

### Z-Index Stack
```
25: Date header (group row)
20: Date column (th:first-child)
15: Group headers
10: Column headers
5:  Date cell (td:first-child)
4:  Action cell
```

## Responsive Behavior

### Breakpoint: 769px
- **Below 769px**: Mobile card view (horizontal scroll cards)
- **Above 769px**: Desktop table view

### Mobile Card View
- Horizontal scroll with snap (`scroll-snap-type: x mandatory`)
- Cards 85% width, min 280px, max 360px
- Collapsible category groups (tap to toggle)
- Touch targets 44px minimum

### Desktop Table View
- Horizontal scroll on wrapper when content exceeds viewport
- Sticky columns for date and actions
- Collapsible column groups

## Touch Targets
```css
--touch-target-min: 44px;  /* From tokens.css */

/* Action buttons MUST be 44x44px minimum */
.delete-button {
  min-width: 44px;
  min-height: 44px;
}
```

## Gotchas

### Sticky Column Overlap
**Problem**: Action column overlaps adjacent columns on narrow viewports.
**Solution**: Wrapper needs `overflow-x: auto` for horizontal scroll.
```css
.spreadsheet-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
```

### Action Column Width
Keep minimal - 44px for touch target, no extra padding:
```css
.action-cell {
  width: 44px;
  min-width: 44px;
  padding: 0;
}
```

### Column Groups
- Collapsible via click/keyboard on group header
- When collapsed, only shows total column
- State tracked in component via `collapsedGroups` Set

### Inline Editing
- Click cell to edit (non-total cells only)
- Tab/Shift+Tab to navigate cells
- Enter to save, Escape to cancel
- Input styled to match cell dimensions

## File Locations
- Component: `components/src/data/SpreadsheetTable/SpreadsheetTable.tsx`
- Styles: `components/src/data/SpreadsheetTable/SpreadsheetTable.css`
- Stories: `components/src/data/SpreadsheetTable/SpreadsheetTable.stories.tsx`
- Feature page: `frontend/src/features/portfolio/PortfolioPage.tsx`
