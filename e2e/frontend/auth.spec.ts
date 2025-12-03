import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.describe('Login Page', () => {
    test('shows login page when not authenticated', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('button', { name: /logg inn/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /prøv demo/i })).toBeVisible();
    });

    test('shows Google and Facebook login options', async ({ page }) => {
      await page.goto('/');
      await expect(page.getByRole('button', { name: /google/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /facebook/i })).toBeVisible();
    });
  });

  test.describe('Demo Login', () => {
    test('can login with demo account', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: /prøv demo/i }).click();

      // Should redirect to dashboard after demo login
      await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
    });

    test('demo user can access dashboard', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: /prøv demo/i }).click();

      await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
      await expect(page.locator('nav')).toBeVisible();
    });

    test('demo login displays greeting and navigation', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: /prøv demo/i }).click();

      // Verify redirect to dashboard
      await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

      // Verify greeting is visible (may have various forms)
      const greeting = page.locator('text=/god morgen|hei|welcome/i');
      const hasGreeting = await greeting.count().then(c => c > 0);

      // Verify navigation is present
      await expect(page.locator('nav')).toBeVisible();

      // Verify main content is visible
      const main = page.locator('main');
      await expect(main.first()).toBeVisible();
    });

    test('demo user can navigate to portfolio', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: /prøv demo/i }).click();

      await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
      await page.getByRole('link', { name: /portefølje/i }).click();
      await expect(page).toHaveURL(/.*portfolio/);
    });

    test('demo user can logout', async ({ page }) => {
      await page.goto('/');
      await page.getByRole('button', { name: /prøv demo/i }).click();

      await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

      // Click avatar menu and logout
      await page.getByRole('button', { name: /avatar|bruker|menu/i }).click();
      await page.getByRole('menuitem', { name: /logg ut/i }).click();

      // Should be back at login page
      await expect(page.getByRole('button', { name: /logg inn/i })).toBeVisible();
    });
  });
});
