# Design: Mobile-First CSS Refactor - Foundation

**Status**: Backlog
**Created**: 2025-12-08
**Priority**: High
**Labels**: frontend, design, mobile, foundation
**Estimated Effort**: Medium - 1-2 days

## Context & Motivation

The codebase currently uses desktop-first CSS with `max-width` media queries. Per CLAUDE.md mobile-first strategy, all CSS should use `min-width` queries with mobile as the base. This foundational task establishes the pattern for all subsequent mobile work.

## Current State

- Most CSS files use `@media (max-width: var(--bp-md))` pattern (desktop-first)
- tokens.css defines breakpoints but they're used inconsistently
- No `--touch-target-min` variable defined
- Some components already have mobile styles but written backwards

## Desired Outcome

- All CSS follows mobile-first pattern: base styles = mobile, `min-width` queries for larger screens
- `--touch-target-min: 44px` added to tokens.css
- Foundation CSS files refactored as reference examples

## Acceptance Criteria

- [x] Add `--touch-target-min: 44px` to tokens.css
- [x] Refactor `global.css` to mobile-first pattern
- [x] Refactor `animations.css` to mobile-first (disable animations on mobile if needed)
- [x] Update Container component to mobile-first
- [x] Create CSS comment template for consistent media query organization
- [x] Document pattern in code comments

## Affected Components

### Frontend
- **Files**:
  - `components/src/styles/tokens.css`
  - `frontend/src/styles/global.css`
  - `frontend/src/styles/animations.css`
  - `components/src/layout/Container/Container.css`

## Technical Approach

### Implementation Steps

1. **Add touch target token**:
   ```css
   /* tokens.css */
   --touch-target-min: 44px;  /* WCAG minimum touch target */
   ```

2. **Establish CSS comment pattern**:
   ```css
   /* ============================================
      BASE STYLES (Mobile)
      ============================================ */
   .component {
     /* Mobile-first base styles */
   }

   /* ============================================
      TABLET AND UP
      ============================================ */
   @media (min-width: 768px) {
     .component { }
   }

   /* ============================================
      DESKTOP AND UP
      ============================================ */
   @media (min-width: 1024px) {
     .component { }
   }
   ```

3. **Refactor Container component as reference**

### Dependencies

- None - this is foundational work

### Risks & Considerations

- **Risk**: Breaking existing layouts during refactor
- **Mitigation**: Test each change on both mobile and desktop before committing

## Code References

### Current Pattern (to replace)
```css
/* DashboardPage.css - WRONG (desktop-first) */
@media (max-width: var(--bp-md)) {
  .dashboard-hero__value {
    font-size: 48px;
  }
}
```

### Target Pattern
```css
/* CORRECT (mobile-first) */
.dashboard-hero__value {
  font-size: 48px;  /* Mobile base */
}

@media (min-width: 768px) {
  .dashboard-hero__value {
    font-size: 84px;  /* Tablet+ enhancement */
  }
}
```

---

**Next Steps**: Ready for implementation. Move to `.task-board/in-progress/` when starting work.

## Resolution

Established mobile-first CSS foundation:
- Added --touch-target-min: 44px to tokens.css
- Refactored animations.css: mobile base with faster animations, tablet+ enhancements
- Refactored Container.css: mobile base padding, tablet+ enhanced padding
- Reorganized global.css with clear section headers
- CSS comment template established for consistent organization

All files now use min-width pattern instead of max-width.

Completed: 2025-12-08
