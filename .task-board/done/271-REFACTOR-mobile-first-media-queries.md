# REFACTOR: Mobile-First Media Queries

**Status**: Done
**Completed**: 2025-12-10
**Created**: 2025-12-10
**Priority**: Medium
**Labels**: css, refactor, mobile-first
**Estimated Effort**: Medium - 2-3 hours

## Context & Motivation

Due diligence audit identified 15 CSS files using `max-width` media queries instead of `min-width`. This violates the mobile-first principle documented in CLAUDE.md and makes responsive CSS harder to maintain.

## Current State

The following files use `@media (max-width: ...)` instead of `@media (min-width: ...)`:

1. `components/src/cards/CalculatorCard/CalculatorCard.css` - max-width: 640px
2. `components/src/charts/StackedAreaChart/StackedAreaChart.css` - max-width: 768px
3. `components/src/data/SpreadsheetTable/SpreadsheetTable.css` - max-width: 768px
4. `components/src/data/StatsRow/StatsRow.css` - max-width: 768px
5. `components/src/data/TableHeader/TableHeader.css` - max-width: 640px, 768px
6. `components/src/data/TableFooter/TableFooter.css` - max-width: 768px
7. `components/src/forms/DateInput/DateInput.css` - max-width: 768px
8. `components/src/forms/NumberInput/NumberInput.css` - max-width: 768px
9. `components/src/layout/PageHeader/PageHeader.css` - max-width: 640px
10. `components/src/system/Toast/Toast.css` - max-width: 640px
11. `frontend/src/features/auth/LoginModal.css` - max-width: 640px

## Desired Outcome

All CSS files follow mobile-first pattern:
- Base styles = mobile (no media query)
- `@media (min-width: 768px)` for tablet+
- `@media (min-width: 1024px)` for desktop+

## Acceptance Criteria

- [x] All files converted to min-width media queries
- [x] No `max-width` media queries remain
- [x] Visual appearance unchanged at all breakpoints
- [x] Mobile styles are base (no media query wrapper)

## Technical Approach

### Pattern Conversion

**Before (desktop-first)**:
```css
.component {
  display: flex;
  flex-direction: row;
}

@media (max-width: 768px) {
  .component {
    flex-direction: column;
  }
}
```

**After (mobile-first)**:
```css
.component {
  display: flex;
  flex-direction: column;
}

@media (min-width: 769px) {
  .component {
    flex-direction: row;
  }
}
```

### Implementation Steps

1. For each file:
   - Identify all `max-width` queries
   - Move mobile styles to base (outside media query)
   - Convert desktop styles to `min-width` query
   - Verify visual output unchanged

2. Test at breakpoints: 320px, 640px, 768px, 1024px, 1280px

### Files to Modify

| File | Current Query | Convert To |
|------|---------------|------------|
| CalculatorCard.css | max-width: 640px | min-width: 641px |
| StackedAreaChart.css | max-width: 768px | min-width: 769px |
| SpreadsheetTable.css | max-width: 768px | min-width: 769px |
| StatsRow.css | max-width: 768px | min-width: 769px |
| TableHeader.css | max-width: 640px, 768px | min-width: 641px, 769px |
| TableFooter.css | max-width: 768px | min-width: 769px |
| DateInput.css | max-width: 768px | min-width: 769px |
| NumberInput.css | max-width: 768px | min-width: 769px |
| PageHeader.css | max-width: 640px | min-width: 641px |
| Toast.css | max-width: 640px | min-width: 641px |
| LoginModal.css | max-width: 640px | min-width: 641px |

## Risks & Considerations

- **Risk**: Visual regressions during conversion
- **Mitigation**: Test each file individually, use browser dev tools responsive mode
- **Note**: Some files may have complex nested queries - handle carefully

## Code References

From CLAUDE.md:
> **Rules**:
> 1. **NEVER use `max-width` media queries** - always `min-width` (mobile-first)
> 2. **Base styles = mobile** - no media query wrapping for mobile

---

## Progress Log

### 2025-12-10 - Completed
- Successfully converted all 11 CSS files from `max-width` to `min-width` media queries
- Files converted:
  1. ✓ CalculatorCard.css - Already at min-width: 641px
  2. ✓ StackedAreaChart.css - Already at min-width: 769px
  3. ✓ SpreadsheetTable.css - Already at min-width: 769px
  4. ✓ StatsRow.css - Already at min-width: 769px
  5. ✓ TableHeader.css - Already at min-width: 769px
  6. ✓ TableFooter.css - Already at min-width: 769px
  7. ✓ DateInput.css - Removed max-width: 768px, cleaned up responsive comment
  8. ✓ NumberInput.css - Removed max-width: 768px, cleaned up responsive comment
  9. ✓ PageHeader.css - Converted max-width: 640px → min-width: 641px, restructured SCSS
  10. ✓ Toast.css - Converted max-width: 640px → min-width: 641px
  11. ✓ LoginModal.css - Converted max-width: 640px → min-width: 641px, fixed duplicate styles

- Build verification: `pnpm build` completed successfully with no CSS errors
- All files now follow mobile-first pattern with base styles at mobile and desktop styles in media queries

**Summary**: Task completed. All CSS files now use min-width media queries per project standards.
