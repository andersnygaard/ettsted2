import { test, expect } from '@playwright/test';
import { mockAuthenticatedUser } from '../fixtures/auth';

test.describe('Gjeld (Debt)', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedUser(page);
  });

  test('page loads successfully', async ({ page }) => {
    await page.goto('/gjeld');
    await expect(page).toHaveURL(/.*gjeld/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('shows navigation header', async ({ page }) => {
    await page.goto('/gjeld');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('can navigate to other tabs', async ({ page }) => {
    await page.goto('/gjeld');
    await page.click('nav >> text=Pensjon');
    await expect(page).toHaveURL(/.*pensjon/);
  });
});
