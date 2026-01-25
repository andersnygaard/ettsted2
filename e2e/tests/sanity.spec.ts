import { test, expect, login, logout, clearAuthState, checkPageHealth, ALL_PAGES } from './fixtures';

test.describe('Sanity Checks', () => {
  // Note: Most tests use storageState from global setup, so auth is pre-loaded.
  // Tests that specifically need logged-out state call clearAuthState() explicitly.

  test('home page loads when logged out', async ({ page, pageErrors }) => {
    // This test needs logged-out state
    await clearAuthState(page);
    await page.goto('/');

    // Should see the landing page with login button
    await expect(page.getByText('Ta kontroll over')).toBeVisible();
    await expect(page.getByRole('button', { name: /logg inn/i })).toBeVisible();

    // Check for errors
    const errors = await checkPageHealth(page);
    expect([...errors, ...pageErrors]).toEqual([]);
  });

  test('can login via dev mode', async ({ page }) => {
    // This test needs logged-out state to test login flow
    await clearAuthState(page);
    await login(page);

    // Should be on oversikt
    await expect(page).toHaveURL(/\/oversikt/);

    // Should see dashboard content (header visible on all viewports)
    await expect(page.locator('.app-header')).toBeVisible();
  });

  test('visit all pages after login', async ({ page, pageErrors }) => {
    // Auth pre-loaded from global setup - just navigate
    for (const { path, name } of ALL_PAGES) {
      await test.step(`Visit ${name} (${path})`, async () => {
        await page.goto(path);

        // Wait for page content instead of networkidle
        await expect(page.locator('.app-header')).toBeVisible();

        // Page should have loaded (not redirected to home/login)
        expect(page.url()).toContain(path);

        // Scroll down to bottom of page and wait for any lazy content
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(page.locator('body')).toBeVisible();

        // Scroll back to top
        await page.evaluate(() => window.scrollTo(0, 0));

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
    // Auth pre-loaded from global setup - start from oversikt
    await page.goto('/oversikt');
    await expect(page.locator('.app-header')).toBeVisible();

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
          await expect(page.getByRole('button', { name: link })).toBeVisible();
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
    // Auth pre-loaded from global setup
    await page.goto('/oversikt');
    await expect(page.locator('.app-header')).toBeVisible();

    await logout(page);

    // Should be back on home page
    await expect(page).toHaveURL('/');

    // Should see login button
    await expect(page.getByRole('button', { name: /logg inn/i })).toBeVisible();
  });
});

test.describe('Protected Route Redirects', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure logged out state for all tests in this suite
    await clearAuthState(page);
  });

  test('unauthenticated access to /oversikt redirects to /', async ({ page }) => {
    await page.goto('/oversikt');

    // Should be redirected to home page
    await expect(page).toHaveURL('/');

    // Should see login button
    await expect(page.getByRole('button', { name: /logg inn/i })).toBeVisible();
  });

  test('unauthenticated access to /portefolje redirects to /', async ({ page }) => {
    await page.goto('/portefolje');

    // Should be redirected to home page
    await expect(page).toHaveURL('/');

    // Should see login button
    await expect(page.getByRole('button', { name: /logg inn/i })).toBeVisible();
  });

  test('unauthenticated access to /kalkulatorer redirects to /', async ({ page }) => {
    await page.goto('/kalkulatorer');

    // Should be redirected to home page
    await expect(page).toHaveURL('/');

    // Should see login button
    await expect(page.getByRole('button', { name: /logg inn/i })).toBeVisible();
  });

  test('home page is accessible when logged out', async ({ page }) => {
    await page.goto('/');

    // Should stay on home page
    await expect(page).toHaveURL('/');

    // Should see landing page content
    await expect(page.getByText('Ta kontroll over')).toBeVisible();

    // Should see login button
    await expect(page.getByRole('button', { name: /logg inn/i })).toBeVisible();
  });
});
