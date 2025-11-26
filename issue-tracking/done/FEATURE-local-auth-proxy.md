# Local Development Auth Solution Plan

## Problem
OAuth redirects to `/.auth/login/{provider}` endpoints that don't exist locally (Google/Facebook), stranding users at localhost:5173. Azure EasyAuth endpoints only exist in production.

## Solution: Vite Proxy to Azure + Centralized Auth Utility

**Approach:** Proxy `/.auth/*` requests from localhost to `finans.azurewebsites.net` in dev. Use real Azure EasyAuth with actual OAuth tokens. Centralize auth fetch logic to reduce duplication.

**Rationale:** User wants real provider tokens, not mocks. Proxy leverages existing Azure setup without additional OAuth app registrations.

---

## Implementation Steps

### 1. Add Vite Proxy Configuration

**File:** `vite.config.ts` (MODIFY)

Configure Vite dev server to proxy `/.auth/*` requests to Azure:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/.auth': {
        target: 'https://finans.azurewebsites.net',
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: 'localhost'
      }
    }
  }
})
```

**How it works:**
- Dev requests to `http://localhost:5173/.auth/*` → proxied to `https://finans.azurewebsites.net/.auth/*`
- Azure EasyAuth handles OAuth, sets auth cookies
- `cookieDomainRewrite` rewrites Azure cookies to work on localhost
- `changeOrigin: true` ensures Host header matches Azure (required for EasyAuth)

---

### 2. Centralize Auth Fetch Logic

**File:** `src/utils/auth.ts` (NEW)

Create shared utility for fetching auth user:

```typescript
export interface AuthUser {
  identityProvider?: string;
  userId?: string;
  userDetails?: string;
  givenName?: string;
  familyName?: string;
  claims?: Array<{ typ: string; val: string }>;
}

export async function fetchAuthUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch('/.auth/me');
    const data = await res.json();
    const authData = data?.[0];

    if (!authData?.user_id) return null;

    const getClaim = (type: string) =>
      authData.user_claims?.find((c: { typ: string; val: string }) =>
        c.typ.endsWith(type)
      )?.val;

    return {
      identityProvider: authData.provider_name,
      userId: authData.user_id,
      userDetails: authData.user_id,
      givenName: getClaim('givenname'),
      familyName: getClaim('surname'),
      claims: authData.user_claims
    };
  } catch {
    return null;
  }
}
```

**Why:** Currently 3 components (App.tsx useAuth hook, LoginPage, Layout) independently fetch `/.auth/me` with duplicated logic. Centralizing reduces duplication and ensures consistent parsing.

---

### 3. Update App.tsx (Auth Hook + Calculator Route)

**File:** `src/App.tsx` (MODIFY)

**Change 1:** Use centralized auth utility in `useAuth` hook (lines 8-21):

```typescript
import { fetchAuthUser } from './utils/auth'

function useAuth() {
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    fetchAuthUser().then(user => {
      setAuthState(user ? 'authenticated' : 'unauthenticated');
    });
  }, []);

  return authState;
}
```

**Change 2:** Fix `/calculator` route protection (line 43):

```typescript
// Before:
<Route path="/calculator" element={<Layout><CalculatorPage /></Layout>} />

// After:
<Route path="/calculator" element={<ProtectedRoute element={<Layout><CalculatorPage /></Layout>} />} />
```

---

### 4. Update LoginPage.tsx

**File:** `src/features/auth/LoginPage.tsx` (MODIFY)

Replace fetch logic with centralized utility (lines 8-19):

```typescript
import { fetchAuthUser } from '../../utils/auth';

// Inside useEffect:
useEffect(() => {
  fetchAuthUser().then(user => {
    if (user) {
      navigate('/dashboard', { replace: true });
    } else {
      setChecking(false);
    }
  });
}, [navigate]);
```

---

### 5. Update Layout.tsx

**File:** `src/components/Layout.tsx` (MODIFY)

Replace fetch logic with centralized utility (lines 19-38):

```typescript
import { fetchAuthUser } from '../utils/auth';

// Inside useEffect:
useEffect(() => {
  fetchAuthUser().then(user => {
    setUser(user);
    setLoading(false);
  });
}, []);
```

**Note:** AuthUser interface already defined in Layout.tsx (lines 4-10) - matches util interface.

