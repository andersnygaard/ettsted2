# FEATURE: Migrate System Components to Storybook

**Status**: Complete
**Created**: 2025-12-01
**Priority**: Low
**Labels**: components, storybook, migration, system
**Estimated Effort**: Medium - 2 hours

## Context & Motivation

System-level components (Toast notifications, Error boundaries) provide application-wide functionality. These are decoupled from business logic and can be shared.

## Desired Outcome

Toast and ErrorBoundary components are in `/components/src/system/` with stories demonstrating all notification types and error states.

## Acceptance Criteria

**Ready to migrate:**
- [x] Migrate Toast.tsx + Toast.css + ToastContext
- [x] Migrate ErrorBoundary.tsx
- [x] Toast stories show all types: success, error, warning, info
- [x] ErrorBoundary story shows fallback UI
- [x] Export all from `components/src/index.ts`

**Deferred (need auth refactor first):**
- AvatarMenu.tsx (depends on useAuth hook)
- AppHeader.tsx (depends on useAuth + route config)

## Technical Approach

**Toast system:**
- ToastProvider context wrapper
- useToast hook for triggering
- Toast component for display
- Auto-dismiss behavior

**Toast stories:**
- Success notification
- Error notification
- Warning notification
- Info notification
- Multiple toasts stacked
- Manual dismiss

**ErrorBoundary stories:**
- Default fallback UI
- Custom fallback UI
- Trigger error button for demo

**Source files:**
- `frontend/src/shared/components/Toast.tsx`
- `frontend/src/shared/components/ErrorBoundary.tsx`

## Dependencies

- Task 101 (Storybook config) must be complete

## Notes

AvatarMenu and AppHeader are intentionally excluded. They depend on:
- `useAuth` hook (auth context)
- Route configuration

These should stay in frontend until auth is abstracted into a provider pattern that components can consume.

---

**Next Steps**: Update frontend imports (107)
