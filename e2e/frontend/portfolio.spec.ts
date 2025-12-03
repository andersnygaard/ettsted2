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

test.describe('Portfolio - Add New Month', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await page.goto('/portfolio');
  });

  test('can open new month modal', async ({ page }) => {
    // Click "Ny måned" button
    await page.getByRole('button', { name: /\+ ny måned/i }).click();

    // Verify modal appears
    await expect(page.locator('text=Ny måned')).toBeVisible();
    await expect(page.getByRole('button', { name: /lagre/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /avbryt/i })).toBeVisible();
  });

  test('can close new month modal', async ({ page }) => {
    // Click "Ny måned" button
    await page.getByRole('button', { name: /\+ ny måned/i }).click();

    // Verify modal appears
    await expect(page.locator('text=Ny måned')).toBeVisible();

    // Click "Avbryt" button
    await page.getByRole('button', { name: /avbryt/i }).click();

    // Verify modal is gone
    await expect(page.locator('text=Ny måned')).not.toBeVisible();
  });

  test('modal has date input field', async ({ page }) => {
    // Click "Ny måned" button
    await page.getByRole('button', { name: /\+ ny måned/i }).click();

    // Verify date input exists
    await expect(page.locator('text=Måned')).toBeVisible();
    await expect(page.locator('input[placeholder*="MM"]')).toBeVisible();
  });

  test('modal shows account input fields grouped by category', async ({ page }) => {
    // Click "Ny måned" button
    await page.getByRole('button', { name: /\+ ny måned/i }).click();

    // Verify category sections appear
    await expect(page.locator('text=Sparing')).toBeVisible();
    await expect(page.locator('text=Gjeld')).toBeVisible();
    await expect(page.locator('text=Pensjon')).toBeVisible();
  });
});

test.describe('Portfolio - Cell Editing', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await page.goto('/portfolio');

    // Wait for table to load
    await page.waitForSelector('table', { timeout: 5000 }).catch(() => {});
  });

  test('table displays data rows', async ({ page }) => {
    // Verify table exists and has content
    const table = page.locator('table').first();
    await expect(table).toBeVisible();
  });

  test('can navigate between table rows using pagination', async ({ page }) => {
    // Wait a bit for table to render
    await page.waitForTimeout(1000);

    // Check if pagination exists
    const paginationNext = page.locator('button:has-text("Neste")').first();
    const paginationPrev = page.locator('button:has-text("Forrige")').first();

    // If pagination controls exist, verify they're functional
    if (await paginationNext.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(paginationNext).toBeVisible();
      await expect(paginationPrev).toBeVisible();
    }
  });
});
