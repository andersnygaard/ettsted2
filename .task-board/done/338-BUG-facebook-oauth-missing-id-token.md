# BUG: Facebook OAuth fails due to missing id_token

**Status**: Backlog
**Created**: 2026-01-25
**Priority**: High
**Labels**: frontend, auth, bug
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

Facebook OAuth authentication fails silently. Users complete the Facebook login flow successfully, the EasyAuth session is created, but the frontend fails to recognize them as authenticated.

This blocks all Facebook users from using the application.

## Current State

The `fetchAuthToken()` function in `authToken.ts` requires `id_token` to be present in the EasyAuth response:

```typescript
// Line 187-191
if (!identity.id_token) {
  console.debug('EasyAuth: Missing id_token in response');
  return null;  // ← Returns null for Facebook users
}
```

**Provider differences:**
| Provider | Returns `id_token` | Returns `access_token` |
|----------|-------------------|------------------------|
| Google   | ✅ JWT            | ✅ Opaque              |
| Facebook | ❌ Not provided   | ✅ Opaque              |

The code was written assuming Google's response format.

## Desired Outcome

Facebook OAuth works identically to Google OAuth:
1. User clicks "Login with Facebook"
2. Completes Facebook OAuth flow
3. Redirected back to app
4. User is authenticated and sees dashboard

## Acceptance Criteria

- [x] Facebook login successfully authenticates users
- [x] Google login continues to work (no regression)
- [x] Console shows `EasyAuth: Token fetched successfully (provider: facebook)`
- [x] Demo login continues to work
- [x] TypeScript compiles without errors

## Affected Components

### Frontend
- **File**: `frontend/src/shared/api/authToken.ts`
- **Function**: `fetchAuthToken()` (lines 159-242)
- **Interface**: `EasyAuthIdentity` (lines 29-36)

### Backend
- No changes needed - backend already handles EasyAuth headers from Azure

## Technical Approach

### Architecture Decisions

Use `access_token` as fallback when `id_token` is not available. Both tokens work for Bearer authentication when requests go through Azure EasyAuth (Azure adds the `x-ms-client-principal` header).

### Implementation Steps

1. **Update interface** - Make `id_token` optional:
   ```typescript
   interface EasyAuthIdentity {
     access_token: string;
     expires_on: string;
     id_token?: string;  // Optional - Google provides, Facebook doesn't
     provider_name: string;
     user_claims: EasyAuthClaim[];
     user_id: string;
   }
   ```

2. **Update validation logic** - Fall back to `access_token`:
   ```typescript
   // Replace lines 187-191
   const token = identity.id_token || identity.access_token;

   if (!token) {
     console.debug('EasyAuth: No token available in response');
     return null;
   }
   ```

3. **Update token extraction** - Use the selected token:
   ```typescript
   // Replace lines 221-224
   const rawToken = token.startsWith('Bearer ') ? token.slice(7) : token;
   ```

### Dependencies

- None - this is a self-contained fix

### Risks & Considerations

- **Risk**: Breaking Google login
  - **Mitigation**: Google still provides `id_token`, so `identity.id_token || identity.access_token` will use `id_token` for Google
- **Risk**: Backend rejects Facebook tokens
  - **Mitigation**: Backend validates via EasyAuth headers (`x-ms-client-principal`), not the Bearer token itself. Azure adds these headers regardless of provider.

## Code References

### Current Code (authToken.ts:187-191)
```typescript
// Validate id_token exists (JWT for Bearer auth)
if (!identity.id_token) {
  console.debug('EasyAuth: Missing id_token in response');
  return null;
}
```

### Facebook /.auth/me Response
```json
[{
  "access_token": "EAATHUDUZCQT44BQ...",
  "expires_on": "2026-03-26T18:11:48.09037342",
  "provider_name": "facebook",
  "user_claims": [
    {"typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier", "val": "10173187459635241"},
    {"typ": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name", "val": "Anders Nygaard"}
  ],
  "user_id": "Anders Nygaard"
}]
```

Note: No `id_token` field present.

## Verification

1. Clear browser cookies for `finans.ettsted.no`
2. Visit `https://finans.ettsted.no`
3. Click "Login with Facebook"
4. Complete OAuth flow
5. Verify console shows: `EasyAuth: Token fetched successfully (provider: facebook)`
6. Verify user sees dashboard (not login page)
7. Repeat steps 1-6 with Google to confirm no regression

## Related Plans

- None

---

**Next Steps**: Ready for implementation. Move to `.task-board/in-progress/` when starting work.
