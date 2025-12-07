# REFACTOR: Move CSS Tokens to Components Package

**Status**: Done
**Created**: 2025-12-07
**Priority**: Medium
**Labels**: frontend, components, css, architecture
**Estimated Effort**: Medium - 2-3 hours

## Context & Motivation

The due diligence audit identified an architecture issue: CSS design tokens live in `frontend/src/styles/tokens.css` but components reference these variables.

External consumers of `@finans/components` won't have access to the CSS variables, breaking the component library for standalone use.

## Current State

- **Tokens location**: `frontend/src/styles/tokens.css`
- **Components reference**: Variables like `--charcoal`, `--warm-white`, `--font-body`
- **Problem**: Components package doesn't export tokens

## Desired Outcome

- CSS tokens live in components package
- Components package exports tokens.css
- Frontend imports tokens from components
- External consumers get working components

## Acceptance Criteria

- [x] `tokens.css` moved to `components/src/styles/tokens.css`
- [x] Exported from components barrel or documented import path
- [x] Frontend imports tokens from components
- [x] All components render correctly
- [x] Storybook shows components with correct styles
- [x] Build succeeds in all workspaces

## Affected Components

### Components Package
- **New**: `components/src/styles/tokens.css`
- **Update**: Package.json exports (if needed)
- **Update**: Storybook preview to import tokens

### Frontend Package
- **Remove**: `frontend/src/styles/tokens.css`
- **Update**: Import tokens from `@finans/components/styles/tokens.css`
- **Update**: `frontend/src/styles/global.css` imports

### Testing
- **Visual**: All pages render correctly
- **Storybook**: Components display properly

## Technical Approach

### Implementation Steps

1. **Move tokens.css**
   - Copy `frontend/src/styles/tokens.css` to `components/src/styles/tokens.css`
   - Ensure path is included in package exports

2. **Update components Storybook**
   - Import tokens in `.storybook/preview.css`
   - Verify all stories render correctly

3. **Update frontend imports**
   - Change import path in `global.css` or root CSS
   - Remove old `tokens.css` from frontend

4. **Verify builds**
   - `pnpm build` in all workspaces
   - Visual inspection of app

### Package Export Pattern

```json
// components/package.json
{
  "exports": {
    ".": "./dist/index.js",
    "./styles/tokens.css": "./src/styles/tokens.css"
  }
}
```

### Risks & Considerations

- **Risk**: Import path changes break builds
- **Mitigation**: Update all references carefully

## Code References

### Current Location (Move From)

```css
/* frontend/src/styles/tokens.css */
:root {
  --bone: #F5F2ED;
  --warm-white: #FDFCFA;
  /* ... */
}
```

### New Location (Move To)

```css
/* components/src/styles/tokens.css */
:root {
  --bone: #F5F2ED;
  --warm-white: #FDFCFA;
  /* ... */
}
```

## Related Plans

- Due Diligence Report: `.docs/DUE-DILIGENCE-REPORT.md`
- 005-REFACTOR-consolidate-formatting-utils.md

---
**Next Steps**: Architecture improvement for reusable component library.
