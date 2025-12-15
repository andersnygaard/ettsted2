# BUG: Dashboard Milestone Box-Sizing

**Status**: Backlog
**Created**: 2025-12-14
**Priority**: Low
**Labels**: frontend, css, dashboard
**Estimated Effort**: Simple - 5 minutes

## Context & Motivation

`.dashboard-milestone` has `max-width: 900px` but padding adds to this, making the actual visual width 980px. The element should be exactly 900px including padding.

## Current State

```css
/* DashboardPage.css line 78 */
.dashboard-milestone {
  max-width: 900px;
  padding: var(--space-xl) var(--space-lg);  /* 32px top/bottom, 40px left/right */
}
```

DevTools box model shows:
- Content: 900px
- Padding: 40px left + 40px right
- **Total visual width: 980px**

## Desired Outcome

`.dashboard-milestone` total width (including padding) should be exactly 900px.

## Acceptance Criteria

- [x] `.dashboard-milestone` total width is 900px (content + padding)
- [x] Visual appearance unchanged (just tighter width)
- [x] Desktop grid layout still works correctly

## Affected Components

### Frontend
- **File**: `frontend/src/features/dashboard/DashboardPage.css`
- **Class**: `.dashboard-milestone`

## Technical Approach

Add `box-sizing: border-box` to `.dashboard-milestone`:

```css
.dashboard-milestone {
  box-sizing: border-box;  /* ADD THIS */
  max-width: 900px;
  /* ... rest unchanged */
}
```

This makes `max-width` include padding, so total width = 900px.

**Note**: Check if there's a global `box-sizing: border-box` reset. If yes, investigate why it's not applying to this element.

## Code References

### Current CSS (line 78-91)

```css
/* File: frontend/src/features/dashboard/DashboardPage.css */
.dashboard-milestone {
  max-width: 900px;
  margin: 0 auto var(--space-5xl);
  background: var(--charcoal);
  border: none;
  color: var(--warm-white);
  padding: var(--space-xl) var(--space-lg);
  border-radius: var(--radius-sm);
  animation: fadeUp 0.6s ease both;
  animation-delay: 0.3s;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
```

## Verification

- [x] Open Dashboard page
- [x] Inspect `.dashboard-milestone` in DevTools
- [x] Verify box model shows ~820px content + 80px padding = 900px total

---

**Next Steps**: Ready for implementation. Move to `.task-board/in-progress/` when starting work.
