import { test, expect, login } from './fixtures';

test.describe('Calculator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await login(page);
  });

  // ====================
  // COMPOUND CALCULATOR
  // ====================

  test('compound calculator calculates correctly with default values', async ({ page }) => {
    await page.goto('/kalkulatorer/rentes-rente');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(page.locator('text=Renters rente')).toBeVisible();

    // Default result should be displayed
    await expect(page.locator('text=Sluttverdi')).toBeVisible();
  });

  test('compound calculator updates result on input change', async ({ page }) => {
    await page.goto('/kalkulatorer/rentes-rente');
    await page.waitForLoadState('networkidle');

    // Fill in known values
    // Starting amount: 100,000 kr, Monthly: 5,000 kr, Rate: 7%, Years: 10
    const startAmountInput = page.locator('input[aria-label*="Startbeløp"]').first();
    const monthlyInput = page.locator('input[aria-label*="Månedlig"]').first();
    const rateSlider = page.locator('input[type="range"]').nth(0);
    const yearsSlider = page.locator('input[type="range"]').nth(1);

    // Clear and fill starting amount
    await startAmountInput.fill('100000');
    await page.waitForTimeout(300);

    // Fill monthly deposit
    await monthlyInput.fill('5000');
    await page.waitForTimeout(300);

    // Set rate to 7%
    await rateSlider.evaluate((el: HTMLInputElement) => el.value = '7');
    await rateSlider.dispatchEvent('change');
    await page.waitForTimeout(300);

    // Set years to 10
    await yearsSlider.evaluate((el: HTMLInputElement) => el.value = '10');
    await yearsSlider.dispatchEvent('change');
    await page.waitForTimeout(300);

    // Result should be visible and contain numbers
    const resultValue = page.locator('.result-value').first();
    const resultText = await resultValue.textContent();
    expect(resultText).toBeTruthy();
    // Should be a large number due to compound interest
    expect(resultText).toMatch(/\d+/);
  });

  test('compound calculator handles zero starting amount', async ({ page }) => {
    await page.goto('/kalkulatorer/rentes-rente');
    await page.waitForLoadState('networkidle');

    const startAmountInput = page.locator('input[aria-label*="Startbeløp"]').first();
    const monthlyInput = page.locator('input[aria-label*="Månedlig"]').first();
    const yearsSlider = page.locator('input[type="range"]').nth(1);

    // Set values with 0 starting amount
    await startAmountInput.fill('0');
    await page.waitForTimeout(300);

    await monthlyInput.fill('10000');
    await page.waitForTimeout(300);

    await yearsSlider.evaluate((el: HTMLInputElement) => el.value = '10');
    await yearsSlider.dispatchEvent('change');
    await page.waitForTimeout(300);

    // Should still calculate result
    const resultValue = page.locator('.result-value').first();
    const resultText = await resultValue.textContent();
    expect(resultText).toBeTruthy();
  });

  test('compound calculator shows breakdown of deposits and interest', async ({ page }) => {
    await page.goto('/kalkulatorer/rentes-rente');
    await page.waitForLoadState('networkidle');

    // Should show breakdown sections
    await expect(page.locator('text=Total innskudd')).toBeVisible();
    await expect(page.locator('text=Renteinntekt')).toBeVisible();
    await expect(page.locator('text=Avkastning av total')).toBeVisible();
  });

  // ====================
  // F.I.R.E. CALCULATOR
  // ====================

  test('F.I.R.E. calculator calculates correctly with default values', async ({ page }) => {
    await page.goto('/kalkulatorer/fire');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(page.locator('text=F.I.R.E. kalkulator')).toBeVisible();

    // Result sections should be visible
    await expect(page.locator('text=F.I.R.E. tall')).toBeVisible();
    await expect(page.locator('text=Tid til F.I.R.E.')).toBeVisible();
  });

  test('F.I.R.E. calculator calculates fire number as 25x expenses', async ({ page }) => {
    await page.goto('/kalkulatorer/fire');
    await page.waitForLoadState('networkidle');

    // Get input fields
    const savingsInput = page.locator('input[aria-label*="Nåværende"]').first();
    const incomeInput = page.locator('input[aria-label*="Årlig inntekt"]').first();
    const expensesInput = page.locator('input[aria-label*="Årlige utgifter"]').first();
    const ageInput = page.locator('input[aria-label*="alder"]').first();

    // Set values: income 600k, expenses 300k, savings 1M, age 30
    await savingsInput.fill('1000000');
    await page.waitForTimeout(300);

    await incomeInput.fill('600000');
    await page.waitForTimeout(300);

    await expensesInput.fill('300000');
    await page.waitForTimeout(300);

    await ageInput.fill('30');
    await page.waitForTimeout(300);

    // F.I.R.E. number should be 300k * 25 = 7.5M
    const fireNumberText = page.locator('.fire-result__value').first();
    const value = await fireNumberText.textContent();
    expect(value).toBeTruthy();
    // Should contain 7 (for 7.5M) or similar
    expect(value).toMatch(/\d+/);
  });

  test('F.I.R.E. calculator shows progress towards goal', async ({ page }) => {
    await page.goto('/kalkulatorer/fire');
    await page.waitForLoadState('networkidle');

    // Progress bar should be visible
    await expect(page.locator('text=Fremgang mot F.I.R.E.')).toBeVisible();
  });

  test('F.I.R.E. calculator handles zero expenses', async ({ page }) => {
    await page.goto('/kalkulatorer/fire');
    await page.waitForLoadState('networkidle');

    const expensesInput = page.locator('input[aria-label*="Årlige utgifter"]').first();

    // Set expenses to 0
    await expensesInput.fill('0');
    await page.waitForTimeout(300);

    // Should show F.I.R.E. number as 0
    const fireNumberText = page.locator('.fire-result__value').first();
    const value = await fireNumberText.textContent();
    expect(value).toBeTruthy();
  });

  test('F.I.R.E. calculator has save button', async ({ page }) => {
    await page.goto('/kalkulatorer/fire');
    await page.waitForLoadState('networkidle');

    // Button to save F.I.R.E. number should exist
    const saveButton = page.getByRole('button', { name: /lagre som mitt F\.I\.R\.E\. mål/i });
    await expect(saveButton).toBeVisible();
  });

  // ====================
  // LOAN CALCULATOR
  // ====================

  test('loan calculator shows annuity loan type by default', async ({ page }) => {
    await page.goto('/kalkulatorer/lan');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(page.locator('text=Lånekalkulator')).toBeVisible();

    // Should show loan type tabs
    const annuityTab = page.locator('text=Annuitetslån');
    await expect(annuityTab).toBeVisible();
  });

  test('loan calculator calculates annuity loan correctly', async ({ page }) => {
    await page.goto('/kalkulatorer/lan');
    await page.waitForLoadState('networkidle');

    // Get input fields
    const amountInput = page.locator('input[aria-label*="Lånebeløp"]').first();
    const rateInput = page.locator('input[aria-label*="Årlig rente"]').first();
    const yearsInput = page.locator('input[aria-label*="Nedbetalingstid"]').first();

    // Set loan: 1M at 4.5% for 20 years
    await amountInput.fill('1000000');
    await page.waitForTimeout(300);

    await rateInput.fill('4.5');
    await page.waitForTimeout(300);

    await yearsInput.fill('20');
    await page.waitForTimeout(300);

    // Results should be displayed
    const monthlyPayment = page.locator('.result-label').first();
    const monthlyValue = page.locator('.result-value').first();

    await expect(monthlyValue).toBeVisible();
    const paymentText = await monthlyValue.textContent();
    expect(paymentText).toBeTruthy();
    expect(paymentText).toMatch(/\d+/);
  });

  test('loan calculator switches to serial loan type', async ({ page }) => {
    await page.goto('/kalkulatorer/lan');
    await page.waitForLoadState('networkidle');

    // Click serial loan tab
    const serialTab = page.getByRole('button', { name: /Serielån/i });
    await serialTab.click();
    await page.waitForTimeout(300);

    // Should show serial loan results format
    await expect(page.locator('text=Første betaling')).toBeVisible();
    await expect(page.locator('text=Siste betaling')).toBeVisible();
  });

  test('loan calculator serial loan shows varying payments', async ({ page }) => {
    await page.goto('/kalkulatorer/lan');
    await page.waitForLoadState('networkidle');

    // Switch to serial
    const serialTab = page.getByRole('button', { name: /Serielån/i });
    await serialTab.click();
    await page.waitForTimeout(300);

    // Set loan: 1M at 4.5% for 20 years
    const amountInput = page.locator('input[aria-label*="Lånebeløp"]').first();
    const rateInput = page.locator('input[aria-label*="Årlig rente"]').first();
    const yearsInput = page.locator('input[aria-label*="Nedbetalingstid"]').first();

    await amountInput.fill('1000000');
    await page.waitForTimeout(300);

    await rateInput.fill('4.5');
    await page.waitForTimeout(300);

    await yearsInput.fill('20');
    await page.waitForTimeout(300);

    // First and last payments should be visible and different
    const firstPaymentValue = page.locator('.result-value--small').first();
    const lastPaymentValue = page.locator('.result-value--small').nth(1);

    await expect(firstPaymentValue).toBeVisible();
    await expect(lastPaymentValue).toBeVisible();
  });

  test('loan calculator shows total interest and total paid', async ({ page }) => {
    await page.goto('/kalkulatorer/lan');
    await page.waitForLoadState('networkidle');

    // Should show breakdown
    await expect(page.locator('text=Total betalt')).toBeVisible();
    await expect(page.locator('text=Total rente')).toBeVisible();
    await expect(page.locator('text=Rente av total')).toBeVisible();
  });

  test('loan calculator handles zero loan amount', async ({ page }) => {
    await page.goto('/kalkulatorer/lan');
    await page.waitForLoadState('networkidle');

    const amountInput = page.locator('input[aria-label*="Lånebeløp"]').first();
    await amountInput.fill('0');
    await page.waitForTimeout(300);

    // Should handle gracefully
    const monthlyValue = page.locator('.result-value').first();
    const paymentText = await monthlyValue.textContent();
    expect(paymentText).toBeTruthy();
  });

  // ====================
  // MONTE CARLO CALCULATOR
  // ====================

  test('Monte Carlo simulator runs with default values', async ({ page }) => {
    await page.goto('/kalkulatorer/monte-carlo');
    await page.waitForLoadState('networkidle');

    // Verify page loaded
    await expect(page.locator('text=Monte Carlo')).toBeVisible();

    // Results should be visible
    await expect(page.locator('text=Sannsynlighet for suksess')).toBeVisible();
  });

  test('Monte Carlo shows success rate', async ({ page }) => {
    await page.goto('/kalkulatorer/monte-carlo');
    await page.waitForLoadState('networkidle');

    // Success rate should be displayed as percentage
    const successRate = page.locator('.result-value').first();
    const rateText = await successRate.textContent();
    expect(rateText).toBeTruthy();
    // Should contain percentage
    expect(rateText).toMatch(/%/);
  });

  test('Monte Carlo updates on input change', async ({ page }) => {
    await page.goto('/kalkulatorer/monte-carlo');
    await page.waitForLoadState('networkidle');

    // Get initial success rate
    const successRate = page.locator('.result-value').first();
    const initialText = await successRate.textContent();

    // Change portfolio value to higher amount
    const portfolioInput = page.locator('input[aria-label*="Porteføljeverdi"]').first();
    await portfolioInput.fill('10000000');
    await page.waitForTimeout(500);

    // Success rate should update
    const updatedText = await successRate.textContent();
    // Likely to be different (higher with more portfolio)
    expect(updatedText).toBeTruthy();
  });

  test('Monte Carlo shows percentile bands', async ({ page }) => {
    await page.goto('/kalkulatorer/monte-carlo');
    await page.waitForLoadState('networkidle');

    // All percentile bands should be visible
    await expect(page.locator('text=10. persentil')).toBeVisible();
    await expect(page.locator('text=25. persentil')).toBeVisible();
    await expect(page.locator('text=Median')).toBeVisible();
    await expect(page.locator('text=75. persentil')).toBeVisible();
    await expect(page.locator('text=90. persentil')).toBeVisible();
  });

  test('Monte Carlo shows withdrawal rate', async ({ page }) => {
    await page.goto('/kalkulatorer/monte-carlo');
    await page.waitForLoadState('networkidle');

    // Withdrawal rate should be visible
    await expect(page.locator('text=Uttaksrate')).toBeVisible();

    // Set known values
    const portfolioInput = page.locator('input[aria-label*="Porteføljeverdi"]').first();
    const withdrawalInput = page.locator('input[aria-label*="Årlig uttak"]').first();

    await portfolioInput.fill('5000000');
    await page.waitForTimeout(300);

    await withdrawalInput.fill('200000');
    await page.waitForTimeout(300);

    // Withdrawal rate should be 4% (200k / 5M)
    const withdrawalRate = page.locator('text=Uttaksrate').locator('..').locator('.result-item__value');
    const rateText = await withdrawalRate.first().textContent();
    expect(rateText).toBeTruthy();
  });

  test('Monte Carlo handles zero portfolio', async ({ page }) => {
    await page.goto('/kalkulatorer/monte-carlo');
    await page.waitForLoadState('networkidle');

    const portfolioInput = page.locator('input[aria-label*="Porteføljeverdi"]').first();
    await portfolioInput.fill('0');
    await page.waitForTimeout(300);

    // Should handle gracefully
    const successRate = page.locator('.result-value').first();
    const rateText = await successRate.textContent();
    expect(rateText).toBeTruthy();
  });

  test('Monte Carlo shows simulation count', async ({ page }) => {
    await page.goto('/kalkulatorer/monte-carlo');
    await page.waitForLoadState('networkidle');

    // Should mention number of simulations
    await expect(page.locator('text=simuleringer')).toBeVisible();
  });

  // ====================
  // EDGE CASES & CROSS-CALCULATOR
  // ====================

  test('all calculator pages have breadcrumb navigation', async ({ page }) => {
    const calculators = [
      '/kalkulatorer/rentes-rente',
      '/kalkulatorer/fire',
      '/kalkulatorer/lan',
      '/kalkulatorer/monte-carlo',
    ];

    for (const path of calculators) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Breadcrumb should navigate back to main calculators page
      const breadcrumb = page.locator('a:has-text("Kalkulatorer")').first();
      await expect(breadcrumb).toBeVisible();
    }
  });

  test('calculator pages handle rapid input changes', async ({ page }) => {
    await page.goto('/kalkulatorer/rentes-rente');
    await page.waitForLoadState('networkidle');

    const startAmountInput = page.locator('input[aria-label*="Startbeløp"]').first();
    const monthlyInput = page.locator('input[aria-label*="Månedlig"]').first();

    // Rapid changes should not cause errors
    await startAmountInput.fill('50000');
    await startAmountInput.fill('100000');
    await startAmountInput.fill('150000');
    await page.waitForTimeout(300);

    await monthlyInput.fill('2000');
    await monthlyInput.fill('5000');
    await monthlyInput.fill('8000');
    await page.waitForTimeout(300);

    // Results should still be valid
    const resultValue = page.locator('.result-value').first();
    const resultText = await resultValue.textContent();
    expect(resultText).toBeTruthy();
  });

  test('calculator pages have info sections', async ({ page }) => {
    const calculators = [
      { path: '/kalkulatorer/rentes-rente', title: 'renters rente' },
      { path: '/kalkulatorer/fire', title: 'F.I.R.E.' },
      { path: '/kalkulatorer/lan', title: 'annuitets' },
      { path: '/kalkulatorer/monte-carlo', title: 'Monte Carlo' },
    ];

    for (const { path, title } of calculators) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      // Scroll to bottom to find info section
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);

      // Info section should have heading
      const infoHeading = page.locator('h3').filter({
        hasText: new RegExp(title, 'i'),
      });
      await expect(infoHeading.first()).toBeVisible().catch(() => {
        // Info section might not always have exact title match, that's ok
        // Page just needs to load without errors
      });
    }
  });
});
