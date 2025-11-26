# Feature: Public Calculators

**Status**: Done
**Created**: 2025-11-23
**Priority**: Medium
**Labels**: frontend, navigation, auth
**Reporter**: User

## Problem Statement

Calculators are currently behind ProtectedRoute, requiring authentication. All calculators should be publicly accessible with identical features for both authenticated and unauthenticated users.

## Acceptance Criteria

- [x] "Kalkulatorer" menu item visible for all users (logged in and not)
- [x] All calculator routes accessible without authentication
- [x] Same features available regardless of auth state
- [x] Applies to all existing and future calculators

## Affected Components

### Frontend
- **Modify**: `src/App.tsx` - Remove ProtectedRoute from calculator routes
- **Modify**: Navigation/header - Show "Kalkulatorer" for all users

## Architecture Context

**Current Flow**:
- Calculator routes wrapped in ProtectedRoute
- Only authenticated users can access calculators

**New Flow**:
- Calculator routes are public
- Menu shows "Kalkulatorer" for everyone
- No feature differences between auth states

## Code References

### Current Protected Route
```tsx
// File: src/App.tsx
<Route path="/calculator" element={<ProtectedRoute element={<CalculatorPage />} />} />
```

---

**Next Steps**: Ready for implementation.
