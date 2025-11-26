# Feature: Public Home Page

**Status**: Board
**Created**: 2025-11-23
**Priority**: Medium
**Labels**: frontend, routing, landing-page
**Reporter**: User

## Problem Statement

The app currently shows a login page at `/` for unauthenticated users. Need a proper marketing/landing home page that introduces the app before users log in.

## Acceptance Criteria

- [ ] `/home` route displays public home page
- [ ] `/` redirects to `/home` for unauthenticated users
- [ ] `/` redirects to `/dashboard` for authenticated users
- [ ] Header with: logo (left), "Om oss" menu item (center), login link (right)
- [ ] Norwegian marketing content in body
- [ ] Login link navigates to Azure EasyAuth login

## Proposed Layout

### Header
```
| Logo (placeholder) |     Om oss     | Logg inn |
|       LEFT         |     CENTER     |   RIGHT  |
```

### Body
- App description (Norwegian)
- Features list
- Benefits
- Call-to-action to log in

## Affected Components

### Frontend
- **New**: `src/features/home/HomePage.tsx` - Home page component
- **Modify**: `src/App.tsx` - Add `/home` route, update `/` redirect logic

## Architecture Context

**Current Flow**:
- `/` → LoginPage (checks auth, redirects to `/dashboard` if logged in)
- `/dashboard` → ProtectedRoute → DashboardPage
- `/calculator` → ProtectedRoute → CalculatorPage

**New Flow**:
- `/` → Redirect based on auth state
  - Unauthenticated → `/home`
  - Authenticated → `/dashboard`
- `/home` → HomePage (public, no auth required)
- `/dashboard` → ProtectedRoute → DashboardPage
- `/calculator` → ProtectedRoute → CalculatorPage

## Code References

### Current Route Setup
```tsx
// File: src/App.tsx
<Routes>
  <Route path="/" element={<LoginPage />} />
  <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
  <Route path="/calculator" element={<ProtectedRoute element={<CalculatorPage />} />} />
</Routes>
```

## Proposed Solution Direction

1. Create `HomePage.tsx` with:
   - Header component (logo, nav, login link)
   - Marketing content section
   - BeerCSS styling

2. Update `App.tsx`:
   - Add auth-aware redirect at `/`
   - Add `/home` route

3. Login link uses: `/.auth/login/google?post_login_redirect_uri=/dashboard`

**Estimated Complexity**: Simple

---

**Next Steps**: Ready for implementation.
