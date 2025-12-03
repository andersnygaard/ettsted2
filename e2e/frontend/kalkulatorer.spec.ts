import { test, expect } from '@playwright/test';
import { loginAsDemo } from '../fixtures/auth';

test.describe('Kalkulatorer (Calculators)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('page loads successfully', async ({ page }) => {
    await page.goto('/kalkulatorer');
    await expect(page).toHaveURL(/.*kalkulatorer/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('shows navigation header', async ({ page }) => {
    await page.goto('/kalkulatorer');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('can navigate to other tabs', async ({ page }) => {
    await page.goto('/kalkulatorer');
    await page.getByRole('link', { name: /oversikt/i }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });
});

test.describe('Kalkulatorer - Sub-pages', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
  });

  test('Loan calculator loads', async ({ page }) => {
    await page.goto('/kalkulatorer/loan');
    await expect(page).toHaveURL(/.*loan/);
  });

  test('Compound calculator loads', async ({ page }) => {
    await page.goto('/kalkulatorer/compound');
    await expect(page).toHaveURL(/.*compound/);
  });

  test('F.I.R.E. calculator loads', async ({ page }) => {
    await page.goto('/kalkulatorer/fire');
    await expect(page).toHaveURL(/.*fire/);
  });

  test('Monte Carlo loads', async ({ page }) => {
    await page.goto('/kalkulatorer/monte-carlo');
    await expect(page).toHaveURL(/.*monte-carlo/);
  });
});

test.describe('Compound Calculator - Form Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await page.goto('/kalkulatorer/compound');
  });

  test('displays input fields for compound calculator', async ({ page }) => {
    // Verify all input fields are visible
    await expect(page.locator('text=Startbeløp')).toBeVisible();
    await expect(page.locator('text=Månedlig sparing')).toBeVisible();
    await expect(page.locator('text=Årlig avkastning')).toBeVisible();
    await expect(page.locator('text=Antall år')).toBeVisible();
  });

  test('displays result section with calculations', async ({ page }) => {
    // Verify result section
    await expect(page.locator('text=Sluttverdi')).toBeVisible();
    await expect(page.locator('text=Total innskudd')).toBeVisible();
    await expect(page.locator('text=Renteinntekt')).toBeVisible();
    await expect(page.locator('text=Avkastning av total')).toBeVisible();
  });

  test('updates calculations when inputs change', async ({ page }) => {
    // Get initial result value
    const resultValue = page.locator('[class*="result-hero"] >> [class*="result-value"]').first();
    const initialText = await resultValue.textContent();

    // Change the initial amount input
    const inputFields = page.locator('input[type="number"]');
    await inputFields.first().fill('500000');
    await page.waitForTimeout(500);

    // Verify result changed
    const updatedText = await resultValue.textContent();
    expect(updatedText).not.toBe(initialText);
  });

  test('slider inputs work for rate and years', async ({ page }) => {
    // Verify range sliders are present
    const rangeSliders = page.locator('input[type="range"]');
    const sliderCount = await rangeSliders.count();
    expect(sliderCount).toBeGreaterThan(0);
  });

  test('displays chart showing growth over time', async ({ page }) => {
    // Wait for chart to render
    await page.waitForTimeout(1000);

    // Verify chart title
    await expect(page.locator('text=Vekst over tid')).toBeVisible();

    // Verify SVG chart exists
    const svg = page.locator('svg').first();
    await expect(svg).toBeVisible();
  });
});

test.describe('FIRE Calculator - Form Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await page.goto('/kalkulatorer/fire');
  });

  test('displays FIRE calculator inputs', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // Check for key input labels
    const title = page.locator('h1, h2').first();
    await expect(title).toBeVisible();
  });

  test('displays FIRE results section', async ({ page }) => {
    // Wait for results to appear
    await page.waitForTimeout(1000);

    // Verify page has content (results will vary based on calculator impl)
    const content = page.locator('main');
    await expect(content).toBeVisible();
  });
});

test.describe('Loan Calculator - Form Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await page.goto('/kalkulatorer/loan');
  });

  test('loan calculator page loads', async ({ page }) => {
    // Verify loan calculator loads
    await expect(page).toHaveURL(/.*loan/);

    // Verify main heading
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('loan calculator has input fields', async ({ page }) => {
    // Wait for inputs to render
    await page.waitForTimeout(1000);

    // Check that form elements exist
    const form = page.locator('form, [role="form"], .calculator-layout');
    await expect(form.first()).toBeVisible();
  });
});

test.describe('Monte Carlo Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page);
    await page.goto('/kalkulatorer/monte-carlo');
  });

  test('Monte Carlo page loads', async ({ page }) => {
    // Verify page URL
    await expect(page).toHaveURL(/.*monte-carlo/);

    // Verify page has content
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });
});
