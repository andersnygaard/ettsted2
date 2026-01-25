import { test as base, expect, Page, Locator, ConsoleMessage } from '@playwright/test';

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
 * Ensure user is logged in and on /oversikt.
 *
 * Handles two scenarios:
 * 1. Auth pre-loaded from global setup (storageState) - just verify and navigate
 * 2. Auth cleared (tests that call clearAuthState first) - perform actual demo login
 */
export async function login(page: Page): Promise<void> {
  const appHeader = page.locator('.app-header');
  const loginButton = page.getByRole('button', { name: /logg inn/i });

  // First, try the fast path - just go to /oversikt
  await page.goto('/oversikt');

  // Wait for either app-header (authenticated) or login button (not authenticated)
  await expect(appHeader.or(loginButton)).toBeVisible({ timeout: 10000 });

  // If we're already authenticated (on /oversikt with header), we're done
  if (await appHeader.isVisible() && page.url().includes('/oversikt')) {
    return;
  }

  // Not authenticated - need to do actual login via demo button
  // Ensure we're on home page with login button visible
  if (!page.url().endsWith('/')) {
    await page.goto('/');
    await expect(loginButton).toBeVisible({ timeout: 5000 });
  }

  // Clear DEV_LOGOUT flag so it doesn't interfere after login
  await page.evaluate((keys) => {
    localStorage.removeItem(keys.DEV_LOGOUT);
  }, STORAGE_KEYS);

  // Click login to open modal
  await loginButton.click();

  // Click "Prøv demo" button in the modal
  const demoButton = page.getByRole('button', { name: /prøv demo/i });
  await expect(demoButton).toBeVisible({ timeout: 5000 });
  await demoButton.click();

  // Wait for redirect to /oversikt after demo login
  // Demo login calls the backend which seeds data - can take time
  await page.waitForURL('**/oversikt', { timeout: 60000 });
  await expect(appHeader).toBeVisible({ timeout: 10000 });

  // Final verification
  expect(page.url()).toContain('/oversikt');
}

/**
 * Logout
 */
export async function logout(page: Page): Promise<void> {
  await page.evaluate((keys) => {
    localStorage.removeItem(keys.DEMO_TOKEN);
    localStorage.setItem(keys.DEV_LOGOUT, 'true');
  }, STORAGE_KEYS);

  await page.goto('/');
  // Wait for login button to be visible (confirms we're logged out)
  await expect(page.getByRole('button', { name: /logg inn/i })).toBeVisible();
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
  const errorBoundaryCount = await page.getByText(/noe gikk galt/i).count();
  if (errorBoundaryCount > 0) {
    errors.push('Error boundary displayed');
  }

  // Check for broken images (skip if no images)
  const images = page.locator('img');
  const imageCount = await images.count();
  for (let i = 0; i < Math.min(imageCount, 5); i++) {
    const img = images.nth(i);
    const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
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

    const consoleHandler = (msg: ConsoleMessage) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore common non-issues
        if (!text.includes('favicon') && !text.includes('net::ERR')) {
          errors.push(`Console: ${text.slice(0, 200)}`);
        }
      }
    };

    const errorHandler = (error: Error) => {
      errors.push(`Page error: ${error.message.slice(0, 200)}`);
    };

    page.on('console', consoleHandler);
    page.on('pageerror', errorHandler);

    await use(errors);

    // Cleanup handlers after test to prevent leakage
    page.off('console', consoleHandler);
    page.off('pageerror', errorHandler);
  },
});

export { expect };

/**
 * Portfolio Testing Helpers
 */

/**
 * Create a new snapshot via the NewMonthModal
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

  // Wait for "Ny måned" button using Playwright auto-wait
  const nyMaanedBtn = page.getByRole('button', { name: /\+ Ny måned/i });
  await expect(nyMaanedBtn).toBeVisible({ timeout: 10000 });
  await nyMaanedBtn.click();

  // Wait for modal heading (confirms modal opened)
  const modalHeading = page.getByRole('heading', { name: /ny måned/i });
  await expect(modalHeading).toBeVisible({ timeout: 5000 });

  // Select month - Playwright waits for select to be ready
  const monthSelect = page.locator('select.new-month-modal__select').first();
  await expect(monthSelect).toBeVisible();
  await monthSelect.selectOption(String(monthIndex));

  // Select year
  const yearSelect = page.locator('select.new-month-modal__select').nth(1);
  await expect(yearSelect).toBeVisible();
  await yearSelect.selectOption(String(year));

  // Fill account values
  if (data.accountValues) {
    for (const [accountName, value] of Object.entries(data.accountValues)) {
      const input = page
        .locator('.number-input')
        .filter({ hasText: new RegExp(accountName, 'i') })
        .locator('input');

      const inputCount = await input.count();
      if (inputCount > 0) {
        await input.first().fill(String(value));
      }
    }
  }

  // Click save
  const lagereBtn = page.locator('.new-month-modal__actions').getByRole('button', { name: /lagre/i });
  await expect(lagereBtn).toBeVisible();
  await lagereBtn.click();

  // Wait for modal to close
  await expect(modalHeading).not.toBeVisible({ timeout: 10000 });
}

/**
 * Edit a cell value in the spreadsheet
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
  await expect(input).toBeVisible();
  await input.fill(String(value));

  // Press Enter to save
  await input.press('Enter');

  // Wait for input to disappear (saved)
  await expect(input).not.toBeVisible({ timeout: 5000 });
}

/**
 * Delete a snapshot
 */
