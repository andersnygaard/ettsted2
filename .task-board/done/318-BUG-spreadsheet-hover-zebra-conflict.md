# BUG: SpreadsheetTable hover broken on even rows

**Status**: Done
**Created**: 2025-12-14
**Priority**: Medium
**Labels**: components, css, visual-bug
**Estimated Effort**: Simple - 15 minutes
**Skill**: frontend-design

## Context & Motivation

User reported ugly visual artifact on portfolio page: hovering over table rows shows a striped/transparent effect on every other row instead of a solid highlight.

## Current State

In `SpreadsheetTable.css`, two CSS rules conflict:

```css
/* Line 229 - hover sets solid background */
.spreadsheet tbody tr:hover td {
  background: var(--warm-white);
}

/* Line 238 - zebra striping, same specificity, declared later = wins */
.spreadsheet tbody tr:nth-child(even) td {
  background: rgba(245, 242, 237, 0.5);
}
```

Both selectors have specificity `0,0,2,2`. CSS cascade rules mean the later declaration wins. Result: even rows keep their semi-transparent zebra background on hover instead of getting the solid hover background.

## Desired Outcome

Hovering any row (odd or even) shows consistent solid background color. No transparency artifacts.

## Acceptance Criteria

- [x] Hover effect applies uniformly to all rows
- [x] Even rows lose zebra striping when hovered
- [x] First column still gets special hover highlight
- [x] No visual regression on non-hovered state

## Affected Components

### Components
- **File**: `components/src/data/SpreadsheetTable/SpreadsheetTable.css`
- **Lines**: 220-244 (hover and zebra sections)

## Technical Approach

### Fix Option A (Recommended): Add combined selector

Add selector targeting even rows when hovered, placed AFTER zebra rules:

```css
/* After line 244, add: */
.spreadsheet tbody tr:nth-child(even):hover td {
  background: var(--warm-white);
}

.spreadsheet tbody tr:nth-child(even):hover td:first-child {
  background: var(--muted-sage-light-5);
}
```

### Fix Option B: Reorder rules

Move zebra striping rules BEFORE hover rules. Less explicit but works.

### Implementation Steps

1. Open `SpreadsheetTable.css`
2. Add combined selectors after line 244
3. Verify in Storybook
4. Test on portfolio page

## Code References

### Relevant CSS (lines 220-244)

```css
/* Row hover effects - enhanced with shadow and depth */
.spreadsheet tbody tr {
  transition: background-color 150ms ease, box-shadow 150ms ease;
}

.spreadsheet tbody tr:hover {
  box-shadow: inset 0 0 0 1px var(--border), 0 2px 8px rgba(0, 0, 0, 0.04);
}

.spreadsheet tbody tr:hover td {
  background: var(--warm-white);
}

.spreadsheet tbody tr:hover td:first-child {
  background: var(--muted-sage-light-5);
}

/* Optional zebra striping for visual rhythm */
.spreadsheet tbody tr:nth-child(even) td {
  background: rgba(245, 242, 237, 0.5);
}

.spreadsheet tbody tr:nth-child(even) td:first-child {
  background: var(--bone);
}
```

## Verification

- [x] Hover row 1 (odd) - solid background
- [x] Hover row 2 (even) - solid background, no transparency
- [x] Check first column highlight on both odd/even rows
- [x] Storybook stories render correctly

---

## Resolution

Fixed by adding combined selectors after zebra rules in `SpreadsheetTable.css` (lines 246-253):

```css
/* Override zebra on hover for even rows */
.spreadsheet tbody tr:nth-child(even):hover td {
  background: var(--warm-white);
}

.spreadsheet tbody tr:nth-child(even):hover td:first-child {
  background: var(--muted-sage-light-5);
}
```

**Technical explanation**: Combined selector `:nth-child(even):hover` has higher specificity (0,0,3,2) than either the hover (0,0,2,2) or zebra (0,0,2,2) rules alone, ensuring it wins the cascade.

**Completed**: 2025-12-14
