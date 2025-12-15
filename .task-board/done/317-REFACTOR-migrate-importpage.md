# Task 317: Migrate ImportPage to PageSkeleton

**Status**: Backlog
**Priority**: Medium
**Effort**: Medium (1-2 hours)
**Skill**: frontend-design
**Risk**: High (unique full-height chat layout)
**Depends on**: Task 313

---

## Summary

Migrate ImportPage (chat interface) to use PageSkeleton while preserving full-height layout.

---

## File

- **TSX**: `frontend/src/features/import/ImportPage.tsx`
- **CSS**: `frontend/src/features/import/ImportPage.css`

---

## Current Layout Concerns

- Uses `min-height: 100vh` for chat container
- Uses `max-width: 720px` for chat messages
- Full-height layout for chat scroll
- May conflict with PageSkeleton's padding

---

## Implementation

1. Research current structure thoroughly
2. Import PageSkeleton from `@finans/components`
3. Test with standard PageSkeleton first
4. If padding conflicts with chat layout:
   - Option A: Add `noPadding` prop to PageSkeleton
   - Option B: Override padding in ImportPage CSS
   - Option C: Use different layout approach
5. Preserve `max-width: 720px` constraint
6. Test chat scroll behavior
7. Remove duplicate CSS
8. Verify visual parity

---

## Acceptance Criteria

- [x] ImportPage uses PageSkeleton
- [x] Chat layout maintains full-height behavior
- [x] Chat messages constrained to 720px
- [x] Scroll behavior works correctly
- [x] No visual regressions
- [x] E2E import tests pass

---

## Notes

- This is the most complex migration
- May require PageSkeleton enhancement
- If PageSkeleton needs changes, verify no regression on other pages
- Consider if ImportPage should remain a special case

---

**Created**: 2025-12-14
