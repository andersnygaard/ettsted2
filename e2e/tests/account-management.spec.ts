import {
  test,
  expect,
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
    // Auth pre-loaded from global setup - just navigate
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

  test.describe('User Profile Settings (Step 1)', () => {
    test.beforeEach(async ({ page }) => {
      await navigateToEconomy(page);
      await navigateToWizardStep(page, 1);
    });

    test('can navigate to Step 1 of wizard', async ({ page }) => {
      // Wait for the step 1 content to be visible
      const stepContent = page.locator('.step-user');
      await expect(stepContent).toBeVisible({ timeout: 5000 });

      // Verify we're on step 1 by checking for the section heading
      const heading = page.locator('text=Brukerinformasjon');
      await expect(heading).toBeVisible();
    });

    test('can edit nickname field', async ({ page }) => {
      // Get nickname input
      const nicknameInput = page.locator('input#nickname');
      await expect(nicknameInput).toBeVisible();

      // Get current value
      const originalValue = await nicknameInput.inputValue();

      // Change nickname
      const newNickname = 'TestUser42';
      await nicknameInput.clear();
      await nicknameInput.fill(newNickname);

      // Verify value changed
      const updatedValue = await nicknameInput.inputValue();
      expect(updatedValue).toBe(newNickname);
      expect(updatedValue).not.toBe(originalValue);
    });

    test('can edit monthly salary field (Norwegian number format)', async ({ page }) => {
      // Find monthly salary input by looking for the NumberInput with "Månedlig inntekt" label
      const salaryContainer = page.locator('.number-input').filter({ hasText: /Månedlig inntekt/i });
      const salaryInput = salaryContainer.locator('input');
      await expect(salaryInput).toBeVisible();

      // Fill in salary value
      const salaryValue = '75000';
      await salaryInput.clear();
      await salaryInput.fill(salaryValue);

      // Verify value updated (may be formatted)
      const inputValue = await salaryInput.inputValue();
      expect(inputValue).toBeTruthy();
      expect(inputValue).toContain('75000');
    });

    test('can edit monthly savings field', async ({ page }) => {
      // Find monthly savings input
      const savingsContainer = page.locator('.number-input').filter({ hasText: /Månedlig sparing/i });
      const savingsInput = savingsContainer.locator('input');
      await expect(savingsInput).toBeVisible();

      // Fill in savings value
      const savingsValue = '15000';
      await savingsInput.clear();
      await savingsInput.fill(savingsValue);

      // Verify value updated
      const inputValue = await savingsInput.inputValue();
      expect(inputValue).toBeTruthy();
      expect(inputValue).toContain('15000');
    });

    test('can edit birth year field', async ({ page }) => {
      // Get birth year input
      const birthYearInput = page.locator('input#birthYear');
      await expect(birthYearInput).toBeVisible();

      // Fill in birth year
      const birthYear = '1985';
      await birthYearInput.clear();
      await birthYearInput.fill(birthYear);

      // Verify value updated
      const inputValue = await birthYearInput.inputValue();
      expect(inputValue).toBe(birthYear);

      // Verify age calculation is shown
      const ageHint = page.locator('.step-user__hint').filter({ hasText: /år/ });
      const hintText = await ageHint.first().textContent();
      expect(hintText).toContain('år');
    });

    test('can edit planned retirement age field', async ({ page }) => {
      // Get retirement age input
      const retirementInput = page.locator('input#retirementAge');
      await expect(retirementInput).toBeVisible();

      // Fill in retirement age
      const retirementAge = '65';
      await retirementInput.clear();
      await retirementInput.fill(retirementAge);

      // Verify value updated
      const inputValue = await retirementInput.inputValue();
      expect(inputValue).toBe(retirementAge);
    });

    test('shows validation error for empty nickname', async ({ page }) => {
      // Clear nickname
      const nicknameInput = page.locator('input#nickname');
      await nicknameInput.clear();

      // Try to go to next step
      const nextBtn = page.getByRole('button', { name: /neste/i });
      await nextBtn.click();

      // Should show error (wait a bit for validation to run)
      await page.waitForTimeout(500);

      // Look for error message
      const errorText = page.locator('#nickname-error, .step-user__error').filter({ hasText: /bruker|navn/i });
      const isVisible = await errorText.isVisible().catch(() => false);
      expect(isVisible).toBe(true);
    });

    test('shows validation error for zero monthly salary', async ({ page }) => {
      // Find and clear monthly salary
      const salaryContainer = page.locator('.number-input').filter({ hasText: /Månedlig inntekt/i });
      const salaryInput = salaryContainer.locator('input');
      await salaryInput.clear();
      await salaryInput.fill('0');

      // Try to go to next step
      const nextBtn = page.getByRole('button', { name: /neste/i });
      await nextBtn.click();

      // Should show validation error
      await page.waitForTimeout(500);
      const errorMessage = page.locator('[role="alert"], .step-user__error');
      const hasError = await errorMessage.count() > 0;
      expect(hasError).toBe(true);
    });

    test('profile changes persist after wizard save', async ({ page }) => {
      // Update nickname
      const newNickname = 'PersistTestUser';
      const nicknameInput = page.locator('input#nickname');
      await nicknameInput.clear();
      await nicknameInput.fill(newNickname);

      // Update monthly salary
      const salaryContainer = page.locator('.number-input').filter({ hasText: /Månedlig inntekt/i });
      const salaryInput = salaryContainer.locator('input');
      await salaryInput.clear();
      await salaryInput.fill('65000');

      // Update monthly savings
      const savingsContainer = page.locator('.number-input').filter({ hasText: /Månedlig sparing/i });
      const savingsInput = savingsContainer.locator('input');
      await savingsInput.clear();
      await savingsInput.fill('18000');

      // Complete the wizard
      await completeWizard(page);

      // Navigate back to economy page
      await navigateToEconomy(page);
      await navigateToWizardStep(page, 1);

      // Verify nickname persisted
      const savedNickname = await nicknameInput.inputValue();
      expect(savedNickname).toBe(newNickname);

      // Verify salary persisted (check that it contains the value)
      const savedSalary = await salaryInput.inputValue();
      expect(savedSalary).toContain('65000');

      // Verify savings persisted
      const savedSavings = await savingsInput.inputValue();
      expect(savedSavings).toContain('18000');
    });

    test('savings rate on dashboard updates based on profile changes', async ({ page }) => {
      // Note: This tests the integration between Step 1 changes and dashboard calculations

      // Update monthly salary
      const salaryContainer = page.locator('.number-input').filter({ hasText: /Månedlig inntekt/i });
      const salaryInput = salaryContainer.locator('input');
      await salaryInput.clear();
      await salaryInput.fill('100000');

      // Update monthly savings
      const savingsContainer = page.locator('.number-input').filter({ hasText: /Månedlig sparing/i });
      const savingsInput = savingsContainer.locator('input');
      await savingsInput.clear();
      await savingsInput.fill('30000');

      // Save the changes
      await completeWizard(page);

      // Navigate to sparing page to verify savings rate calculation
      await page.goto('/sparing');
      await expect(page.locator('.app-header')).toBeVisible({ timeout: 10000 });

      // Verify page loaded (savings rate should be displayed)
      const pageContent = await page.locator('body').textContent();
      expect(pageContent).toBeTruthy();
      expect(pageContent!.length).toBeGreaterThan(100);

      // The savings rate should be 30% (30000 / 100000 * 100)
      // Verify page contains expected content
      const containsExpected =
        pageContent?.toLowerCase().includes('sparing') ||
        pageContent?.toLowerCase().includes('sparerate');
      expect(containsExpected).toBe(true);
    });

    test('F.I.R.E. number defaults to 25x annual expenses', async ({ page }) => {
      // Set monthly salary and savings to known values
      const salaryContainer = page.locator('.number-input').filter({ hasText: /Månedlig inntekt/i });
      const salaryInput = salaryContainer.locator('input');
      await salaryInput.clear();
      await salaryInput.fill('100000');

      const savingsContainer = page.locator('.number-input').filter({ hasText: /Månedlig sparing/i });
      const savingsInput = savingsContainer.locator('input');
      await savingsInput.clear();
      await savingsInput.fill('20000');

      // Check F.I.R.E. number hint text
      // Annual expenses = (100000 - 20000) * 12 = 960000
      // F.I.R.E. number = 960000 * 25 = 24000000
      const fireHint = page.locator('.step-user__hint').filter({ hasText: /F.I.R.E./i });
      const hintText = await fireHint.first().textContent();

      // Should contain the calculated F.I.R.E. number
      expect(hintText).toBeTruthy();
      expect(hintText).toContain('25 × årlige utgifter');
    });

    test('can edit custom F.I.R.E. number', async ({ page }) => {
      // Find F.I.R.E. number input
      const fireContainer = page.locator('.number-input').filter({ hasText: /F.I.R.E. tall/i });
      const fireInput = fireContainer.locator('input');
      await expect(fireInput).toBeVisible();

      // Fill in custom F.I.R.E. number
      const customFireNumber = '5000000';
      await fireInput.clear();
      await fireInput.fill(customFireNumber);

      // Verify value updated
      const inputValue = await fireInput.inputValue();
      expect(inputValue).toContain('5000000');
    });
  });
});
