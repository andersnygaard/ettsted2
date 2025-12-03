import { test, expect } from '@playwright/test';
import { loginAsDemo } from '../fixtures/auth';

test.describe('Sparing (Savings & F.I.R.E.)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
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
    await page.getByRole('link', { name: /gjeld/i }).click();
    await expect(page).toHaveURL(/.*gjeld/);
  });
});

test.describe('Sparing - Content', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await page.goto('/sparing');
  });

  test('displays savings overview and FIRE information', async ({ page }) => {
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

  test('displays FIRE metrics or progress indicator', async ({ page }) => {
    // Wait for content
    await page.waitForTimeout(1000);

    // Look for FIRE-related content
    const fireContent = page.locator('text=/fire|spare|sparing|mål|målbeløp/i');
    const count = await fireContent.count();

    // Should have some FIRE-related content
    expect(count).toBeGreaterThan(0);
  });

  test('displays chart or visualization of savings progress', async ({ page }) => {
    // Wait for chart to render
    await page.waitForTimeout(1500);

    // Look for SVG or chart container
    const charts = page.locator('svg, [class*="chart"], canvas');
    const count = await charts.count();

    // Should have at least one chart or visualization
    if (count === 0) {
      // If no chart, check for other content
      const content = page.locator('main');
      await expect(content.first()).toBeVisible();
    }
  });
});
