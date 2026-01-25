# BUG: CORS Missing in Production - Facebook OAuth Fails

**Status**: Done ✅
**Created**: 2026-01-25
**Completed**: 2026-01-25
**Priority**: High (Blocks Facebook login in production)
**Labels**: backend, security, authentication

## Context & Motivation

Facebook OAuth login via EasyAuth works (`/.auth/me` returns user data), but subsequent API calls to the backend return 401 UNAUTHORIZED. This blocks all Facebook users from using the application in production.

## Resolution

**Code fix implemented successfully.**

Removed the environment condition that was preventing CORS middleware from running in production:

**Before:**
```typescript
if (config.nodeEnv === 'development' || config.nodeEnv === 'test') {
  app.use(cors({ ... }));
}
```

**After:**
```typescript
// CORS middleware - required because frontend and backend are different origins
// (finans.ettsted.no vs finans-backend.azurewebsites.net)
app.use(cors({ ... }));
```

**Files modified:**
- `backend/src/app.ts` - Removed environment condition around CORS middleware

**Build verification:**
- ✅ TypeScript compilation passed
- ✅ ESLint passed

## Acceptance Criteria

- [x] CORS middleware runs in all environments (dev, test, production)
- [x] `X-MS-CLIENT-PRINCIPAL` header allowed in CORS config
- [ ] Facebook login works end-to-end in production *(requires deployment)*
- [ ] Azure App Service CORS disabled *(manual user action)*
- [ ] Existing Google OAuth continues to work *(requires testing post-deployment)*

## User Action Required

Before deploying, you must disable CORS in Azure Portal:
1. Navigate to Azure Portal → finans-backend App Service
2. Go to CORS settings
3. Remove all allowed origins (leave empty)
4. Save

After deployment, verify:
1. Facebook login at `finans.ettsted.no`
2. Google login still works
3. Check DevTools Network for `X-MS-CLIENT-PRINCIPAL` header in requests

## Progress Log

- 2026-01-25 - Task moved to in-progress, starting implementation
- 2026-01-25 - CORS middleware condition removed from backend/src/app.ts, build and lint passed
- 2026-01-25 - Code fix complete, ready for deployment
