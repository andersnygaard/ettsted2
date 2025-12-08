import { test as base, expect, Page, Locator } from '@playwright/test';

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
    await page.waitForURL(/\/oversikt/, { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    return;
  }

  // Not logged in, use demo login
  const loginBtn = page.getByRole('button', { name: /logg inn/i });
  await loginBtn.click();

  const demoBtn = page.getByRole('button', { name: /prøv demo/i });
  await demoBtn.click();

  // Wait for redirect with longer timeout - demo seeding can take time
  await page.waitForURL(/\/(oversikt|auth\/callback)/, { timeout: 30000 });
  if (page.url().includes('auth/callback')) {
    await page.waitForURL('/oversikt', { timeout: 15000 });
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

/**
 * Account Management Helpers
 */

/**
 * Navigate to Min Økonomi (EconomyPage)
 */
export async function navigateToEconomy(page: Page): Promise<void> {
  await page.goto('/min-okonomi');
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to a specific wizard step (1-4)
 * Step 1: Bruker, Step 2: Sparing, Step 3: Gjeld, Step 4: Pensjon
 */
export async function navigateToWizardStep(page: Page, step: 1 | 2 | 3 | 4): Promise<void> {
  const stepNames = ['Bruker', 'Sparing', 'Gjeld', 'Pensjon'];

  // Check current step
  const getCurrentStep = async (): Promise<number> => {
    const steps = page.locator('.wizard-progress__step');
    const count = await steps.count();
    for (let i = 0; i < count; i++) {
      const stepEl = steps.nth(i);
      const isCurrent = await stepEl.evaluate(el =>
        el.classList.contains('wizard-progress__step--current')
      );
      if (isCurrent) return i + 1;
    }
    return 1;
  };

  let currentStep = await getCurrentStep();

  // Navigate forward or backward to reach target step
  while (currentStep !== step) {
    if (currentStep < step) {
      // Go forward
      const nextBtn = page.getByRole('button', { name: /neste/i });
      await nextBtn.click();
      await page.waitForLoadState('networkidle');
    } else {
      // Go backward - click on the step in progress bar
      const targetStepEl = page.locator('.wizard-progress__step').nth(step - 1);
      await targetStepEl.click();
      await page.waitForLoadState('networkidle');
    }
    currentStep = await getCurrentStep();
  }
}

/**
 * Get an account item by its name (searches input values)
 * NOTE: This returns a locator that may match nothing if name not found.
 * For reliable lookup, use getAccountItemByName() instead.
 */
export function getAccountItem(page: Page, name: string): Locator {
  // Use XPath contains to match the name input value
  return page.locator(`.accounts-list__item:has(.accounts-list__name-input[value="${name}"])`);
}

/**
 * Get an account item by name using evaluation (more reliable)
 */
export async function getAccountItemByName(page: Page, name: string): Promise<Locator> {
  const items = page.locator('.accounts-list__item');
  const count = await items.count();

  for (let i = 0; i < count; i++) {
    const item = items.nth(i);
    const nameInput = item.locator('.accounts-list__name-input');
    const inputValue = await nameInput.inputValue().catch(() => '');
    if (inputValue === name) {
      return item;
    }
  }

  // Return a locator that won't match (for proper error messages)
  return page.locator(`.accounts-list__item:has(.accounts-list__name-input[value="${name}"])`);
}

/**
 * Get an account item by partial name match (case-insensitive)
 */
export function getAccountItemByPartialName(page: Page, partialName: string): Locator {
  return page.locator('.accounts-list__item').filter({
    has: page.locator('.accounts-list__name-input')
  }).filter({
    hasText: new RegExp(partialName, 'i')
  });
}

/**
 * Add a new account in the current wizard step
 */
export async function addAccount(
  page: Page,
  data: {
    name: string;
    value: number;
    interestRate?: number;
    remainingYears?: number;
  }
): Promise<void> {
  // Click add button
  const addBtn = page.locator('.accounts-list__add-btn');
  await addBtn.click();

  // Wait for new account to appear
  await page.waitForTimeout(300);

  // Find the last account item (the newly added one)
  const items = page.locator('.accounts-list__item');
  const lastItem = items.last();

  // Fill in name
  const nameInput = lastItem.locator('.accounts-list__name-input');
  await nameInput.fill(data.name);

  // Fill in value - NumberInput uses type="text" with aria-label="Verdi"
  const valueInput = lastItem.locator('.accounts-list__value-row input');
  await valueInput.fill(String(data.value));

  // Fill loan details if provided (for gjeld)
  if (data.interestRate !== undefined) {
    const loanInputs = lastItem.locator('.accounts-list__loan-input');
    await loanInputs.first().fill(String(data.interestRate));
  }

  if (data.remainingYears !== undefined) {
    const loanInputs = lastItem.locator('.accounts-list__loan-input');
    await loanInputs.nth(1).fill(String(data.remainingYears));
  }
}

/**
 * Edit an existing account by name
 */
export async function editAccount(
  page: Page,
  currentName: string,
  updates: {
    name?: string;
    value?: number;
    isActive?: boolean;
    interestRate?: number;
    remainingYears?: number;
  }
): Promise<void> {
  const item = await getAccountItemByName(page, currentName);

  if (updates.name !== undefined) {
    const nameInput = item.locator('.accounts-list__name-input');
    await nameInput.fill(updates.name);
  }

  if (updates.value !== undefined) {
    const valueInput = item.locator('.accounts-list__value-row input[type="text"], .accounts-list__value-row input[type="number"]');
    await valueInput.fill(String(updates.value));
  }

  if (updates.isActive !== undefined) {
    const checkbox = item.locator('.accounts-list__toggle input[type="checkbox"]');
    const isChecked = await checkbox.isChecked();
    if (isChecked !== updates.isActive) {
      await checkbox.click();
    }
  }

  if (updates.interestRate !== undefined) {
    const loanInputs = item.locator('.accounts-list__loan-input');
    await loanInputs.first().fill(String(updates.interestRate));
  }

  if (updates.remainingYears !== undefined) {
    const loanInputs = item.locator('.accounts-list__loan-input');
    await loanInputs.nth(1).fill(String(updates.remainingYears));
  }
}

/**
 * Delete an account by name
 */
export async function deleteAccount(page: Page, accountName: string): Promise<void> {
  const item = await getAccountItemByName(page, accountName);
  const deleteBtn = item.locator('button[aria-label^="Slett"]');
  await deleteBtn.click();
  // Wait for UI to update
  await page.waitForTimeout(200);
}

/**
 * Get the category total value displayed
 */
export async function getCategoryTotal(page: Page): Promise<number> {
  const totalEl = page.locator('.accounts-list__total-value');
  const text = await totalEl.textContent();
  if (!text) return 0;

  // Parse Norwegian number format: "123 456 kr" or "123 456,78 kr"
  const cleaned = text.replace(/[^\d,-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}

/**
 * Check if an error message is displayed
 */
export async function hasError(page: Page, pattern: string | RegExp): Promise<boolean> {
  const errorEls = page.locator('.accounts-list__error');
  const count = await errorEls.count();

  for (let i = 0; i < count; i++) {
    const text = await errorEls.nth(i).textContent();
    if (text) {
      if (typeof pattern === 'string') {
        if (text.includes(pattern)) return true;
      } else {
        if (pattern.test(text)) return true;
      }
    }
  }
  return false;
}

/**
 * Complete the wizard by clicking through remaining steps
 * Button names: "Neste" (steps 1-3), "Fullfør" (step 4)
 */
export async function completeWizard(page: Page): Promise<void> {
  // Keep clicking Next/Fullfør until we navigate to /oversikt
  const maxAttempts = 10;
  for (let i = 0; i < maxAttempts; i++) {
    // Check if we've left the wizard (navigated away)
    if (page.url().includes('/oversikt')) {
      break;
    }

    // Check if we're still in the wizard
    const wizard = page.locator('.onboarding-wizard');
    const isVisible = await wizard.isVisible().catch(() => false);
    if (!isVisible) break;

    // Find the primary action button in the wizard footer
    const primaryBtn = page.locator('.onboarding-wizard__btn--primary');
    const btnText = await primaryBtn.textContent().catch(() => '');

    if (btnText?.includes('Fullfør')) {
      await primaryBtn.click();
      // Wait for submission and redirect to /oversikt with longer timeout
      await page.waitForURL('**/oversikt', { timeout: 20000 }).catch(() => {});
    } else if (btnText?.includes('Neste')) {
      await primaryBtn.click();
      // Wait for step transition
      await page.waitForLoadState('networkidle');
      // Small delay to ensure step has changed
      await page.waitForTimeout(200);
    } else {
      break;
    }
  }

  // Final verification - ensure we're on oversikt page
  await page.waitForLoadState('networkidle');
}

/**
 * Get all account names in the current step
 */
export async function getAccountNames(page: Page): Promise<string[]> {
  const nameInputs = page.locator('.accounts-list__name-input');
  const count = await nameInputs.count();
  const names: string[] = [];

  for (let i = 0; i < count; i++) {
    const value = await nameInputs.nth(i).inputValue();
    names.push(value);
  }

  return names;
}

/**
 * Get the number of accounts in the current step
 */
export async function getAccountCount(page: Page): Promise<number> {
  const items = page.locator('.accounts-list__item');
  return await items.count();
}
