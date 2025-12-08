# 235 - SpreadsheetTable Visual Polish

**Type**: DESIGN
**Priority**: Medium
**Effort**: Medium (45 min - 1 hour)
**Labels**: frontend, polish, data-display

## Context

The SpreadsheetTable is the core data component for portfolio tracking. While functionally solid, it lacks visual refinement:
- Row hover effects are minimal (just background color)
- Milestone highlighting CSS is incomplete
- Delete button lacks clear affordance
- Column group headers have uniform visual weight

## Problem

Location: [SpreadsheetTable.css](../../components/src/data/SpreadsheetTable/SpreadsheetTable.css)

Issues identified:
1. **Row hover**: Only background color change, no shadow or depth
2. **Milestone styling**: `value-milestone` class exists in TSX but CSS styling is missing
3. **Visual hierarchy**: All column groups look the same despite different categories
4. **Delete affordance**: Delete button blends in until hovered

## Acceptance Criteria

- [x] Row hover adds subtle shadow + darker background
- [x] Milestone values show gold star icon or gold text color
- [x] Column group headers have category-specific styling (subtle color hints)
- [x] Delete button has clearer hover state with color change
- [x] Active/selected row has distinct styling
- [x] Zebra striping optional but available

## Technical Approach

### 1. Enhanced Row Hover

```css
.spreadsheet-row {
  transition: background-color 150ms ease, box-shadow 150ms ease;
}

.spreadsheet-row:hover {
  background-color: var(--warm-white);
  box-shadow: inset 0 0 0 1px var(--border);
}
```

### 2. Milestone Value Styling

```css
.value-milestone {
  color: var(--gold);
  font-weight: 600;
  position: relative;
}

.value-milestone::before {
  content: '★';
  position: absolute;
  left: -16px;
  font-size: 12px;
  color: var(--gold);
}
```

### 3. Category Column Headers

Add subtle background tints to column group headers:

```css
.column-group--sparing .column-group-header {
  background-color: var(--muted-sage-light-4);
}

.column-group--gjeld .column-group-header {
  background-color: var(--soft-terracotta-light);
}

.column-group--pensjon .column-group-header {
  background-color: var(--pale-blue-light);
}
```

### 4. Delete Button Affordance

```css
.row-delete-btn {
  opacity: 0.4;
  transition: opacity 150ms, color 150ms;
}

.spreadsheet-row:hover .row-delete-btn {
  opacity: 0.7;
}

.row-delete-btn:hover {
  opacity: 1;
  color: var(--negative);
}
```

### 5. Optional Zebra Striping

```css
.spreadsheet-row:nth-child(even) {
  background-color: rgba(245, 242, 237, 0.5); /* bone at 50% */
}
```

## Files to Modify

- `components/src/data/SpreadsheetTable/SpreadsheetTable.css`
- `components/src/data/SpreadsheetTable/SpreadsheetTable.tsx` (if class names need adjustment)
- `components/src/styles/tokens.css` (add opacity variants if missing)

## Testing

- [ ] Row hover feels responsive and polished
- [ ] Milestone highlighting visible and tasteful
- [ ] Category columns distinguishable at a glance
- [ ] Delete button state transitions smooth
- [ ] No visual regressions in Storybook
- [ ] Test with real portfolio data

## Related Plans

- [038-FEATURE-spreadsheet-table.md](../done/038-FEATURE-spreadsheet-table.md) - original implementation
- [209-REFACTOR-spreadsheet-table-accessibility.md](../done/209-REFACTOR-spreadsheet-table-accessibility.md) - accessibility improvements

## Resolution

Enhanced SpreadsheetTable.css with:
- Row hover: box-shadow + warm-white background with 150ms transitions
- Milestone values: gold color, star icon via ::before pseudo-element
- Category headers: accent lines (sparing=sage, gjeld=terracotta, pensjon=blue)
- Delete button: better affordance (0.3→0.7→1 opacity states, negative color on hover)
- Zebra striping: 50% bone on even rows

Completed: 2025-12-08
