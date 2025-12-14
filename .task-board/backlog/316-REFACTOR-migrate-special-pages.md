# Task 316: Migrate ImportPage and EconomyPage to PageSkeleton

**Status**: Backlog
**Priority**: Medium
**Effort**: Medium (2 hours)
**Skill**: frontend-design
**Risk**: High (unique layouts may need PageSkeleton adjustments)
**Depends on**: Task 313

---

## Summary

Migrate the two remaining special pages to use PageSkeleton, maintaining their unique layout requirements.

---

## Pages to Migrate

### 1. EconomyPage (simpler - migrate first)
- **File**: `frontend/src/features/auth/EconomyPage.tsx`
- **Type**: Settings/profile page with form
- **Expected**: Straightforward migration

### 2. ImportPage (complex)
- **File**: `frontend/src/features/import/ImportPage.tsx`
- **Type**: Chat interface with full-height layout
- **Concerns**:
  - Uses `min-height: 100vh` for chat container
  - Uses `max-width: 720px` for chat messages
  - May need `noPadding` prop or special handling

---

## Implementation Steps

### EconomyPage
1. Import PageSkeleton from `@finans/components`
2. Wrap content with PageSkeleton
3. Remove duplicate CSS
4. Verify visual parity

### ImportPage
1. Research current structure thoroughly
2. Import PageSkeleton
3. Handle full-height chat layout (may need PageSkeleton prop)
4. Preserve `max-width: 720px` constraint
5. Test chat scroll behavior
6. Remove duplicate CSS
7. Verify visual parity

---

## Acceptance Criteria

- [ ] Both pages use PageSkeleton
- [ ] ImportPage chat layout maintains full-height behavior
- [ ] ImportPage chat messages constrained to 720px
- [ ] EconomyPage settings form works correctly
- [ ] No visual regressions
- [ ] All E2E tests pass

---

## Notes

- Migrate EconomyPage first to validate approach
- ImportPage may require PageSkeleton enhancement (e.g., `noPadding` prop)
- If PageSkeleton needs changes, ensure no regression on other pages

---

**Created**: 2025-12-14
