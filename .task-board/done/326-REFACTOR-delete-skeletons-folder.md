# REFACTOR: Delete Skeletons Folder

**Status**: Backlog
**Created**: 2025-12-14
**Priority**: Medium
**Labels**: frontend, cleanup
**Estimated Effort**: Simple - 15 min
**Depends On**: #321, #322, #323, #324, #325

## Context & Motivation

After inlining all page skeletons, the `shared/components/skeletons/` folder is empty and should be deleted.

## Current State

```
frontend/src/shared/components/skeletons/
├── index.ts
├── PageSkeletons.css
├── DashboardSkeleton.tsx
├── PortfolioSkeleton.tsx
├── SparingSkeleton.tsx
├── GjeldSkeleton.tsx
└── PensjonSkeleton.tsx
```

## Desired Outcome

Folder deleted. No orphan files.

## Acceptance Criteria

- [x] All 5 skeleton .tsx files deleted
- [x] PageSkeletons.css deleted
- [x] index.ts deleted
- [x] Folder removed
- [x] No remaining imports reference this folder
- [x] Build passes

## Affected Components

### Frontend
- Delete: `frontend/src/shared/components/skeletons/` (entire folder)
- Update: `frontend/src/shared/components/index.ts` (remove re-export if any)

## Technical Approach

1. Verify all page skeletons are inlined (#321-#325 complete)
2. Search for any remaining imports
3. Delete entire folder
4. Remove from shared/components/index.ts if exported
5. Verify build

---

**Next Steps**: Ready for implementation after #321-#325 complete.
