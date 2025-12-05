# 135-REFACTOR: Portfolio Date Header Z-Index

**Priority**: Medium
**Effort**: Quick (5 min)
**Labels**: frontend, css

---

## Context

In the portfolio page SpreadsheetTable, the `.date-header` (first column in group header row) needs a higher z-index to appear above other content during horizontal scrolling.

Currently it may be obscured by other sticky elements.

---

## Acceptance Criteria

- [ ] Date header remains visible and on top during horizontal scroll
- [ ] No visual glitches or overlapping elements
- [ ] Works correctly with existing sticky positioning

---

## Technical Approach

Current z-index is 20. May need to increase to 25 or higher.

```css
.spreadsheet .group-header-row th.date-header {
  z-index: 25; /* Was 20 */
}
```

Also verify the z-index hierarchy:
- Group headers: z-index 15
- Column headers: z-index 10
- Date cell (first column): z-index 5
- Date header: z-index 20 → 25

---

## Files to Modify

- [SpreadsheetTable.css](components/src/data/SpreadsheetTable/SpreadsheetTable.css#L81-L91)
