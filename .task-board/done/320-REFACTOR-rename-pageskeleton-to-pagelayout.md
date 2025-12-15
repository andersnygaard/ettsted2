# REFACTOR: Rename PageSkeleton to PageLayout

**Status**: Backlog
**Created**: 2025-12-14
**Priority**: High
**Labels**: components, naming
**Estimated Effort**: Simple - 1 hour
**Blocks**: #321, #322, #323, #324, #325

## Context & Motivation

`PageSkeleton` is a misleading name. The component is a **page layout wrapper** (breadcrumb, header, content container), not a skeleton loader. This causes confusion when actual skeleton loaders exist.

## Current State

- Component: `components/src/layout/PageSkeleton/`
- Used by: All pages in frontend
- Name suggests: Loading skeleton
- Actually is: Layout wrapper

## Desired Outcome

Component renamed to `PageLayout` - name reflects purpose.

## Acceptance Criteria

- [x] Folder renamed: `PageSkeleton/` → `PageLayout/`
- [x] Component renamed: `PageSkeleton` → `PageLayout`
- [x] All imports updated in frontend
- [x] Export updated in components index
- [x] Storybook story updated
- [x] Build passes
- [x] No breaking changes

## Affected Components

### Components Library
- `components/src/layout/PageSkeleton/` → `PageLayout/`
- `components/src/layout/PageSkeleton/PageSkeleton.tsx` → `PageLayout.tsx`
- `components/src/layout/PageSkeleton/PageSkeleton.css` → `PageLayout.css`
- `components/src/layout/PageSkeleton/PageSkeleton.stories.tsx` → `PageLayout.stories.tsx`
- `components/src/index.ts` - update export

### Frontend
- All pages importing `PageSkeleton` from `@finans/components`

## Technical Approach

1. Rename folder and files in components
2. Update component name and CSS class names
3. Update components/src/index.ts export
4. Find/replace all imports in frontend
5. Verify build

## Dependencies

- **Blocking**: This must complete before #321-#325 (they reference PageLayout)

---

**Next Steps**: Ready for implementation.
