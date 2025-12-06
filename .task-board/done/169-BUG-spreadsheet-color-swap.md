# 169 - BUG: SpreadsheetTable Category Colors Swapped

**Type**: Bug
**Priority**: MEDIUM
**Effort**: Simple

---

## Problem

SpreadsheetTable displays wrong colors for Sparing and Pensjon column groups:
- Sparing shows Pensjon color (blue instead of green)
- Pensjon shows Sparing color (green instead of blue)

This confuses users and violates design system.

---

## Evidence

```css
/* components/src/data/SpreadsheetTable/SpreadsheetTable.css:56-78 */

/* WRONG - sparing has pensjon color */
.spreadsheet .group-header-row th.group-sparing {
  background: var(--category-pensjon);  /* Should be: --category-sparing */
}

/* CORRECT */
.spreadsheet .group-header-row th.group-gjeld {
  background: var(--category-gjeld);
}

/* WRONG - pensjon has sparing color */
.spreadsheet .group-header-row th.group-pensjon {
  background: var(--category-sparing);  /* Should be: --category-pensjon */
}
```

---

## Fix

Swap the two incorrect color assignments.

---

## Tasks

- [x] Open components/src/data/SpreadsheetTable/SpreadsheetTable.css
- [x] Line ~60: Change `var(--category-pensjon)` to `var(--category-sparing)`
- [x] Line ~70: Change `var(--category-sparing)` to `var(--category-pensjon)`
- [x] Also fix hover states if present
- [x] Build components: `pnpm --filter @finans/components build`
- [x] Visual verification in Portfolio page

---

## Acceptance Criteria

- [x] Sparing columns show green (--category-sparing)
- [x] Pensjon columns show blue (--category-pensjon)
- [x] Gjeld columns still show red (--category-gjeld)
- [x] Hover states match base colors

---

## COMPLETED

Fixed all color swaps in SpreadsheetTable.css:
- Line 57: `.group-sparing` now uses `--category-sparing` (green)
- Line 61: `.group-sparing:hover` now uses `--category-sparing-hover`
- Line 73: `.group-pensjon` now uses `--category-pensjon` (blue)
- Line 77: `.group-pensjon:hover` now uses `--category-pensjon-hover`

Build successful with no errors.

---

## References

- Due Diligence Report: .docs/DUE-DILIGENCE-REPORT.md (Critical Errors #3)
- File: components/src/data/SpreadsheetTable/SpreadsheetTable.css:56-78
