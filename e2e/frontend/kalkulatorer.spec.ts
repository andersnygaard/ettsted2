import { test, expect } from '@playwright/test';
import { loginAsDemo } from '../fixtures/auth';

test.describe('Kalkulatorer (Calculators)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('page loads successfully', async ({ page }) => {
    await page.goto('/kalkulatorer');
    await expect(page).toHaveURL(/.*kalkulatorer/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('shows navigation header', async ({ page }) => {
    await page.goto('/kalkulatorer');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('can navigate to other tabs', async ({ page }) => {
    await page.goto('/kalkulatorer');
    await page.getByRole('link', { name: /oversikt/i }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });
});

test.describe('Kalkulatorer - Sub-pages', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('Loan calculator loads', async ({ page }) => {
    await page.goto('/kalkulatorer/loan');
    await expect(page).toHaveURL(/.*loan/);
  });

  test('Compound calculator loads', async ({ page }) => {
    await page.goto('/kalkulatorer/compound');
    await expect(page).toHaveURL(/.*compound/);
  });

  test('F.I.R.E. calculator loads', async ({ page }) => {
    await page.goto('/kalkulatorer/fire');
    await expect(page).toHaveURL(/.*fire/);
  });

  test('Monte Carlo loads', async ({ page }) => {
    await page.goto('/kalkulatorer/monte-carlo');
    await expect(page).toHaveURL(/.*monte-carlo/);
  });
});
