import { test as base, expect, Page } from '@playwright/test';

/** Pages that require authentication */
export const PROTECTED_PAGES = [
  { path: '/oversikt', name: 'Oversikt' },
  { path: '/portefolje', name: 'Portefølje' },
  { path: '/sparing', name: 'Sparing' },
  { path: '/gjeld', name: 'Gjeld' },
  { path: '/pensjon', name: 'Pensjon' },
  { path: '/kalkulatorer', name: 'Kalkulatorer' },
  { path: '/import', name: 'Importer data' },
  { path: '/min-okonomi', name: 'Min økonomi' },
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
  const oversiktLink = page.getByRole('link', { name: /gå til oversikt/i });
  const alreadyLoggedIn = await oversiktLink.isVisible({ timeout: 3000 }).catch(() => false);

  if (alreadyLoggedIn) {
    // Already logged in, navigate to oversikt
    await oversiktLink.click();
    await page.waitForURL(/\/oversikt/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    return;
  }

  // Not logged in, use demo login
  const loginBtn = page.getByRole('button', { name: /logg inn/i });
  await loginBtn.click();

  const demoBtn = page.getByRole('button', { name: /prøv demo/i });
  await demoBtn.click();

  // Wait for redirect with longer timeout
  await page.waitForURL(/\/(oversikt|auth\/callback)/, { timeout: 15000 });
  if (page.url().includes('auth/callback')) {
    await page.waitForURL('/oversikt', { timeout: 10000 });
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

/**
 * Portfolio Testing Helpers
 */

/**
 * Create a new snapshot via the NewMonthModal
 * @param page The Playwright page object
 * @param data Object with monthIndex, year, and accountValues
 */
export async function createSnapshot(
  page: Page,
  data: {
    monthIndex?: number;
    year?: number;
    accountValues?: Record<string, number>;
  }
): Promise<void> {
  const { monthIndex = new Date().getMonth(), year = new Date().getFullYear() } = data;

  // Click "Ny måned" button
  const nyMaanedBtn = page.getByRole('button', { name: /\+ Ny måned/i });
  await nyMaanedBtn.click();

  // Wait for modal to open
  const modal = page.getByRole('heading', { name: /ny måned/i });
  await expect(modal).toBeVisible({ timeout: 5000 });

  // Select month
  const monthSelect = page.locator('select').first();
  await monthSelect.selectOption(String(monthIndex));

  // Select year
  const yearSelect = page.locator('select').nth(1);
  await yearSelect.selectOption(String(year));

  // Fill in account values if provided
  if (data.accountValues) {
    const numberInputs = page.locator('input[type="number"]');
    const inputs = await numberInputs.all();

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      // Try to get the associated label or just fill them in order
      const placeholder = await input.getAttribute('placeholder');
      const ariaLabel = await input.getAttribute('aria-label');

      // If we have a mapping for this input, use it
      const key = placeholder || ariaLabel || `field_${i}`;
      if (data.accountValues[key]) {
        await input.fill(String(data.accountValues[key]));
      }
    }
  }

  // Click Lagre button
  const lagereBtn = page.getByRole('button', { name: /lagre/i });
  await lagereBtn.click();

  // Wait for modal to close and API response
  await page.waitForLoadState('networkidle');
}

/**
 * Edit a cell value in the spreadsheet
 * @param page The Playwright page object
 * @param rowIndex Row index (0-based)
 * @param columnIndex Column index among editable columns (0-based)
 * @param value The new value to enter
 */
export async function editCell(
  page: Page,
  rowIndex: number,
  columnIndex: number,
  value: number | string
): Promise<void> {
  const dataRows = page.locator('tbody tr');
  const row = dataRows.nth(rowIndex);

  // Find editable cells in this row
  const editableCells = row.locator('td.cell-editable');
  const cell = editableCells.nth(columnIndex);

  // Click to enter edit mode
  await cell.click();

  // Fill in the value
  const input = cell.locator('input[type="number"]');
  await input.fill(String(value));

  // Press Enter to save
  await input.press('Enter');

  // Wait for API response
  await page.waitForLoadState('networkidle');
}

/**
 * Delete a snapshot
 * @param page The Playwright page object
 * @param rowIndex Row index to delete (0-based)
 */
export async function deleteSnapshot(page: Page, rowIndex: number): Promise<void> {
  const dataRows = page.locator('tbody tr');
  const row = dataRows.nth(rowIndex);

  // Click delete button
  const deleteBtn = row.locator('button[aria-label*="Slett"]').first();
  await deleteBtn.click();

  // Confirm deletion in modal
  const confirmBtn = page.getByRole('button', { name: /slett/i }).last();
  await confirmBtn.click();

  // Wait for deletion to complete
  await page.waitForLoadState('networkidle');
}

/**
 * Export portfolio data to CSV
 * @param page The Playwright page object
 */
export async function exportPortfolioData(page: Page): Promise<void> {
  const eksportBtn = page.getByRole('button', { name: /eksporter/i });
  await eksportBtn.click();

  // Wait for download to start
  await page.waitForTimeout(500);
}
