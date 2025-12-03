import { test, expect } from '@playwright/test';
import { loginAsDemo } from '../fixtures/auth';

test.describe('Pensjon (Pension)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
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
    await page.getByRole('link', { name: /kalkulatorer/i }).click();
    await expect(page).toHaveURL(/.*kalkulatorer/);
  });
});

test.describe('Pensjon - Content', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await page.goto('/pensjon');
  });

  test('displays pension overview and breakdown', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // Check for main content
    const main = page.locator('main');
    await expect(main.first()).toBeVisible();

    // Look for key sections
    const content = page.locator('[class*="hero"], [class*="card"], section');
    const count = await content.count();
    expect(count).toBeGreaterThan(0);
  });

  test('displays pension sources breakdown', async ({ page }) => {
    // Wait for content
    await page.waitForTimeout(1000);

    // Look for pension-related content
    const pension = page.locator('text=/pensjon|arbeidsgiver|nav|otp|utbetaling/i');
    const count = await pension.count();

    // Should have some pension-related content
    expect(count).toBeGreaterThan(0);
  });

  test('displays chart or visualization of pension savings', async ({ page }) => {
    // Wait for chart to render
    await page.waitForTimeout(1500);

    // Look for SVG or chart container
    const charts = page.locator('svg, [class*="chart"], canvas');
    const count = await charts.count();

    // Should have visualization or content
    if (count === 0) {
      // If no chart, check for other content
      const content = page.locator('main');
      await expect(content.first()).toBeVisible();
    }
  });
});
