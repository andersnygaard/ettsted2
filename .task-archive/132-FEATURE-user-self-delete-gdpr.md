# 132-FEATURE: User Self-Delete (GDPR Compliant)

**Priority**: High
**Effort**: Medium (2-3 hours)
**Labels**: backend, frontend, gdpr, security

---

## Context

Users must be able to delete their own account and all associated data. This is a GDPR requirement ("right to be forgotten").

The feature should:
1. Provide a clear UI for account deletion
2. Require confirmation (prevent accidental deletion)
3. Delete all user data from the database
4. Document this right in the terms/privacy pages

---

## Acceptance Criteria

- [x] Backend: `DELETE /api/v1/users/me` endpoint
- [x] Delete user document from `users` container
- [x] Delete all snapshots from `portfolios` container where `userId` matches
- [x] Frontend: "Slett konto" button in economy/profile settings
- [x] Confirmation modal with clear warning
- [x] After deletion, log out and redirect to home
- [x] Update Vilkår/Personvern with deletion rights info

---

## Resolution

**Completed**: 2025-12-04

### Implementation Summary

**Backend**:
- Added `DELETE /api/v1/users/me` endpoint in userRoutes.ts
- Added `deleteMe` controller in userController.ts
- Uses existing `deleteAllSnapshotsForUser()` and `deleteUser()` services

**Frontend**:
- Created DeleteAccountModal component with SLETT confirmation
- Added "Slett konto" button to AvatarMenu with danger styling
- Integrated modal in AppHeader with logout/redirect flow
- Updated TermsDialog with deletion rights in Personvern section

**Files Created**:
- frontend/src/features/auth/DeleteAccountModal.tsx
- frontend/src/features/auth/DeleteAccountModal.css

**Files Modified**:
- backend/src/controllers/userController.ts
- backend/src/routes/userRoutes.ts
- frontend/src/shared/components/AvatarMenu.tsx
- frontend/src/shared/components/AppHeader.tsx
- frontend/src/features/auth/TermsDialog.tsx

**Build Status**: Both backend and frontend build successfully

---

## Technical Approach

### Backend

```typescript
// DELETE /api/v1/users/me
async function deleteUser(userId: string) {
  // 1. Delete all snapshots
  const snapshots = await getSnapshotsByUserId(userId);
  for (const snapshot of snapshots) {
    await deleteSnapshot(userId, snapshot.id);
  }

  // 2. Delete user document
  await deleteUserById(userId);

  // 3. Return success
  return { success: true, message: 'Bruker slettet' };
}
```

### Frontend

Add to AvatarMenu or EconomyPage:
- "Slett min konto" button (danger styling)
- Confirmation modal: "Er du sikker? Alle data vil bli permanent slettet."
- Input field requiring user to type "SLETT" to confirm

---

## Files to Create/Modify

### Backend
- `backend/src/routes/userRoutes.ts` - Add DELETE endpoint
- `backend/src/services/userService.ts` - Add `deleteUserById()`
- `backend/src/services/portfolioService.ts` - Add `deleteAllUserSnapshots()`

### Frontend
- `frontend/src/shared/components/AvatarMenu.tsx` - Add delete option
- `frontend/src/features/auth/DeleteAccountModal.tsx` - New component
- `frontend/src/features/auth/TermsDialog.tsx` - Update content

---

## Terms/Privacy Update

Add section to Personvern:
```
## Sletting av konto
Du har rett til å slette kontoen din og alle tilhørende data når som helst.
Gå til "Min økonomi" og velg "Slett konto". All data vil bli permanent
fjernet innen 30 dager.
```
