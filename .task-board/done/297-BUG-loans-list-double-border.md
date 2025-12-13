# BUG: LoansList Double Border Between Last Row and Sum

**Status**: Done
**Created**: 2025-12-12
**Priority**: Low
**Labels**: frontend, css, gjeld
**Estimated Effort**: Simple - 15 min

## Problem

Double line between last loan row and sum row on Gjeld page.

**Root cause**: `.loan-item` has `border-bottom` and `.loan-sum-row` has `border-top`. When sum row exists, last `.loan-item` is NOT `:last-child`, so it keeps its border-bottom = 2 lines.

## Fix

Add CSS:
```css
.loan-item:has(+ .loan-sum-row) {
  border-bottom: none;
}
```

## File
`frontend/src/features/gjeld/GjeldPage.css`
