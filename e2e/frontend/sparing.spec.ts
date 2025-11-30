import { test, expect } from '@playwright/test';
import { mockAuthenticatedUser } from '../fixtures/auth';

test.describe('Sparing (Savings & F.I.R.E.)', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('page loads successfully', async ({ page }) => {
    await page.goto('/sparing');
    await expect(page).toHaveURL(/.*sparing/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('shows navigation header', async ({ page }) => {
    await page.goto('/sparing');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('can navigate to other tabs', async ({ page }) => {
    await page.goto('/sparing');
    await page.click('nav >> text=Gjeld');
    await expect(page).toHaveURL(/.*gjeld/);
  });
});
