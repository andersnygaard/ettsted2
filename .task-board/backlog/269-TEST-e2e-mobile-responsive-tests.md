# 269 - TEST: E2E mobile responsive tests

## Priority
Low

## Type
Testing

## Description
Add Playwright E2E tests for mobile responsive layouts on key pages (Import, Portfolio, Dashboard). Verify no horizontal scroll and touch targets are accessible.

## User Story
As a developer, I want automated tests for mobile layouts so that responsive regressions are caught in CI before deployment.

## Acceptance Criteria
- [ ] Mobile viewport test suite created (360px, 640px, 768px)
- [ ] Import page chatbot layout tested on mobile
- [ ] Portfolio page tested on mobile (card view when implemented)
- [ ] Dashboard page tested on mobile
- [ ] Mobile menu navigation tested
- [ ] No horizontal scroll detected on any page
- [ ] Touch target size validation (minimum 44px)
- [ ] Tests run in CI pipeline

## Files to Create
- `e2e/tests/mobile-responsive.spec.ts`
- `e2e/fixtures/mobile-viewports.ts`

## Technical Notes
Example test structure:
```typescript
test.describe('Mobile Responsive', () => {
  test.use({ viewport: { width: 360, height: 640 } });

  test('Import page - no horizontal scroll', async ({ page }) => {
    await page.goto('/import');
    const body = await page.locator('body');
    const scrollWidth = await body.evaluate(el => el.scrollWidth);
    const clientWidth = await body.evaluate(el => el.clientWidth);
    expect(scrollWidth).toBe(clientWidth);
  });

  test('Mobile menu - touch targets', async ({ page }) => {
    await page.goto('/oversikt');
    await page.click('[aria-label="Åpne meny"]');
    const navItems = page.locator('.app-header__mobile-nav-item');
    const count = await navItems.count();
    for (let i = 0; i < count; i++) {
      const box = await navItems.nth(i).boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
    }
  });
});
```

## Testing
- Run tests locally with `pnpm test:e2e`
- Verify tests pass on different viewports
- Check CI passes with mobile tests
