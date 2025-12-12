# Auth Rules

## Stack
React Context, Azure EasyAuth (Google/Facebook OAuth), Demo JWT

## Structure
- `/features/auth/AuthContext.tsx` - Provider with user state, login/logout methods
- `/features/auth/useAuth.ts` - Hook re-export for consuming auth state
- `/features/auth/ProtectedRoute.tsx` - Route guard redirecting unauthenticated users
- `/features/auth/OnboardingRoute.tsx` - Route guard for users needing setup
- `/features/auth/types.ts` - User, AuthContextType interfaces
- `/shared/api/authToken.ts` - Token storage, EasyAuth fetch, demo session helpers

## Patterns

### Auth State Shape
```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;    // user !== null
  hasEasyAuthSession: boolean; // Has OAuth session but maybe no DB user
  needsOnboarding: boolean;    // OAuth OK but user not in DB
  login: (provider: 'google' | 'facebook') => void;
  demoLogin: (profile?: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
```

### Demo Login Flow
1. `POST /auth/demo-login` → returns JWT token
2. Store token via `setDemoToken()` in localStorage
3. All subsequent requests include `Authorization: Bearer <token>`
4. Demo works in all environments including production

### OAuth Login Flow (Production)
1. Redirect to `/.auth/login/{provider}`
2. EasyAuth handles OAuth dance
3. Backend validates `x-ms-client-principal` header
4. On success, fetch `/users/me` to get user data

### Route Guards
```tsx
// Protected pages - require authenticated user
<ProtectedRoute>
  <SomePage />
</ProtectedRoute>

// Onboarding route - require session but NO user record
<OnboardingRoute>
  <OnboardingPage />
</OnboardingRoute>
```

## Decisions
- Demo login available in all envs for testing/demos
- `hasEasyAuthSession` vs `isAuthenticated` distinction allows onboarding flow
- Token cached in localStorage with 5min TTL to avoid /.auth/me calls

## Gotchas
- **Dev mode logout**: Set `devLoggedOut` flag so dev auto-login respects logout
- **404 from /users/me**: Means authenticated but needs onboarding (not an error)
- **401 clears everything**: Axios interceptor lets it through, AuthContext handles it
- **refreshUser after mutations**: Call `refreshUser()` after onboarding or profile updates
