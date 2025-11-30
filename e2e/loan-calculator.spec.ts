import { test, expect } from '@playwright/test';

test('Loan Calculator Page - take screenshot', async ({ page }) => {
  // Navigate to the loan calculator page
  await page.goto('http://localhost:5176/kalkulatorer/loan');
  await page.waitForLoadState('networkidle');

  // Wait a bit for animations to complete
  await page.waitForTimeout(1000);

  // Take full page screenshot
  await page.screenshot({
    path: 'screenshots/loan-calculator-full.png',
    fullPage: true
  });

  // Take viewport screenshot
  await page.screenshot({
    path: 'screenshots/loan-calculator-viewport.png'
  });

  // Verify page loads correctly (basic checks)
  const bodyText = await page.locator('body').textContent();

  // Check key elements exist
  expect(bodyText).toContain('Lånekalkulator');
  expect(bodyText).toContain('Lånebeløp');
  expect(bodyText).toContain('Månedlig betaling');
  expect(bodyText).toContain('16 674'); // Default monthly payment
  expect(bodyText).toContain('Avdragsprofil');

  console.log('✅ Screenshot saved to screenshots/loan-calculator-full.png');
  console.log('✅ All key elements verified');
});
