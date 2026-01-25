# 336 - TEST: E2E Tests for Protected Route Redirects

**Status**: Done
**Created**: 2025-12-30
**Priority**: Medium
**Labels**: test, e2e, auth, security
**Completed**: 2026-01-25

## Context & Motivation

Current E2E tests only verify authenticated users can access pages. There are NO tests verifying that:
1. Unauthenticated users are redirected to home page when accessing protected routes
2. The login flow then redirects back to the intended page (return URL)

This is a security-relevant behavior that should be regression-tested.

## Current State

```typescript
// sanity.spec.ts - only tests authenticated access
test('visit all pages after login', async ({ page }) => {
  // Auth pre-loaded from global setup - just navigate
  for (const { path, name } of ALL_PAGES) {
    await page.goto(path);
    // ... tests that page loads
```

No test for: "What happens if I go to /portefolje while logged out?"

## Desired Outcome

E2E tests that verify the ProtectedRoute component redirects unauthenticated users correctly.

## Acceptance Criteria

- [x] Test: Unauthenticated user accessing /oversikt is redirected to /
- [x] Test: Unauthenticated user accessing /portefolje is redirected to /
- [x] Test: Unauthenticated user accessing /kalkulatorer is redirected to /
- [ ] Test: After login, user returns to intended page (optional, depends on implementation)

## Technical Approach

### 1. Create Auth Redirect Tests

Add to `sanity.spec.ts` or create new file:

```typescript
test.describe('Protected Route Redirects', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure logged out state
    await clearAuthState(page);
  });

  test('unauthenticated access to /oversikt redirects to home', async ({ page }) => {
    await page.goto('/oversikt');

    // Should be redirected to home page
    await expect(page).toHaveURL('/');

    // Should see login button
    await expect(page.getByRole('button', { name: /logg inn/i })).toBeVisible();
  });

  test('unauthenticated access to protected pages redirects', async ({ page }) => {
    const protectedPaths = ['/oversikt', '/portefolje', '/sparing', '/gjeld', '/pensjon', '/kalkulatorer'];

    for (const path of protectedPaths) {
      await page.goto(path);
      await expect(page).toHaveURL('/');
    }
  });

  test('home page is accessible when logged out', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.getByText('Ta kontroll over')).toBeVisible();
  });
});
```

### 2. Verify ProtectedRoute Implementation

Check that `ProtectedRoute.tsx` uses `Navigate to="/"` for unauthenticated users.

## Files to Change

- `e2e/tests/sanity.spec.ts` - Add protected route redirect tests

## Testing Strategy

```bash
pnpm --filter e2e test -- sanity
```

## Edge Cases

- Consider testing rate-limit behavior on auth redirects
- Consider testing deep-linked protected routes

---

## Resolution

Added E2E tests for protected route redirects to `sanity.spec.ts`.

**Tests added** (4 tests total):
1. `unauthenticated access to /oversikt redirects to /`
2. `unauthenticated access to /portefolje redirects to /`
3. `unauthenticated access to /kalkulatorer redirects to /`
4. `home page is accessible when logged out`

**Implementation details**:
- All tests use `clearAuthState(page)` in `beforeEach` to ensure logged-out state
- Tests verify both URL redirect and presence of login button
- Follows existing patterns from fixtures.ts

**Files changed**:
- `e2e/tests/sanity.spec.ts` - Added "Protected Route Redirects" describe block

---

**Dependencies**: None
