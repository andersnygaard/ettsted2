# Auth Rules

## Stack
Demo login via backend API, localStorage tokens

## Patterns

### Login Flow
```typescript
await login(page);
// 1. Clears DEV_LOGOUT flag
// 2. Checks if already logged in (dev mode auto-login)
// 3. If not, clicks "Logg inn" → "Prøv demo"
// 4. Waits for /oversikt redirect
```

### Logout Flow
```typescript
await logout(page);
// Sets DEV_LOGOUT flag, clears token, navigates to /
```

### Auth State Reset
```typescript
test.beforeEach(async ({ page }) => {
  await clearAuthState(page);  // Always start logged out
});
```

### Storage Keys
```typescript
DEMO_TOKEN: 'finans_demo_token'   // JWT from demo login
DEV_LOGOUT: 'finans_dev_logout'   // Forces logged-out state
```

## Gotchas
- **Demo seeding time**: Demo login seeds 12 months of data. Use 60s timeout on `/oversikt` redirect.
- **Auth/callback redirect**: After demo login, may redirect to `/auth/callback` first, then `/oversikt`.
- **Rate limiting**: 5 demo logins per 15 min per IP. Space out test runs or use different IPs.
- **Dev mode**: In development, removing `DEV_LOGOUT` flag auto-logs in via DevAuthProvider.
