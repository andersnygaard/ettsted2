import { test, expect } from '@playwright/test';
import { mockAuthenticatedUser } from '../fixtures/auth';

test.describe('Oversikt (Dashboard)', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('page loads successfully', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('shows navigation header', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('can navigate to other tabs', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('nav >> text=Portefølje');
    await expect(page).toHaveURL(/.*portfolio/);
  });
});
