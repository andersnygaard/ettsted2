import { test, expect, login, PROTECTED_PAGES } from './fixtures';
import { MOBILE_VIEWPORTS, MIN_TOUCH_TARGET } from '../fixtures/mobile-viewports';

/**
 * Mobile Responsive Tests
 * Validates responsive layouts on key pages across different viewport sizes
 */
test.describe('Mobile Responsive', () => {
  for (const viewport of MOBILE_VIEWPORTS) {
    test.describe(`${viewport.description}`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      test.beforeEach(async ({ page }) => {
        // Clear auth state first to ensure clean start, then login
        await page.goto('/');
        await page.evaluate(() => {
          localStorage.removeItem('finans_demo_token');
          localStorage.setItem('finans_dev_logout', 'true');
        });
        await login(page);
      });

      // ========== No Horizontal Scroll Tests ==========

      test('Dashboard (Oversikt) - no horizontal scroll', async ({ page }) => {
        await page.goto('/oversikt');
        await page.waitForLoadState('networkidle');

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.body.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll, 'Page should not have horizontal scroll').toBe(false);
      });

      test('Portfolio (Portefølje) - no horizontal scroll', async ({ page }) => {
        await page.goto('/portefolje');
        await page.waitForLoadState('networkidle');

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.body.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll, 'Page should not have horizontal scroll').toBe(false);
      });

      test('Savings (Sparing) - no horizontal scroll', async ({ page }) => {
        await page.goto('/sparing');
        await page.waitForLoadState('networkidle');

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.body.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll, 'Page should not have horizontal scroll').toBe(false);
      });

      test('Debt (Gjeld) - no horizontal scroll', async ({ page }) => {
        await page.goto('/gjeld');
        await page.waitForLoadState('networkidle');

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.body.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll, 'Page should not have horizontal scroll').toBe(false);
      });

      test('Pension (Pensjon) - no horizontal scroll', async ({ page }) => {
        await page.goto('/pensjon');
        await page.waitForLoadState('networkidle');

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.body.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll, 'Page should not have horizontal scroll').toBe(false);
      });

      test('Calculators (Kalkulatorer) - no horizontal scroll', async ({ page }) => {
        await page.goto('/kalkulatorer');
        await page.waitForLoadState('networkidle');

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.body.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll, 'Page should not have horizontal scroll').toBe(false);
      });

      test('Import (Importer data) - no horizontal scroll', async ({ page }) => {
        await page.goto('/import');
        await page.waitForLoadState('networkidle');

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.body.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll, 'Page should not have horizontal scroll').toBe(false);
      });

      test('Settings (Min Økonomi) - no horizontal scroll', async ({ page }) => {
        await page.goto('/min-okonomi');
        await page.waitForLoadState('networkidle');

        const hasHorizontalScroll = await page.evaluate(() => {
          return document.body.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll, 'Page should not have horizontal scroll').toBe(false);
      });

      // ========== Touch Target Size Tests ==========

      test('Dashboard - interactive elements have minimum 44px touch target', async ({ page }) => {
        await page.goto('/oversikt');
        await page.waitForLoadState('networkidle');

        const buttons = page.locator('button');
        const buttonCount = await buttons.count();

        for (let i = 0; i < buttonCount; i++) {
          const button = buttons.nth(i);
          const isVisible = await button.isVisible().catch(() => false);

          if (isVisible) {
            const box = await button.boundingBox();
            if (box) {
              expect(box.height, `Button ${i} should have min height of ${MIN_TOUCH_TARGET}px`).toBeGreaterThanOrEqual(
                MIN_TOUCH_TARGET
              );
            }
          }
        }
      });

      test('Portfolio - interactive elements have minimum 44px touch target', async ({ page }) => {
        await page.goto('/portefolje');
        await page.waitForLoadState('networkidle');

        const buttons = page.locator('button');
        const buttonCount = await buttons.count();

        for (let i = 0; i < buttonCount; i++) {
          const button = buttons.nth(i);
          const isVisible = await button.isVisible().catch(() => false);

          if (isVisible) {
            const box = await button.boundingBox();
            if (box) {
              expect(box.height, `Button ${i} should have min height of ${MIN_TOUCH_TARGET}px`).toBeGreaterThanOrEqual(
                MIN_TOUCH_TARGET
              );
            }
          }
        }
      });

      test('Import - interactive elements have minimum 44px touch target', async ({ page }) => {
        await page.goto('/import');
        await page.waitForLoadState('networkidle');

        const buttons = page.locator('button');
        const buttonCount = await buttons.count();

        for (let i = 0; i < buttonCount; i++) {
          const button = buttons.nth(i);
          const isVisible = await button.isVisible().catch(() => false);

          if (isVisible) {
            const box = await button.boundingBox();
            if (box) {
              expect(box.height, `Button ${i} should have min height of ${MIN_TOUCH_TARGET}px`).toBeGreaterThanOrEqual(
                MIN_TOUCH_TARGET
              );
            }
          }
        }
      });

      // ========== Mobile Menu Tests ==========

      test('Mobile menu can be opened', async ({ page }) => {
        await page.goto('/oversikt');
        await page.waitForLoadState('networkidle');

        // Find hamburger menu button
        const hamburger = page.getByRole('button', { name: /åpne meny/i });
        const isMenuVisible = await hamburger.isVisible().catch(() => false);

        if (isMenuVisible) {
          await hamburger.click();

          // Menu should appear (mobile menu uses role="dialog")
          const mobileMenu = page.locator('[role="dialog"][aria-label="Navigasjonsmeny"]');
          await expect(mobileMenu).toBeVisible({ timeout: 5000 });
        }
      });

      test('Mobile menu navigation items have adequate size', async ({ page }) => {
        await page.goto('/oversikt');
        await page.waitForLoadState('networkidle');

        const hamburger = page.getByRole('button', { name: /åpne meny/i });
        const isMenuVisible = await hamburger.isVisible().catch(() => false);

        if (isMenuVisible) {
          await hamburger.click();

          // Wait for menu to appear
          await page.waitForTimeout(300);

          // Check navigation items size (mobile menu uses role="dialog")
          const navItems = page.locator('[role="dialog"] .app-header__mobile-nav-item');
          const itemCount = await navItems.count();

          for (let i = 0; i < itemCount; i++) {
            const item = navItems.nth(i);
            const isVisible = await item.isVisible().catch(() => false);

            if (isVisible) {
              const box = await item.boundingBox();
              if (box) {
                expect(
                  box.height,
                  `Nav item ${i} should have min height of ${MIN_TOUCH_TARGET}px`
                ).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET);
              }
            }
          }
        }
      });

      // ========== Form Input Tests ==========

      test('Form inputs have adequate size on mobile', async ({ page }) => {
        await page.goto('/min-okonomi');
        await page.waitForLoadState('networkidle');

        const inputs = page.locator('input, select, textarea');
        const inputCount = await inputs.count();

        for (let i = 0; i < Math.min(inputCount, 10); i++) {
          const input = inputs.nth(i);
          const isVisible = await input.isVisible().catch(() => false);

          if (isVisible) {
            const box = await input.boundingBox();
            if (box && box.height > 0) {
              expect(
                box.height,
                `Input ${i} should have min height of ${MIN_TOUCH_TARGET}px`
              ).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET);
            }
          }
        }
      });

      // ========== Text Readability Tests ==========

      test('Page content is readable without horizontal scroll', async ({ page }) => {
        await page.goto('/oversikt');
        await page.waitForLoadState('networkidle');

        // Check that main content fits within viewport
        const mainContent = page.locator('main, [role="main"]').first();
        const isVisible = await mainContent.isVisible().catch(() => false);

        if (isVisible) {
          const box = await mainContent.boundingBox();
          const viewportSize = page.viewportSize();

          expect(box).not.toBeNull();
          if (box && viewportSize) {
            expect(box.width, 'Main content should fit in viewport').toBeLessThanOrEqual(
              viewportSize.width + 1 // +1 for rounding errors
            );
          }
        }
      });

      // ========== Layout Stacking Tests ==========

      test('Portfolio table scrolls horizontally on small screens only', async ({ page }) => {
        await page.goto('/portefolje');
        await page.waitForLoadState('networkidle');

        // Find the spreadsheet table
        const table = page.locator('table').first();
        const isVisible = await table.isVisible().catch(() => false);

        if (isVisible) {
          // Table can scroll horizontally - that's OK for small viewports
          // Just verify the page itself doesn't have unwanted horizontal scroll outside the table
          const pageHasHorizontalScroll = await page.evaluate(() => {
            return document.body.scrollWidth > document.documentElement.clientWidth;
          });

          expect(
            pageHasHorizontalScroll,
            'Page body should not have horizontal scroll (table scroll is OK)'
          ).toBe(false);
        }
      });

      // ========== Navigation Functionality ==========

      test('Can navigate between pages on mobile', async ({ page }) => {
        await page.goto('/oversikt');
        await page.waitForLoadState('networkidle');

        const hamburger = page.getByRole('button', { name: /åpne meny/i });
        const hasHamburger = await hamburger.isVisible().catch(() => false);

        if (hasHamburger) {
          // Mobile: use hamburger menu
          await hamburger.click();
          await page.waitForTimeout(300);

          const sparingLink = page.getByRole('button', { name: /sparing/i });
          if (await sparingLink.isVisible().catch(() => false)) {
            await sparingLink.click();
            await page.waitForURL(/\/sparing/, { timeout: 10000 });
          }
        } else {
          // Desktop: use header nav (shouldn't happen in mobile tests, but be safe)
          const sparingLink = page.locator('.app-header__nav').getByRole('link', {
            name: /sparing/i,
            exact: true,
          });
          if (await sparingLink.isVisible().catch(() => false)) {
            await sparingLink.click();
            await page.waitForURL(/\/sparing/, { timeout: 10000 });
          }
        }
      });

      // ========== Page Load Performance ==========

      test('Pages load within acceptable time on mobile', async ({ page }) => {
        const pages = ['/oversikt', '/portefolje', '/sparing'];

        for (const pagePath of pages) {
          const startTime = Date.now();
          await page.goto(pagePath);
          await page.waitForLoadState('networkidle');
          const loadTime = Date.now() - startTime;

          // Page should load within 10 seconds
          expect(loadTime, `${pagePath} should load within 10s`).toBeLessThan(10000);
        }
      });
    });
  }
});
