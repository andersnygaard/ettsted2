# Task 316: Migrate EconomyPage to PageSkeleton

**Status**: Backlog
**Priority**: Medium
**Effort**: Simple (30 min)
**Skill**: frontend-design
**Risk**: Low
**Depends on**: Task 313

---

## Summary

Migrate EconomyPage (settings/profile page) to use PageSkeleton.

---

## File

- **TSX**: `frontend/src/features/auth/EconomyPage.tsx`
- **CSS**: `frontend/src/features/auth/EconomyPage.css` (if exists)

---

## Implementation

1. Import PageSkeleton from `@finans/components`
2. Wrap content with PageSkeleton (title, breadcrumb)
3. Remove duplicate layout CSS (background, padding)
4. Keep form-specific CSS
5. Verify visual parity

---

## Acceptance Criteria

- [x] EconomyPage uses PageSkeleton
- [x] Settings form works correctly
- [x] No visual regressions
- [x] Lint and compile pass

---

**Created**: 2025-12-14
