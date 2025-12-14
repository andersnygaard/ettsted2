# Task 313: Enhance PageSkeleton with Base Page Styles

**Status**: Backlog
**Priority**: High
**Effort**: Simple (30 min)
**Skill**: frontend-design
**Risk**: Low

---

## Summary

Add base page styling (background color and vertical padding) directly to PageSkeleton component. This eliminates the need for each page to apply these styles individually.

---

## Context

- PageSkeleton location: `components/src/layout/PageSkeleton/`
- Currently handles: container, breadcrumb, header, animations
- Missing: background color (`--bone`), vertical padding
- **Foundation task**: Required before tasks 314-316 can remove duplicate styles

---

## Changes Required

### File: `components/src/layout/PageSkeleton/PageSkeleton.css`

Add to `.page-skeleton` class:

```css
.page-skeleton {
  background: var(--bone);
  padding-top: var(--space-xl);
  padding-bottom: var(--space-2xl);
}
```

### File: `components/src/layout/PageSkeleton/PageSkeleton.stories.tsx`

Verify Storybook story renders correctly with new base styles.

---

## Acceptance Criteria

- [ ] PageSkeleton has `background: var(--bone)` applied
- [ ] PageSkeleton has vertical padding (`--space-xl` top, `--space-2xl` bottom)
- [ ] Storybook story renders without visual regressions
- [ ] No breaking changes to existing page usage
- [ ] Lint and compile pass

---

## Blocks

- Task 314, 315, 316 depend on this task

---

**Created**: 2025-12-14
