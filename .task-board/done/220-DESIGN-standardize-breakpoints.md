# Task 220: Standardize Media Query Breakpoints

**Priority**: Medium
**Category**: Design
**Effort**: Medium (1 hour)
**Impact**: Design +2 points (Responsive)

## Problem

Inconsistent breakpoints: 640px, 768px, 1024px, 1200px across components.

## Files

- `components/src/styles/tokens.css`
- Various component CSS files

## Implementation

Document standard breakpoints in tokens.css:
```css
/* Breakpoints:
   --bp-sm: 640px (mobile)
   --bp-md: 768px (tablet)
   --bp-lg: 1024px (desktop)
   --bp-xl: 1400px (wide)
*/
```

Audit and update all media queries.

## Acceptance Criteria

- [x] Breakpoints documented
- [x] All components use consistent values
- [x] Responsive behavior consistent