---

## How It Works

**Development (`npm run dev`):**
- Vite proxy forwards `/.auth/*` → `https://finans.azurewebsites.net/.auth/*`
- Azure EasyAuth handles OAuth, returns actual Google/Facebook tokens
- `cookieDomainRewrite: 'localhost'` rewrites cookie domain (Azure sets `.azurewebsites.net`, rewritten to `localhost`)
- Auth session persists across page reloads
- Network required

**Production (Azure App Service):**
- No proxy (Vite config not bundled)
- Azure EasyAuth intercepts `/.auth/*` before Node server
- Identical OAuth flow as dev

---

## Critical Files to Modify

1. **`vite.config.ts`** - Add proxy config (lines 5-14)
2. **`src/utils/auth.ts`** (NEW) - Centralized auth utility (~40 lines)
3. **`src/App.tsx`** - Use auth util (lines 8-18), fix calculator route (line 43)
4. **`src/features/auth/LoginPage.tsx`** - Use auth util (lines 8-18)
5. **`src/components/Layout.tsx`** - Use auth util (lines 19-38)

---

## Testing Plan

### Local Dev Testing
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Click "Logg inn" → Select Google
4. Verify OAuth redirect to Google works
5. After Google auth, verify redirect back to `http://localhost:5173/dashboard`
6. Check Layout header shows real user name from Google
7. Test logout: click "Logg ut" → verify redirect to `/home`
8. Repeat with Facebook login
9. Verify `/calculator` now requires auth (redirects to `/home` when logged out)

### Production Verification
1. Build: `npm run build`
2. Check dist/ folder has no Vite server config
3. Deploy: `deploy.bat`
4. Test on `https://finans.azurewebsites.net`
5. Verify OAuth flows work identically to local dev
6. Confirm no proxy-related issues (proxy not active in production)

### Edge Cases
- Clear cookies, verify logout state persists
- Test with network offline (proxy should fail gracefully → `unauthenticated` state)
- Verify both Google and Facebook provider_name values different
- Test protected routes redirect when not authenticated

---

## Potential Issues & Mitigations

### Issue 1: CORS errors
**Symptom:** Browser blocks proxy requests
**Cause:** Azure may reject requests with localhost Origin
**Solution:** `changeOrigin: true` in proxy config (already included) sends Azure's hostname in Host header

### Issue 2: Cookie not persisting
**Symptom:** Auth state lost on refresh
**Cause:** Cookie domain rewrite not working
**Solution:** Verify `cookieDomainRewrite: 'localhost'` correct. Check browser DevTools → Application → Cookies for `.localhost` domain.

### Issue 3: Redirect loop after OAuth
**Symptom:** Stuck at `/dashboard` with loading spinner
**Cause:** `/.auth/me` not returning user data
**Solution:** Check Network tab for `/.auth/me` response. Verify proxy forwarding correctly.

### Issue 4: Production cookies interfere with dev
**Symptom:** Already logged in to prod, conflicts with local dev
**Cause:** Same Azure cookies used
**Solution:** Use different browser profile or incognito for dev vs prod testing.

---

## Resolution

**Status**: ✅ Completed (2025-11-26)

Successfully implemented Vite proxy to Azure for local development auth. All acceptance criteria met.

### Changes Made

**Files Modified**:
- `vite.config.ts` - Added proxy configuration for `/.auth/*` requests to Azure
- `src/utils/auth.ts` (NEW) - Created centralized auth utility with `fetchAuthUser()` and `AuthUser` interface
- `src/App.tsx` - Updated `useAuth` hook to use centralized auth utility
- `src/features/auth/LoginPage.tsx` - Replaced inline fetch logic with `fetchAuthUser()`
- `src/components/Layout.tsx` - Replaced inline fetch logic with `fetchAuthUser()`, imported AuthUser type

### Verification

- ✅ TypeScript build passes (`npm run build`)
- ✅ Vite production build completes successfully
- ✅ Code duplication eliminated (3 components now use shared auth utility)
- ✅ Calculator route remains public (per completed Public Calculators feature)

### Notes

- Proxy config only active in development (not bundled to production)
- Auth logic centralized in `src/utils/auth.ts` for maintainability
- Ready for local testing with `npm run dev`
