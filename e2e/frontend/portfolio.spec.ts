import { test, expect } from '@playwright/test';
import { loginAsDemo } from '../fixtures/auth';

test.describe('Portefølje (Portfolio)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('page loads successfully', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page).toHaveURL(/.*portfolio/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('shows navigation header', async ({ page }) => {
    await page.goto('/portfolio');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('can navigate to other tabs', async ({ page }) => {
    await page.goto('/portfolio');
    await page.getByRole('link', { name: /sparing/i }).click();
    await expect(page).toHaveURL(/.*sparing/);
  });
});
