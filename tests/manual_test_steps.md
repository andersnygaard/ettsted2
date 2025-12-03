# Manual Test Steps: Authentication Flow

> Verification checklist for the Finans authentication flow fix.

---

## Prerequisites

1. Access to Azure portal for `finans-rg` resource group
2. Google account for OAuth testing
3. Browser with DevTools (Chrome/Firefox)
4. Terminal with `curl` installed

---

## Test Suite

### Test 1: Initial Page Load (Unauthenticated)

**Objective**: Verify unauthenticated users are handled gracefully.

**Steps**:
1. Clear all cookies for `finans-frontend.azurewebsites.net`
2. Open browser DevTools → Network tab
3. Navigate to `https://finans-frontend.azurewebsites.net/`
4. Observe network requests

**Expected Results**:
- [ ] `/.auth/me` returns 401 (user not logged in)
- [ ] `/api/v1/users/me` returns 401
- [ ] App shows login UI (not an error page)
- [ ] No console errors related to authentication

**Actual Results**: _________________

---

### Test 2: Google OAuth Login

**Objective**: Verify OAuth flow completes successfully.

**Steps**:
1. From the homepage, click "Logg inn"
2. Click "Google" in the login modal
3. Complete Google OAuth (select account, grant permission)
4. Observe redirect back to app

**Expected Results**:
- [ ] Redirect to Google consent page
- [ ] After consent, redirect back to frontend
- [ ] `/.auth/me` now returns 200 with user array
- [ ] User is shown as logged in (avatar visible in header)

**Network Trace** (copy from DevTools):
```
/.auth/me response status: ___
Provider in response: ___
```

---

### Test 3: API Call with Token

**Objective**: Verify API calls include authentication header.

**Steps**:
1. After login (Test 2), observe the `/api/v1/users/me` request
2. In DevTools Network tab, click on the request
3. Check Request Headers

**Expected Results**:
- [ ] Request includes `X-MS-CLIENT-PRINCIPAL` header
- [ ] Header value is base64-encoded JSON
- [ ] Response is 200 (or 404 for new users needing onboarding)

**Header Value** (first 20 chars): _________________

---

### Test 4: Backend Token Validation

**Objective**: Verify backend correctly decodes the token.

**Steps**:
1. Copy the `X-MS-CLIENT-PRINCIPAL` header value from Test 3
2. Decode it (base64 decode)
3. Verify the JSON structure

**Commands**:
```bash
# Decode the header
echo "<HEADER_VALUE>" | base64 -d | jq .
```

**Expected JSON Structure**:
```json
{
  "userId": "<nameidentifier claim>",
  "userDetails": "<email>",
  "identityProvider": "google",
  "userRoles": ["authenticated"]
}
```

**Actual Result**: _________________

---

### Test 5: curl Verification (Without Token)

**Objective**: Verify backend rejects unauthenticated requests.

**Command**:
```bash
curl -v https://finans-backend.azurewebsites.net/api/v1/users/me
```

**Expected Results**:
- [ ] HTTP Status: 401
- [ ] Response body contains `"code": "UNAUTHORIZED"`

**Actual Status**: ___

---

### Test 6: curl Verification (With Token)

**Objective**: Verify backend accepts authenticated requests.

**Steps**:
1. Get your token from Test 3/4
2. Run curl with the token

**Command**:
```bash
TOKEN="<YOUR_BASE64_TOKEN>"
curl -v -H "X-MS-CLIENT-PRINCIPAL: $TOKEN" \
  https://finans-backend.azurewebsites.net/api/v1/users/me
```

**Expected Results**:
- [ ] HTTP Status: 200 (existing user) or 404 (new user)
- [ ] Response body contains user data or "User not found"

**Actual Status**: ___

---

### Test 7: Token Caching

**Objective**: Verify token is cached and not re-fetched unnecessarily.

**Steps**:
1. After login, open Console in DevTools
2. Navigate between pages (Dashboard, Portfolio, etc.)
3. Observe console logs and network requests

**Expected Results**:
- [ ] `/.auth/me` is NOT called on every navigation
- [ ] Console shows "EasyAuth: Token fetched successfully" only once
- [ ] Subsequent API calls use cached token

---

### Test 8: Logout Flow

**Objective**: Verify logout clears authentication state.

**Steps**:
1. Click avatar → "Logg ut"
2. Observe redirect

**Expected Results**:
- [ ] Redirected to `/.auth/logout`
- [ ] Then redirected to homepage
- [ ] User shown as logged out
- [ ] Subsequent API calls fail with 401

---

## Acceptance Criteria Summary

| Test | Pass/Fail | Notes |
|------|-----------|-------|
| Test 1: Unauthenticated | | |
| Test 2: OAuth Login | | |
| Test 3: API with Token | | |
| Test 4: Token Structure | | |
| Test 5: curl without Token | | |
| Test 6: curl with Token | | |
| Test 7: Token Caching | | |
| Test 8: Logout | | |

**Overall Result**: ____________

**Tested By**: ____________

**Date**: ____________

---

## Troubleshooting

### Issue: /.auth/me returns empty array

**Cause**: EasyAuth cookies not set properly
**Solution**: Clear all cookies, try login again

### Issue: API still returns 401 after login

**Cause**: Token not being attached to requests
**Debug**:
1. Check browser console for errors
2. Verify `X-MS-CLIENT-PRINCIPAL` header in DevTools
3. Check if `isDevelopment` flag is incorrectly set

### Issue: Token decoding fails on backend

**Cause**: Malformed base64 or JSON
**Debug**:
1. Decode token manually: `echo "<token>" | base64 -d`
2. Check for valid JSON structure
3. Verify required fields: `userId`, `identityProvider`

---

## Related Documentation

- [Auth Flow Review](.docs/auth-flow-review.md)
- [Azure EasyAuth Documentation](https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization)
