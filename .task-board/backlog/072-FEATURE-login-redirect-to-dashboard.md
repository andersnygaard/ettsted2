# FEATURE: Login Redirect to Dashboard

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: frontend, auth, navigation
**Estimated Effort**: Simple - 15 minutes

## Context & Motivation

Users expect to land on the dashboard after logging in, not the home page. The dashboard is the main working area for authenticated users, while the home page serves as a landing/marketing page.

## Current State

- **Logo click**: Links to `/` (HomePage) ✅ Already correct
- **After login**: EasyAuth redirects to wherever user came from or root `/`
- **Login page**: Does not redirect authenticated users away

## Desired Outcome

1. After successful login → User lands on `/dashboard`
2. Logo click → User lands on `/` (home page) - already working
3. Authenticated user visiting `/login` → Redirected to `/dashboard`

## Acceptance Criteria

- [ ] After Google login, user lands on `/dashboard`
- [ ] After Facebook login, user lands on `/dashboard`
- [ ] Authenticated user visiting `/login` is redirected to `/dashboard`
- [ ] Logo still navigates to `/` (home page)

## Affected Components

### Frontend
- **File**: `frontend/src/features/auth/LoginPage.tsx`
- **File**: `frontend/src/features/auth/AuthContext.tsx` (login function)

## Technical Approach

### Implementation Steps

1. **Update LoginPage.tsx**
   - Import `Navigate` from react-router-dom and `useAuth` hook
   - Add redirect for authenticated users to `/dashboard`
   - Add `post_login_redirect_uri=/dashboard` query param to EasyAuth URLs

2. **Update AuthContext.tsx**
   - Update `login` function to include redirect parameter

### Code Changes

**LoginPage.tsx** - Add auth check and redirect param:
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect authenticated users to dashboard
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = () => {
    window.location.href = '/.auth/login/google?post_login_redirect_uri=/dashboard';
  };

  const handleFacebookLogin = () => {
    window.location.href = '/.auth/login/facebook?post_login_redirect_uri=/dashboard';
  };
  // ... rest unchanged
}
```

**AuthContext.tsx** - Update login function:
```typescript
const login = (provider: 'google' | 'facebook') => {
  window.location.href = `/.auth/login/${provider}?post_login_redirect_uri=/dashboard`;
};
```

## Code References

### Current LoginPage.tsx (lines 1-8)
```typescript
export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = '/.auth/login/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = '/.auth/login/facebook';
  };
```

### Current AuthContext.tsx login function (lines 58-60)
```typescript
const login = (provider: 'google' | 'facebook') => {
  window.location.href = `/.auth/login/${provider}`;
};
```

## Risks & Considerations

- **Risk**: EasyAuth might not support `post_login_redirect_uri` param
  - **Mitigation**: Test locally; fallback is to handle redirect in AuthContext after auth check
- **Risk**: Redirect loop if dashboard also redirects unauthenticated users
  - **Mitigation**: ProtectedRoute redirects to `/login`, not `/`, so no loop

## Verification

- [ ] Log out and log in with Google → lands on `/dashboard`
- [ ] Log out and log in with Facebook → lands on `/dashboard`
- [ ] While logged in, navigate to `/login` → redirects to `/dashboard`
- [ ] Click logo → navigates to `/` (home page)

---

**Next Steps**: Ready for implementation. Move to `.task-board/in-progress/` when starting work.