export async function deleteSnapshot(page: Page, rowIndex: number): Promise<void> {
  const dataRows = page.locator('tbody tr');
  const row = dataRows.nth(rowIndex);

  // Click delete button
  const deleteBtn = row.locator('button[aria-label*="Slett"]').first();
  await deleteBtn.click();

  // Confirm deletion in modal
  const confirmBtn = page.getByRole('button', { name: /slett/i }).last();
  await expect(confirmBtn).toBeVisible();
  await confirmBtn.click();

  // Wait for row to be removed
  await expect(row).not.toBeVisible({ timeout: 5000 });
}

/**
 * Export portfolio data to CSV
 */
export async function exportPortfolioData(page: Page): Promise<void> {
  const eksportBtn = page.getByRole('button', { name: /eksporter/i });
  await expect(eksportBtn).toBeVisible();

  // Start waiting for download before clicking
  const downloadPromise = page.waitForEvent('download');
  await eksportBtn.click();
  await downloadPromise;
}

/**
 * Account Management Helpers
 */

/**
 * Navigate to Min Økonomi (EconomyPage)
 */
export async function navigateToEconomy(page: Page): Promise<void> {
  await page.goto('/min-okonomi');

  // Wait for the wizard to render (not just the loading spinner)
  const wizardProgress = page.locator('.wizard-progress');
  await expect(wizardProgress).toBeVisible({ timeout: 30000 });

  // Also wait for wizard content to be visible
  const wizardContent = page.locator('.onboarding-wizard__content');
  await expect(wizardContent).toBeVisible({ timeout: 10000 });
}

/**
 * Navigate to a specific wizard step (1-4)
 * Step 1: Bruker, Step 2: Sparing, Step 3: Gjeld, Step 4: Pensjon
 */
export async function navigateToWizardStep(page: Page, step: 1 | 2 | 3 | 4): Promise<void> {
  // Wait for wizard progress to be visible
  const wizardProgress = page.locator('.wizard-progress');
  await expect(wizardProgress).toBeVisible({ timeout: 10000 });

  // Get current step
  const getCurrentStep = async (): Promise<number> => {
    const steps = page.locator('.wizard-progress__step');
    const count = await steps.count();
    for (let i = 0; i < count; i++) {
      const stepEl = steps.nth(i);
      const isCurrent = await stepEl.evaluate((el) =>
        el.classList.contains('wizard-progress__step--current')
      );
      if (isCurrent) return i + 1;
    }
    throw new Error('Could not determine current wizard step');
  };

  let currentStep = await getCurrentStep();
  let iterations = 0;
  const maxIterations = 10;

  // Navigate forward or backward to reach target step
  while (currentStep !== step && iterations < maxIterations) {
    iterations++;

    if (currentStep < step) {
      // Go forward
      const nextBtn = page.getByRole('button', { name: /neste/i });
      await expect(nextBtn).toBeVisible();
      await expect(nextBtn).toBeEnabled();
      await nextBtn.click();

      // Wait for step indicator to update
      await expect(async () => {
        const newStep = await getCurrentStep();
        expect(newStep).toBeGreaterThan(currentStep);
      }).toPass({ timeout: 5000 });
    } else {
      // Go backward - click on the step in progress bar
      const targetStepEl = page.locator('.wizard-progress__step').nth(step - 1);
      await targetStepEl.click();

      // Wait for step indicator to update
      await expect(async () => {
        const newStep = await getCurrentStep();
        expect(newStep).toBeLessThan(currentStep);
      }).toPass({ timeout: 5000 });
    }

    currentStep = await getCurrentStep();
  }

  if (currentStep !== step) {
    throw new Error(`Failed to navigate to step ${step}, stuck at step ${currentStep}`);
  }
}

/**
 * Get an account item by its name (searches input values)
 */
