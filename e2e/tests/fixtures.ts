import { test as base, expect, Page } from '@playwright/test';

/** Pages that require authentication */
export const PROTECTED_PAGES = [
  { path: '/dashboard', name: 'Oversikt' },
  { path: '/portfolio', name: 'Portefølje' },
  { path: '/sparing', name: 'Sparing' },
  { path: '/gjeld', name: 'Gjeld' },
  { path: '/pensjon', name: 'Pensjon' },
  { path: '/kalkulatorer', name: 'Kalkulatorer' },
] as const;

/** Calculator sub-pages */
export const CALCULATOR_PAGES = [
  { path: '/kalkulatorer/rentes-rente', name: 'Rentes rente' },
  { path: '/kalkulatorer/fire', name: 'F.I.R.E.' },
  { path: '/kalkulatorer/lan', name: 'Lån' },
  { path: '/kalkulatorer/monte-carlo', name: 'Monte Carlo' },
] as const;

/** All pages to test */
export const ALL_PAGES = [...PROTECTED_PAGES, ...CALCULATOR_PAGES] as const;

const STORAGE_KEYS = {
  DEMO_TOKEN: 'finans_demo_token',
  DEV_LOGOUT: 'finans_dev_logout',
};

/**
 * Clear auth state via localStorage manipulation
 */
export async function clearAuthState(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate((keys) => {
    localStorage.removeItem(keys.DEMO_TOKEN);
    localStorage.setItem(keys.DEV_LOGOUT, 'true');
  }, STORAGE_KEYS);
}

/**
 * Login via demo mode
 */
export async function login(page: Page): Promise<void> {
  // Clear dev logout flag so we can log in
  await page.goto('/');
  await page.evaluate((keys) => {
    localStorage.removeItem(keys.DEV_LOGOUT);
  }, STORAGE_KEYS);

  // Reload to pick up the auth state change
  await page.reload();
  await page.waitForLoadState('networkidle');

  // Check if already logged in (dev mode auto-login)
  const dashboardLink = page.getByRole('link', { name: /gå til dashboard/i });
  const alreadyLoggedIn = await dashboardLink.isVisible({ timeout: 3000 }).catch(() => false);

  if (alreadyLoggedIn) {
    // Already logged in, navigate to dashboard
    await dashboardLink.click();
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    return;
  }

  // Not logged in, use demo login
  const loginBtn = page.getByRole('button', { name: /logg inn/i });
  await loginBtn.click();

  const demoBtn = page.getByRole('button', { name: /prøv demo/i });
  await demoBtn.click();

  // Wait for redirect with longer timeout
  await page.waitForURL(/\/(dashboard|auth\/callback)/, { timeout: 15000 });
  if (page.url().includes('auth/callback')) {
    await page.waitForURL('/dashboard', { timeout: 10000 });
  }
  await page.waitForLoadState('networkidle');
}

/**
 * Logout
 */
export async function logout(page: Page): Promise<void> {
  // Simply set the logout flag and reload
  await page.evaluate((keys) => {
    localStorage.removeItem(keys.DEMO_TOKEN);
    localStorage.setItem(keys.DEV_LOGOUT, 'true');
  }, STORAGE_KEYS);

  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

/**
 * Check page for obvious errors
 */
export async function checkPageHealth(page: Page): Promise<string[]> {
  const errors: string[] = [];

  // Check page has content
  const body = page.locator('body');
  const content = await body.textContent();
  if (!content || content.length < 50) {
    errors.push('Page appears empty');
  }

  // Check for error boundary text
  const errorBoundary = page.locator('text=/noe gikk galt/i');
  if (await errorBoundary.isVisible().catch(() => false)) {
    errors.push('Error boundary displayed');
  }

  // Check for broken images (skip if no images)
  const images = page.locator('img');
  const imageCount = await images.count();
  for (let i = 0; i < Math.min(imageCount, 5); i++) {
    const img = images.nth(i);
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth).catch(() => 1);
    if (naturalWidth === 0) {
      const src = await img.getAttribute('src');
      errors.push(`Broken image: ${src}`);
    }
  }

  return errors;
}

/** Extended test with console error collection */
export const test = base.extend<{ pageErrors: string[] }>({
  pageErrors: async ({ page }, use) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore common non-issues
        if (!text.includes('favicon') && !text.includes('net::ERR')) {
          errors.push(`Console: ${text.slice(0, 200)}`);
        }
      }
    });

    page.on('pageerror', error => {
      errors.push(`Page error: ${error.message.slice(0, 200)}`);
    });

    await use(errors);
  },
});

export { expect };
