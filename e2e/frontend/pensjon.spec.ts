import { test, expect } from '@playwright/test';
import { mockAuthenticatedUser } from '../fixtures/auth';

test.describe('Pensjon (Pension)', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('page loads successfully', async ({ page }) => {
    await page.goto('/pensjon');
    await expect(page).toHaveURL(/.*pensjon/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('shows navigation header', async ({ page }) => {
    await page.goto('/pensjon');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('can navigate to other tabs', async ({ page }) => {
    await page.goto('/pensjon');
    await page.click('nav >> text=Kalkulatorer');
    await expect(page).toHaveURL(/.*kalkulatorer/);
  });
});
