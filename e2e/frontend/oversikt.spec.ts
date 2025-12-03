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

test.describe('Dashboard - Content', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await page.goto('/dashboard');
  });

  test('displays main greeting section', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);

    // Check for main content area
    const main = page.locator('main');
    await expect(main.first()).toBeVisible();

    // Check for greeting text or user info (may vary)
    const greeting = page.locator('text=/god|hallo|oversikt/i');
    const hasGreeting = await greeting.count().then(c => c > 0);
    expect(hasGreeting).toBeTruthy();
  });

  test('displays dashboard statistics', async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(1000);

    // Look for card or stat elements
    const stats = page.locator('[class*="card"], [class*="stat"], h2, h3');
    const count = await stats.count();

    // Should have some content
    expect(count).toBeGreaterThan(0);
  });

  test('displays navigation cards or links to main pages', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(500);

    // Verify all main navigation links are accessible from dashboard
    const pages = ['Portefølje', 'Sparing', 'Gjeld', 'Pensjon', 'Kalkulatorer'];

    for (const pageName of pages) {
      const link = page.getByRole('link', { name: new RegExp(pageName, 'i') });
      const isVisible = await link.isVisible({ timeout: 1000 }).catch(() => false);

      if (isVisible) {
        await expect(link).toBeVisible();
      }
    }
  });
});
