# FEATURE: Playwright E2E Tests

**Status**: Backlog
**Created**: 2025-11-28
**Priority**: Medium
**Labels**: testing, e2e, playwright, quality
**Estimated Effort**: Complex - 3-4 days

## Context & Motivation

E2E tests ensure critical user flows work end-to-end. Playwright tests should cover authentication, portfolio management, and calculators.

## Desired Outcome

Playwright tests for:
- Login flow (Google/Facebook OAuth mock)
- User onboarding (username setup)
- Create/edit/delete snapshot
- View dashboard and charts
- Run compound interest calculator
- Run Monte Carlo simulator

## Acceptance Criteria

- [ ] Playwright installed and configured
- [ ] Page Object Model pattern implemented
- [ ] Authentication flow test (mock EasyAuth)
- [ ] Portfolio management test (CRUD snapshots)
- [ ] Calculator tests (compound + Monte Carlo)
- [ ] Tests run in CI pipeline
- [ ] All tests passing

## Technical Approach

**Page Objects**:
```typescript
// e2e/pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async loginWithGoogle() {
    await this.page.click('[data-testid="login-google"]');
  }
}

// e2e/pages/DashboardPage.ts
export class DashboardPage {
  async getNetWorth() {
    return this.page.locator('[data-testid="net-worth"]').textContent();
  }
}
```

**Test Example**:
```typescript
test('user can create snapshot', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  const addSnapshotPage = new AddSnapshotPage(page);

  await loginPage.loginWithGoogle();
  await dashboardPage.clickAddSnapshot();
  await addSnapshotPage.fillSnapshot({ date: '01.01.2024', accounts: [...] });
  await addSnapshotPage.submit();

  await expect(page).toHaveURL('/dashboard');
  await expect(dashboardPage.getSnapshotCount()).toBeGreaterThan(0);
});
```

## Dependencies

- All frontend features implemented
- Backend API endpoints working

---

**Next Steps**: Ready after core features implemented.
