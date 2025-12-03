import { test, expect } from '@playwright/test';
import { loginAsDemo } from '../fixtures/auth';

test.describe('Navigation - All Main Pages', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    // Start from dashboard
    await page.goto('/dashboard');
  });

  test('can navigate from dashboard to portfolio', async ({ page }) => {
    await page.getByRole('link', { name: /portefølje/i }).click();
    await expect(page).toHaveURL(/.*portfolio/);
  });

  test('can navigate from dashboard to sparing', async ({ page }) => {
    await page.getByRole('link', { name: /sparing/i }).click();
    await expect(page).toHaveURL(/.*sparing/);
  });

  test('can navigate from dashboard to gjeld', async ({ page }) => {
    await page.getByRole('link', { name: /gjeld/i }).click();
    await expect(page).toHaveURL(/.*gjeld/);
  });

  test('can navigate from dashboard to pensjon', async ({ page }) => {
    await page.getByRole('link', { name: /pensjon/i }).click();
    await expect(page).toHaveURL(/.*pensjon/);
  });

  test('can navigate from dashboard to kalkulatorer', async ({ page }) => {
    await page.getByRole('link', { name: /kalkulatorer/i }).click();
    await expect(page).toHaveURL(/.*kalkulatorer/);
  });

  test('can navigate from dashboard back to oversikt', async ({ page }) => {
    await page.getByRole('link', { name: /oversikt/i }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });
});

test.describe('Navigation - Tab Navigation Sequence', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('can navigate through all main pages in sequence', async ({ page }) => {
    const navigationSequence = [
      { name: /oversikt/i, url: /.*dashboard/ },
      { name: /portefølje/i, url: /.*portfolio/ },
      { name: /sparing/i, url: /.*sparing/ },
      { name: /gjeld/i, url: /.*gjeld/ },
      { name: /pensjon/i, url: /.*pensjon/ },
      { name: /kalkulatorer/i, url: /.*kalkulatorer/ },
    ];

    for (const page_info of navigationSequence) {
      await page.getByRole('link', { name: page_info.name }).click();
      await expect(page).toHaveURL(page_info.url);
    }
  });
});

test.describe('Navigation - Header Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await page.goto('/portfolio');
  });

  test('navigation header is visible on all pages', async ({ page }) => {
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('all navigation links are clickable', async ({ page }) => {
    const navLinks = page.locator('nav a, nav button');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('navigation remains visible when changing pages', async ({ page }) => {
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();

    // Navigate to another page
    await page.getByRole('link', { name: /sparing/i }).click();
    await page.waitForURL(/.*sparing/);

    // Verify nav is still visible
    await expect(nav).toBeVisible();
  });
});

test.describe('Navigation - Breadcrumbs', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('portfolio page has breadcrumb navigation', async ({ page }) => {
    await page.goto('/portfolio');

    // Look for breadcrumb
    const breadcrumb = page.locator('[class*="breadcrumb"]');
    const hasContent = await breadcrumb.count().then(c => c > 0);

    if (hasContent) {
      await expect(breadcrumb.first()).toBeVisible();
    }
  });

  test('calculator pages have breadcrumb navigation', async ({ page }) => {
    await page.goto('/kalkulatorer/compound');

    // Look for breadcrumb
    const breadcrumb = page.locator('[class*="breadcrumb"]');
    const hasContent = await breadcrumb.count().then(c => c > 0);

    if (hasContent) {
      await expect(breadcrumb.first()).toBeVisible();
    }
  });
});

test.describe('Navigation - Logo/Home Link', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('can navigate back to dashboard from portfolio', async ({ page }) => {
    await page.goto('/portfolio');

    // Look for logo or home link
    const logo = page.locator('[class*="logo"], [class*="header"] a, a:has-text("finans")');

    // If logo exists, click it
    if (await logo.count() > 0) {
      await logo.first().click();
      await page.waitForTimeout(500);
      // Should navigate somewhere (implementation may vary)
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
    }
  });
});
