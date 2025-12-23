import { test, expect, login, logout, clearAuthState, checkPageHealth, ALL_PAGES } from './fixtures';

test.describe('Sanity Checks', () => {
  test.beforeEach(async ({ page }) => {
    // Start each test logged out
    await clearAuthState(page);
  });

  test('home page loads when logged out', async ({ page, pageErrors }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should see the landing page with login button
    await expect(page.getByText('Ta kontroll over')).toBeVisible();
    await expect(page.getByRole('button', { name: /logg inn/i })).toBeVisible();

    // Check for errors
    const errors = await checkPageHealth(page);
    expect([...errors, ...pageErrors]).toEqual([]);
  });

  test('can login via dev mode', async ({ page }) => {
    await login(page);

    // Should be on oversikt
    await expect(page).toHaveURL(/\/oversikt/);

    // Should see dashboard content (header visible on all viewports)
    await expect(page.locator('.app-header')).toBeVisible();
  });

  test('visit all pages after login', async ({ page, pageErrors }) => {
    await login(page);

    for (const { path, name } of ALL_PAGES) {
      await test.step(`Visit ${name} (${path})`, async () => {
        await page.goto(path);
        await page.waitForLoadState('networkidle');

        // Page should have loaded (not redirected to home/login)
        expect(page.url()).toContain(path);

        // Scroll down to bottom of page
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await page.waitForTimeout(300);

        // Scroll back to top
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(200);

        // Check page health
        const errors = await checkPageHealth(page);
        const criticalErrors = errors.filter(e =>
          e.includes('Page error') ||
          e.includes('Error boundary') ||
          e.includes('appears empty')
        );
        expect(criticalErrors).toEqual([]);
      });
    }

    // Log warnings for non-critical errors
    if (pageErrors.length > 0) {
      console.warn('Console errors during test:', pageErrors);
    }
  });

  test('navigation works', async ({ page }) => {
    await login(page);

    const navItems = [
      { link: 'Oversikt', expectedPath: '/oversikt' },
      { link: 'Portefølje', expectedPath: '/portefolje' },
      { link: 'Sparing', expectedPath: '/sparing' },
      { link: 'Gjeld', expectedPath: '/gjeld' },
      { link: 'Pensjon', expectedPath: '/pensjon' },
      { link: 'Kalkulatorer', expectedPath: '/kalkulatorer' },
    ];

    for (const { link, expectedPath } of navItems) {
      await test.step(`Navigate to ${link}`, async () => {
        const viewport = page.viewportSize();
        const isMobile = viewport && viewport.width < 768;

        if (isMobile) {
          // Open mobile menu
          const hamburger = page.getByRole('button', { name: /åpne meny/i });
          await hamburger.click();
          await page.getByRole('button', { name: link }).click();
        } else {
          // Click header nav link (use exact match + first to avoid duplicates)
          await page.locator('.app-header__nav').getByRole('link', { name: link, exact: true }).click();
        }

        await expect(page).toHaveURL(new RegExp(expectedPath));
      });
    }
  });

  test('can logout', async ({ page }) => {
    await login(page);

    // Verify we're logged in
    await expect(page).toHaveURL(/\/oversikt/);

    await logout(page);

    // Should be back on home page
    await expect(page).toHaveURL('/');

    // Should see login button
    await expect(page.getByRole('button', { name: /logg inn/i })).toBeVisible();
  });
});
