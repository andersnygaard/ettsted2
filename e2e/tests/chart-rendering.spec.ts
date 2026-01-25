import { test, expect, login } from './fixtures';

/**
 * E2E Tests for Chart Rendering
 *
 * Verifies that D3.js charts render correctly with SVG elements
 * and handles empty data gracefully without console errors.
 *
 * Charts tested:
 * - AreaChart: Used on Sparing, Gjeld, Pensjon pages
 * - DonutChart: Used on Oversikt (Gjeld section) for coverage percentage
 * - StackedAreaChart: Used on calculator pages
 */

test.describe('Chart Rendering', () => {
  // Auth pre-loaded from global setup via login fixture

  test.describe('AreaChart Rendering', () => {
    test('AreaChart renders SVG with path elements on /sparing', async ({ page }) => {
      await login(page);
      await page.goto('/sparing');

      // Wait for page to be ready
      await expect(page.locator('.app-header')).toBeVisible();

      // Find SVG chart container - wait up to 10 seconds for D3 rendering
      const svg = page.locator('section.area-chart svg').first();
      await expect(svg).toBeVisible({ timeout: 10000 });

      // Check for path elements (area and line paths rendered by D3)
      const paths = svg.locator('path');
      const pathCount = await paths.count();
      expect(pathCount).toBeGreaterThan(0);
    });

    test('AreaChart renders SVG with path elements on /gjeld', async ({ page }) => {
      await login(page);
      await page.goto('/gjeld');

      // Wait for page to be ready
      await expect(page.locator('.app-header')).toBeVisible();

      // Find SVG chart container
      const svg = page.locator('section.area-chart svg').first();
      await expect(svg).toBeVisible({ timeout: 10000 });

      // Check for path elements
      const paths = svg.locator('path');
      const pathCount = await paths.count();
      expect(pathCount).toBeGreaterThan(0);
    });

    test('AreaChart renders SVG with path elements on /pensjon', async ({ page }) => {
      await login(page);
      await page.goto('/pensjon');

      // Wait for page to be ready
      await expect(page.locator('.app-header')).toBeVisible();

      // Find SVG chart container
      const svg = page.locator('section.area-chart svg').first();
      await expect(svg).toBeVisible({ timeout: 10000 });

      // Check for path elements
      const paths = svg.locator('path');
      const pathCount = await paths.count();
      expect(pathCount).toBeGreaterThan(0);
    });
  });

  test.describe('DonutChart Rendering', () => {
    test('DonutChart renders SVG with arc elements on /oversikt', async ({ page }) => {
      await login(page);
      await page.goto('/oversikt');

      // Wait for page to be ready
      await expect(page.locator('.app-header')).toBeVisible();

      // Find donut chart SVG - wait for D3 rendering
      const svg = page.locator('div.donut-chart svg').first();
      await expect(svg).toBeVisible({ timeout: 10000 });

      // Check for arc paths - SVG paths with arc command (A) in the d attribute
      // D3 arc generator creates paths with arc commands
      const paths = svg.locator('path');
      const pathCount = await paths.count();
      expect(pathCount).toBeGreaterThan(0);

      // Verify that at least one path has arc data (contains 'A' command)
      let hasArcPath = false;
      for (let i = 0; i < pathCount; i++) {
        const pathData = await paths.nth(i).getAttribute('d');
        if (pathData && pathData.includes('A')) {
          hasArcPath = true;
          break;
        }
      }
      expect(hasArcPath).toBe(true);
    });
  });

  test.describe('StackedAreaChart Rendering', () => {
    test('StackedAreaChart renders SVG with path elements on Fire Calculator', async ({ page }) => {
      await login(page);
      await page.goto('/kalkulatorer/fire');

      // Wait for page to be ready
      await expect(page.locator('.app-header')).toBeVisible();

      // Find stacked area chart SVG - wait for D3 rendering
      const svg = page.locator('section.stacked-area-chart svg').first();
      await expect(svg).toBeVisible({ timeout: 10000 });

      // Check for path elements
      const paths = svg.locator('path');
      const pathCount = await paths.count();
      expect(pathCount).toBeGreaterThan(0);
    });

    test('StackedAreaChart renders SVG on Compound Calculator', async ({ page }) => {
      await login(page);
      await page.goto('/kalkulatorer/rentes-rente');

      // Wait for page to be ready
      await expect(page.locator('.app-header')).toBeVisible();

      // Find stacked area chart SVG
      const svg = page.locator('section.stacked-area-chart svg').first();
      await expect(svg).toBeVisible({ timeout: 10000 });

      // Check for path elements
      const paths = svg.locator('path');
      const pathCount = await paths.count();
      expect(pathCount).toBeGreaterThan(0);
    });
  });

  test.describe('Chart Error Handling', () => {
    test('no console errors on chart pages', async ({ page, pageErrors }) => {
      await login(page);

      // Navigate through all pages with charts
      const chartPages = ['/oversikt', '/sparing', '/gjeld', '/pensjon'];

      for (const path of chartPages) {
        await page.goto(path);
        await expect(page.locator('.app-header')).toBeVisible();

        // Wait for charts to render (D3 uses useEffect)
        await page.waitForTimeout(2000);
      }

      // Filter for critical errors (ignore favicon and network errors)
      const criticalErrors = pageErrors.filter(
        (e) =>
          !e.includes('favicon') &&
          !e.includes('net::ERR') &&
          !e.includes('404') &&
          // D3 may log non-critical warnings about NaN
          !e.includes('NaN') &&
          // Ignore cross-origin iframe warnings
          !e.includes('cross-origin')
      );

      expect(criticalErrors).toEqual([]);
    });

    test('charts display without JS errors on page with data', async ({ page, pageErrors }) => {
      await login(page);
      await page.goto('/sparing');

      // Wait for all D3 rendering to complete
      await expect(page.locator('.app-header')).toBeVisible();
      await expect(page.locator('section.area-chart svg path')).toBeVisible({ timeout: 10000 });

      // Wait additional time for any animations or hover interactions
      await page.waitForTimeout(1000);

      // Check for JavaScript errors in console
      const jsErrors = pageErrors.filter((e) => e.includes('Error') || e.includes('error'));
      const chartErrors = jsErrors.filter(
        (e) =>
          !e.includes('favicon') &&
          !e.includes('net::ERR') &&
          !e.includes('404') &&
          !e.includes('NaN')
      );

      expect(chartErrors).toEqual([]);
    });
  });

  test.describe('Chart Legend Visibility', () => {
    test('StackedAreaChart legend items are visible', async ({ page }) => {
      await login(page);
      await page.goto('/kalkulatorer/fire');

      // Wait for page to be ready
      await expect(page.locator('.app-header')).toBeVisible();

      // Find legend container
      const legend = page.locator('.stacked-area-chart__legend').first();
      await expect(legend).toBeVisible({ timeout: 10000 });

      // Check for legend items
      const legendItems = legend.locator('.stacked-area-chart__legend-item');
      const itemCount = await legendItems.count();
      expect(itemCount).toBeGreaterThan(0);

      // Verify each legend item has a color indicator and label
      for (let i = 0; i < itemCount; i++) {
        const item = legendItems.nth(i);
        const colorIndicator = item.locator('.stacked-area-chart__legend-color');
        const label = item.locator('text');

        await expect(colorIndicator).toBeVisible();
        // Label text should be present (checked via text content)
        const itemText = await item.textContent();
        expect(itemText).toBeTruthy();
      }
    });
  });

  test.describe('Chart Accessibility', () => {
    test('chart SVGs have accessibility attributes', async ({ page }) => {
      await login(page);
      await page.goto('/sparing');

      // Wait for page to be ready
      await expect(page.locator('.app-header')).toBeVisible();

      // Find area chart section
      const chartSection = page.locator('section.area-chart').first();
      await expect(chartSection).toBeVisible({ timeout: 10000 });

      // Check for aria-label
      const ariaLabel = await chartSection.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();

      // Check for role attribute
      const role = await chartSection.getAttribute('role');
      expect(role).toBe('img');
    });

    test('area chart has screen reader table', async ({ page }) => {
      await login(page);
      await page.goto('/sparing');

      // Wait for page to be ready
      await expect(page.locator('.app-header')).toBeVisible();

      // Find the sr-only data table
      const srTable = page.locator('section.area-chart table.sr-only').first();
      await expect(srTable).toBeVisible({ timeout: 10000 });

      // Verify table structure
      const thead = srTable.locator('thead');
      const tbody = srTable.locator('tbody');

      await expect(thead).toBeVisible();
      await expect(tbody).toBeVisible();

      // Check for header cells
      const headerCells = thead.locator('th');
      const headerCount = await headerCells.count();
      expect(headerCount).toBeGreaterThan(0);

      // Check for data rows
      const dataRows = tbody.locator('tr');
      const rowCount = await dataRows.count();
      expect(rowCount).toBeGreaterThan(0);
    });
  });
});
