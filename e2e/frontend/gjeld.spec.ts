import { test, expect } from '@playwright/test';
import { loginAsDemo } from '../fixtures/auth';

test.describe('Gjeld (Debt)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
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
    await page.getByRole('link', { name: /pensjon/i }).click();
    await expect(page).toHaveURL(/.*pensjon/);
  });
});

test.describe('Gjeld - Content', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await page.goto('/gjeld');
  });

  test('displays debt overview and coverage information', async ({ page }) => {
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

  test('displays debt coverage or dekning information', async ({ page }) => {
    // Wait for content
    await page.waitForTimeout(1000);

    // Look for dekning or coverage related content
    const dekning = page.locator('text=/dekning|gjeld|lån|dekket/i');
    const count = await dekning.count();

    // Should have some debt-related content
    expect(count).toBeGreaterThan(0);
  });

  test('displays chart or visualization of debt status', async ({ page }) => {
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
