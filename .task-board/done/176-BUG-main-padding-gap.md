# 176-BUG: Main Element Padding Gap Artifact

## Summary
`<main>` element has top/bottom padding in `.app-layout > main` that creates visual gap artifacts on pages where content already has its own spacing.

## Priority
MEDIUM

## Effort
Simple

## Context
Layout.css applies `padding: var(--space-xl) 0 var(--space-2xl)` to `<main>`, creating 24px top and 32px bottom gaps. This conflicts with page-level spacing (PageSkeleton, PageHeader) causing double-spacing artifacts.

## File Locations
- [frontend/src/shared/components/Layout.css](frontend/src/shared/components/Layout.css#L13-L16)

## Current Code
```css
.app-layout > main {
  flex: 1;
  padding: var(--space-xl) 0 var(--space-2xl);
}
```

## Acceptance Criteria
- [x] Remove or reduce `<main>` padding
- [x] Pages control their own vertical spacing via PageSkeleton/PageHeader
- [x] No visible gap artifacts between header and content
- [x] Consistent spacing across all pages

## Status
COMPLETED

## Resolution
Removed all padding from `.app-layout > main` (changed from `padding: var(--space-xl) 0 var(--space-2xl)` to `padding: 0`). Also removed responsive padding rule for mobile since not needed with zero padding. Frontend build passes with no errors.

## Technical Approach
1. Remove padding from `.app-layout > main`
2. Ensure PageSkeleton handles top spacing consistently
3. Test all pages (dashboard, sparing, gjeld, pensjon, calculators, portfolio)
