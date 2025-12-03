import { test, expect } from '@playwright/test';
import { loginAsDemo } from '../fixtures/auth';

test.describe('Oversikt (Dashboard)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('shows navigation header', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
  });

  test('can navigate to other tabs', async ({ page }) => {
    await page.getByRole('link', { name: /portefølje/i }).click();
    await expect(page).toHaveURL(/.*portfolio/);
  });
});
