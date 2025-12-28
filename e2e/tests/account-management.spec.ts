import {
  test,
  expect,
  login,
  navigateToEconomy,
  navigateToWizardStep,
  addAccount,
  editAccount,
  deleteAccount,
  getAccountItem,
  getAccountItemByName,
  getAccountNames,
  getAccountCount,
  getCategoryTotal,
  hasError,
  completeWizard,
} from './fixtures';

test.describe('Account Management', () => {
  test.beforeEach(async ({ page }) => {
    // Clear auth state first to ensure clean start, then login
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.removeItem('finans_demo_token');
      localStorage.setItem('finans_dev_logout', 'true');
    });
    await login(page);
    await navigateToEconomy(page);
  });

  test.describe('Adding Accounts - Total Calculations', () => {
    test('adding sparing account with value updates total correctly', async ({ page }) => {
      await navigateToWizardStep(page, 2); // Sparing

      // Get initial total
      const initialTotal = await getCategoryTotal(page);
      const initialCount = await getAccountCount(page);

      // Add new account with 100,000 kr
      await addAccount(page, { name: 'Test Sparing', value: 100000 });

      // Verify account was added
      const newCount = await getAccountCount(page);
      expect(newCount).toBe(initialCount + 1);

      // Verify total increased by 100,000
      const newTotal = await getCategoryTotal(page);
      expect(newTotal).toBe(initialTotal + 100000);
    });

    test('adding gjeld account with value updates total correctly', async ({ page }) => {
      await navigateToWizardStep(page, 3); // Gjeld

      // Get initial total (negative value for debt)
      const initialTotal = await getCategoryTotal(page);
      const initialCount = await getAccountCount(page);

      // Add new gjeld account with 100,000 kr and loan details
      await addAccount(page, {
        name: 'Test Lån',
        value: 100000,
        interestRate: 5.0,
        remainingYears: 20,
      });

      // Verify account was added
      const newCount = await getAccountCount(page);
      expect(newCount).toBe(initialCount + 1);

      // Verify total: gjeld values are negative, so adding 100k makes it more negative
      // The UI shows gjeld as negative, so total should decrease by 100,000
      const newTotal = await getCategoryTotal(page);
      expect(newTotal).toBe(initialTotal - 100000);
    });

    test('adding pensjon account with value updates total correctly', async ({ page }) => {
      await navigateToWizardStep(page, 4); // Pensjon

      // Get initial total
      const initialTotal = await getCategoryTotal(page);
      const initialCount = await getAccountCount(page);

      // Add new pensjon account with 100,000 kr
      await addAccount(page, { name: 'Test Pensjon', value: 100000 });

      // Verify account was added
      const newCount = await getAccountCount(page);
      expect(newCount).toBe(initialCount + 1);

      // Verify total increased by 100,000
      const newTotal = await getCategoryTotal(page);
      expect(newTotal).toBe(initialTotal + 100000);
    });

    test('added account persists after saving wizard', async ({ page }) => {
      await navigateToWizardStep(page, 2); // Sparing

      // Get initial count
      const initialCount = await getAccountCount(page);

      // Add new account
      await addAccount(page, { name: 'Persistent Account', value: 50000 });

      // Verify account added locally
      let names = await getAccountNames(page);
      expect(names).toContain('Persistent Account');
      expect(await getAccountCount(page)).toBe(initialCount + 1);

      // Complete wizard (saves to backend)
      await completeWizard(page);

      // Navigate back to economy page (within same session, no re-login)
      await navigateToEconomy(page);
      await navigateToWizardStep(page, 2);

      // Verify account still exists after save
      names = await getAccountNames(page);
      expect(names).toContain('Persistent Account');
      expect(await getAccountCount(page)).toBe(initialCount + 1);
    });
  });

  test.describe('Removing Accounts', () => {
    test('can remove sparing account when multiple exist', async ({ page }) => {
      await navigateToWizardStep(page, 2); // Sparing

      const initialCount = await getAccountCount(page);
      expect(initialCount).toBeGreaterThan(1);

      // Get initial total
      const initialTotal = await getCategoryTotal(page);

      // Get the first account's value before deletion
      const firstItem = page.locator('.accounts-list__item').first();
      const valueInput = firstItem.locator('.accounts-list__value-row input');
      const valueText = await valueInput.inputValue();
      const accountValue = parseFloat(valueText.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;

      // Delete the first account
      const names = await getAccountNames(page);
      await deleteAccount(page, names[0]);

      // Verify account was removed
      const newCount = await getAccountCount(page);
      expect(newCount).toBe(initialCount - 1);

      // Verify total decreased by the account value
      const newTotal = await getCategoryTotal(page);
      expect(newTotal).toBe(initialTotal - accountValue);
    });

    test('cannot remove last account in category - delete disabled', async ({ page }) => {
      await navigateToWizardStep(page, 2); // Sparing

      // Delete accounts until only one remains
      let count = await getAccountCount(page);
      while (count > 1) {
        const names = await getAccountNames(page);
        await deleteAccount(page, names[0]);
        count = await getAccountCount(page);
      }

      // Verify delete button is disabled on last account
      const lastItem = page.locator('.accounts-list__item').first();
      const deleteBtn = lastItem.locator('button[aria-label^="Slett"]');
      await expect(deleteBtn).toBeDisabled();
    });

    test('can remove gjeld account and total updates', async ({ page }) => {
      await navigateToWizardStep(page, 3); // Gjeld

      const initialCount = await getAccountCount(page);
      const initialTotal = await getCategoryTotal(page);

      // Add an account first so we can delete one (50k more debt)
      await addAccount(page, {
        name: 'Temp Lån',
        value: 50000,
        interestRate: 4.0,
        remainingYears: 10,
      });

      const afterAddTotal = await getCategoryTotal(page);
      // Total should be more negative (more debt)
      expect(afterAddTotal).toBe(initialTotal - 50000);

      // Now delete it
      await deleteAccount(page, 'Temp Lån');

      // Verify total returned to initial
      const finalTotal = await getCategoryTotal(page);
      expect(finalTotal).toBe(initialTotal);
    });

    test('removed account is deleted from portfolio after save', async ({ page }) => {
      await navigateToWizardStep(page, 2); // Sparing

      // Add a new account
      await addAccount(page, { name: 'ToBeDeleted', value: 25000 });

      // Save and return
      await completeWizard(page);
      await navigateToEconomy(page);
      await navigateToWizardStep(page, 2);

      // Verify account exists
      let names = await getAccountNames(page);
      expect(names).toContain('ToBeDeleted');

      // Delete it
      await deleteAccount(page, 'ToBeDeleted');

      // Save and return
      await completeWizard(page);
      await navigateToEconomy(page);
      await navigateToWizardStep(page, 2);

      // Verify account is gone
      names = await getAccountNames(page);
      expect(names).not.toContain('ToBeDeleted');
    });
  });

  test.describe('Editing Accounts', () => {
    test('can edit account name', async ({ page }) => {
      await navigateToWizardStep(page, 2); // Sparing

      const names = await getAccountNames(page);
      const originalName = names[0];

      // Edit the name
      await editAccount(page, originalName, { name: 'Renamed Account' });

      // Verify name changed
      const newNames = await getAccountNames(page);
      expect(newNames).toContain('Renamed Account');
      expect(newNames).not.toContain(originalName);
    });

    test('can edit account value and total updates', async ({ page }) => {
      await navigateToWizardStep(page, 2); // Sparing

      const initialTotal = await getCategoryTotal(page);
      const names = await getAccountNames(page);

      // Get current value of first account
      const firstItem = page.locator('.accounts-list__item').first();
      const valueInput = firstItem.locator('.accounts-list__value-row input');
      const currentValue = parseFloat((await valueInput.inputValue()).replace(/[^\d,-]/g, '').replace(',', '.')) || 0;

      // Set new value
      const newValue = 200000;
      await editAccount(page, names[0], { value: newValue });

      // Verify total changed correctly
      const expectedTotal = initialTotal - currentValue + newValue;
      const newTotal = await getCategoryTotal(page);
      expect(newTotal).toBe(expectedTotal);
    });

    test('can toggle account inactive and visual state changes', async ({ page }) => {
      await navigateToWizardStep(page, 2); // Sparing

      // Add account with known value
      await addAccount(page, { name: 'ToggleTest', value: 75000 });

      // Toggle inactive
      await editAccount(page, 'ToggleTest', { isActive: false });

      // Verify visual change (item has inactive class)
      let item = await getAccountItemByName(page, 'ToggleTest');
      await expect(item).toHaveClass(/accounts-list__item--inactive/);

      // Toggle back to active
      await editAccount(page, 'ToggleTest', { isActive: true });

      // Verify visual change (item no longer has inactive class)
      item = await getAccountItemByName(page, 'ToggleTest');
      await expect(item).not.toHaveClass(/accounts-list__item--inactive/);
    });

    test('can edit gjeld interest rate', async ({ page }) => {
      await navigateToWizardStep(page, 3); // Gjeld

      const names = await getAccountNames(page);
      const item = await getAccountItemByName(page, names[0]);

      // Edit interest rate
      await editAccount(page, names[0], { interestRate: 6.5 });

      // Verify value updated
      const interestInput = item.locator('.accounts-list__loan-input').first();
      await expect(interestInput).toHaveValue('6.5');
    });

    test('can edit gjeld remaining years', async ({ page }) => {
      await navigateToWizardStep(page, 3); // Gjeld

      const names = await getAccountNames(page);
      const item = await getAccountItemByName(page, names[0]);

      // Edit remaining years
      await editAccount(page, names[0], { remainingYears: 15 });

      // Verify value updated
      const yearsInput = item.locator('.accounts-list__loan-input').nth(1);
      await expect(yearsInput).toHaveValue('15');
    });
  });

  test.describe('Validation', () => {
    test('shows error for empty account name on next', async ({ page }) => {
      await navigateToWizardStep(page, 2); // Sparing

      // Clear name of first account
      const names = await getAccountNames(page);
      await editAccount(page, names[0], { name: '' });

      // Try to go to next step
      const nextBtn = page.getByRole('button', { name: /neste/i });
      await nextBtn.click();

      // Should show error
      const hasNameError = await hasError(page, /navn/i);
      expect(hasNameError).toBe(true);
    });

    test('shows error for interest rate over 100%', async ({ page }) => {
      await navigateToWizardStep(page, 3); // Gjeld

      const names = await getAccountNames(page);
      await editAccount(page, names[0], { interestRate: 150 });

      // Try to go to next step
      const nextBtn = page.getByRole('button', { name: /neste/i });
      await nextBtn.click();

      // Should show error
      const hasRateError = await hasError(page, /rente/i);
      expect(hasRateError).toBe(true);
    });

    test('shows error for remaining years over 50', async ({ page }) => {
      await navigateToWizardStep(page, 3); // Gjeld

      const names = await getAccountNames(page);
      await editAccount(page, names[0], { remainingYears: 60 });

      // Try to go to next step
      const nextBtn = page.getByRole('button', { name: /neste/i });
      await nextBtn.click();

      // Should show error
      const hasYearsError = await hasError(page, /år/i);
      expect(hasYearsError).toBe(true);
    });

    test('validation error clears when input is fixed', async ({ page }) => {
      await navigateToWizardStep(page, 2); // Sparing

      // Clear name to trigger error
      const names = await getAccountNames(page);
      await editAccount(page, names[0], { name: '' });

      // Trigger validation
      const nextBtn = page.getByRole('button', { name: /neste/i });
      await nextBtn.click();

      // Verify error shown
      let hasNameError = await hasError(page, /navn/i);
      expect(hasNameError).toBe(true);

      // Fix the error
      const firstItem = page.locator('.accounts-list__item').first();
      const nameInput = firstItem.locator('.accounts-list__name-input');
      await nameInput.fill('Fixed Name');

      // Error should be cleared after fixing and clicking next
      await nextBtn.click();
      await page.waitForLoadState('networkidle');

      // Should be on next step now - verify we're on Gjeld step
      // Check that the wizard content heading shows "Gjeld"
      const wizardHeading = page.locator('.onboarding-wizard h1');
      await expect(wizardHeading).toContainText('Gjeld');
    });
  });

  test.describe('Data Persistence', () => {
    test('changes reflect in portfolio page after save', async ({ page }) => {
      await navigateToWizardStep(page, 2); // Sparing

      // Add unique account
      const uniqueName = 'PortfolioTest';
      await addAccount(page, { name: uniqueName, value: 123456 });

      // Complete wizard
      await completeWizard(page);

      // Go to portfolio page
      await page.goto('/portefolje');
      await page.waitForLoadState('networkidle');

      // Wait for the spreadsheet table to render (not just loading skeleton)
      const table = page.locator('.spreadsheet--desktop');
      await expect(table).toBeVisible({ timeout: 10000 });

      // The account should appear as a column header in the spreadsheet
      // Look for the account name in the second header row (column headers, not group headers)
      const columnHeader = page.locator('th', { hasText: uniqueName });
      await expect(columnHeader).toBeVisible({ timeout: 5000 });
    });

    test('changes survive page reload', async ({ page }) => {
      await navigateToWizardStep(page, 2); // Sparing

      // Add account
      await addAccount(page, { name: 'ReloadTest', value: 88888 });

      // Save
      await completeWizard(page);

      // Reload and go back
      await page.reload();
      await navigateToEconomy(page);
      await navigateToWizardStep(page, 2);

      // Verify account persisted
      const names = await getAccountNames(page);
      expect(names).toContain('ReloadTest');
    });
  });

  test.describe('Gjeld Value Handling', () => {
    test('gjeld values are shown as negative in wizard UI', async ({ page }) => {
      await navigateToWizardStep(page, 3); // Gjeld

      // Check that existing gjeld values are displayed as negative (debt)
      const firstItem = page.locator('.accounts-list__item').first();
      const valueInput = firstItem.locator('.accounts-list__value-row input');
      const value = await valueInput.inputValue();

      // Value should be negative (debt)
      const numValue = parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.'));
      expect(numValue).toBeLessThan(0);
    });

    test('gjeld total is negative (representing debt)', async ({ page }) => {
      await navigateToWizardStep(page, 3); // Gjeld

      // Total should be negative (debt)
      const total = await getCategoryTotal(page);
      expect(total).toBeLessThan(0);
    });

    test('new gjeld account value increases total debt correctly', async ({ page }) => {
      await navigateToWizardStep(page, 3); // Gjeld

      const initialTotal = await getCategoryTotal(page);

      // Add gjeld account (250k more debt)
      await addAccount(page, {
        name: 'ContributeTest',
        value: 250000,
        interestRate: 4.5,
        remainingYears: 20,
      });

      // Total should decrease by 250,000 (more negative = more debt)
      const newTotal = await getCategoryTotal(page);
      expect(newTotal).toBe(initialTotal - 250000);
    });
  });
});