export function getAccountItem(page: Page, name: string): Locator {
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
    const inputValue = await nameInput.inputValue();
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
  return page
    .locator('.accounts-list__item')
    .filter({
      has: page.locator('.accounts-list__name-input'),
    })
    .filter({
      hasText: new RegExp(partialName, 'i'),
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
  // Get initial count
  const items = page.locator('.accounts-list__item');
  const initialCount = await items.count();

  // Click add button
  const addBtn = page.locator('.accounts-list__add-btn');
  await expect(addBtn).toBeVisible();
  await addBtn.click();

  // Wait for new account to appear
  await expect(items).toHaveCount(initialCount + 1, { timeout: 5000 });

  // Find the last account item (the newly added one)
  const lastItem = items.last();

  // Fill in name
  const nameInput = lastItem.locator('.accounts-list__name-input');
  await expect(nameInput).toBeVisible();
  await nameInput.fill(data.name);

  // Fill in value
  const valueInput = lastItem.locator('.accounts-list__value-row input');
  await expect(valueInput).toBeVisible();
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
  await expect(item).toBeVisible({ timeout: 5000 });

  if (updates.name !== undefined) {
    const nameInput = item.locator('.accounts-list__name-input');
    await nameInput.fill(updates.name);
  }

  if (updates.value !== undefined) {
    const valueInput = item.locator(
      '.accounts-list__value-row input[type="text"], .accounts-list__value-row input[type="number"]'
    );
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
  // Get initial count
  const items = page.locator('.accounts-list__item');
  const initialCount = await items.count();

  // Find and click delete on the specified account
  const item = await getAccountItemByName(page, accountName);
  await expect(item).toBeVisible({ timeout: 5000 });

  const deleteBtn = item.locator('button[aria-label^="Slett"]');
  await expect(deleteBtn).toBeVisible();
  await deleteBtn.click();

  // Wait for account count to decrease (more reliable than checking specific element)
  await expect(items).toHaveCount(initialCount - 1, { timeout: 5000 });
}

/**
 * Get the category total value displayed
 */
export async function getCategoryTotal(page: Page): Promise<number> {
  const totalEl = page.locator('.accounts-list__total-value');
  await expect(totalEl).toBeVisible();

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
 */
export async function completeWizard(page: Page): Promise<void> {
  const maxAttempts = 10;

  for (let i = 0; i < maxAttempts; i++) {
    // Check if we've left the wizard (navigated away)
    if (page.url().includes('/oversikt')) {
      break;
    }

    // Check if we're still in the wizard
    const wizard = page.locator('.onboarding-wizard');
    const wizardCount = await wizard.count();
    if (wizardCount === 0) break;

    // Find the primary action button in the wizard footer
    const primaryBtn = page.locator('.onboarding-wizard__btn--primary');
    const btnText = await primaryBtn.textContent();

    if (btnText?.includes('Fullfør')) {
      await primaryBtn.click();
      // Wait for redirect to /oversikt
      await page.waitForURL('**/oversikt', { timeout: 20000 });
      break;
    } else if (btnText?.includes('Neste')) {
      await primaryBtn.click();
      // Wait for step to change by checking that button is enabled again
      await expect(primaryBtn).toBeEnabled({ timeout: 5000 });
    } else {
      break;
    }
  }
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

/**
 * Get a profile field value from Step 1 of the wizard
 * Supports: nickname, monthlySalary, monthlySavings, birthYear, plannedRetirementAge, fireNumber
 */
export async function getProfileFieldValue(page: Page, fieldName: string): Promise<string> {
  let input: Locator;

  switch (fieldName.toLowerCase()) {
    case 'nickname':
      input = page.locator('input#nickname');
      break;
    case 'monthlysalary':
      input = page
        .locator('.number-input')
        .filter({ hasText: /Månedlig inntekt/i })
        .locator('input')
        .first();
      break;
    case 'monthlysavings':
      input = page
        .locator('.number-input')
        .filter({ hasText: /Månedlig sparing/i })
        .locator('input')
        .first();
      break;
    case 'birthyear':
      input = page.locator('input#birthYear');
      break;
    case 'plannedretirementage':
    case 'retirementage':
      input = page.locator('input#retirementAge');
      break;
    case 'firenumber':
    case 'fire':
      input = page
        .locator('.number-input')
        .filter({ hasText: /F.I.R.E. tall/i })
        .locator('input')
        .first();
      break;
    default:
      throw new Error(`Unknown profile field: ${fieldName}`);
  }

  await expect(input).toBeVisible();
  return await input.inputValue();
}

/**
 * Set a profile field value in Step 1 of the wizard
 */
export async function setProfileFieldValue(page: Page, fieldName: string, value: string): Promise<void> {
  // Find the correct input and fill it
  const inputToFill = await findProfileInput(page, fieldName);
  await inputToFill.clear();
  await inputToFill.fill(value);
}

/**
 * Helper to find the profile input element
 */
async function findProfileInput(page: Page, fieldName: string): Promise<Locator> {
  switch (fieldName.toLowerCase()) {
    case 'nickname':
      return page.locator('input#nickname');
    case 'monthlysalary':
      return page
        .locator('.number-input')
        .filter({ hasText: /Månedlig inntekt/i })
        .locator('input')
        .first();
    case 'monthlysavings':
      return page
        .locator('.number-input')
        .filter({ hasText: /Månedlig sparing/i })
        .locator('input')
        .first();
    case 'birthyear':
      return page.locator('input#birthYear');
    case 'plannedretirementage':
    case 'retirementage':
      return page.locator('input#retirementAge');
    case 'firenumber':
    case 'fire':
      return page
        .locator('.number-input')
        .filter({ hasText: /F.I.R.E. tall/i })
        .locator('input')
        .first();
    default:
      throw new Error(`Unknown profile field: ${fieldName}`);
  }
}
