# Task 229: Replace Hardcoded Colors with CSS Variables

**Priority**: Low
**Category**: Design
**Effort**: Low (20 min)
**Impact**: Design +1 point (Consistency)

## Problem

Some rgba values hardcoded instead of CSS variables:
- Modal z-index hardcoded (2000)
- Some rgba colors in feature CSS

## Files

- `components/src/ui/Modal/Modal.css`
- Various feature CSS files

## Implementation

Replace hardcoded values:
```css
/* Before */
z-index: 2000;
background: rgba(157, 107, 90, 0.1);

/* After */
z-index: var(--z-modal);
background: var(--negative-light);
```

## Acceptance Criteria

- [x] All colors use CSS variables
- [x] Z-index uses tokens
- [x] Consistent theming possible
