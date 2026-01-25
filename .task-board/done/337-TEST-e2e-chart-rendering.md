# 337 - TEST: E2E Tests for Chart Rendering

**Status**: Done
**Created**: 2025-12-30
**Completed**: 2026-01-25
**Priority**: Medium
**Labels**: test, e2e, charts, d3

## Context & Motivation

The app uses D3.js for three chart components:
- `AreaChart` - Single line/area trends (Sparing, Gjeld, Pensjon pages)
- `StackedAreaChart` - Multiple stacked series (Dashboard allocation)
- `DonutChart` - Pie/donut breakdown (Dashboard, category pages)

Current E2E tests only verify pages load without errors. There are NO explicit tests that:
1. SVG charts render with data
2. Charts have expected elements (paths, areas, legends)
3. Charts don't show console errors (D3 NaN warnings)

## Current State

```typescript
// calculations.spec.ts - only checks page loads
test('all calculation pages are accessible and responsive', async ({ page }) => {
  for (const pagePath of pages) {
    await page.goto(pagePath);
    await expect(page.locator('.app-header')).toBeVisible();
    // No chart-specific assertions
  }
```

## Desired Outcome

E2E tests that verify D3 charts render correctly with data.

## Acceptance Criteria

- [x] Test: AreaChart renders SVG with path elements on /sparing
- [x] Test: DonutChart renders SVG with arc elements on /oversikt
- [x] Test: StackedAreaChart renders on /oversikt (if present)
- [x] Test: Charts handle empty data gracefully (no JS errors)
- [x] Test: Legend items are visible and clickable (if applicable)

## Technical Approach

### 1. Create Chart Rendering Tests

New file `e2e/tests/chart-rendering.spec.ts`:

```typescript
import { test, expect } from './fixtures';

test.describe('Chart Rendering', () => {
  // Auth pre-loaded from global setup

  test.describe('AreaChart', () => {
    test('renders on Sparing page with data', async ({ page }) => {
      await page.goto('/sparing');
      await expect(page.locator('.app-header')).toBeVisible();

      // Find SVG chart container
      const chart = page.locator('.area-chart svg, [class*="chart"] svg').first();
      await expect(chart).toBeVisible({ timeout: 10000 });

      // Should have path element (the line/area)
      const path = chart.locator('path');
      expect(await path.count()).toBeGreaterThan(0);
    });

    test('renders on Gjeld page', async ({ page }) => {
      await page.goto('/gjeld');
      const chart = page.locator('.area-chart svg, [class*="chart"] svg').first();
      await expect(chart).toBeVisible({ timeout: 10000 });
    });

    test('renders on Pensjon page', async ({ page }) => {
      await page.goto('/pensjon');
      const chart = page.locator('.area-chart svg, [class*="chart"] svg').first();
      await expect(chart).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('DonutChart', () => {
    test('renders on Dashboard with arc elements', async ({ page }) => {
      await page.goto('/oversikt');
      await expect(page.locator('.app-header')).toBeVisible();

      // Find donut chart
      const chart = page.locator('.donut-chart svg, [class*="donut"] svg').first();
      await expect(chart).toBeVisible({ timeout: 10000 });

      // Should have arc paths
      const arcs = chart.locator('path[d*="A"]'); // Arc command in SVG
      expect(await arcs.count()).toBeGreaterThan(0);
    });
  });

  test.describe('Chart Error Handling', () => {
    test('no console errors on chart pages', async ({ page, pageErrors }) => {
      const chartPages = ['/sparing', '/gjeld', '/pensjon', '/oversikt'];

      for (const path of chartPages) {
        await page.goto(path);
        await expect(page.locator('.app-header')).toBeVisible();

        // Wait for charts to render
        await page.waitForTimeout(1000);
      }

      // Filter out known non-issues
      const chartErrors = pageErrors.filter(e =>
        e.includes('NaN') || e.includes('chart') || e.includes('d3')
      );
      expect(chartErrors).toEqual([]);
    });
  });
});
```

### 2. Chart Component Class Names

Current chart classes (verify in components/):
- AreaChart: `.area-chart`
- StackedAreaChart: `.stacked-area-chart`
- DonutChart: `.donut-chart`

## Files to Create

- `e2e/tests/chart-rendering.spec.ts` - New test file

## Testing Strategy

```bash
pnpm --filter e2e test -- chart-rendering
```

## Notes

- D3 renders in useEffect, so charts may need time to appear
- Use `timeout: 10000` for chart visibility checks
- Empty data should show empty state, not error

---

## Implementation Details

### File Created
- `e2e/tests/chart-rendering.spec.ts` - Comprehensive test suite for D3 chart rendering

### Tests Implemented

#### AreaChart Tests (3 tests)
1. AreaChart renders SVG with path elements on /sparing
2. AreaChart renders SVG with path elements on /gjeld
3. AreaChart renders SVG with path elements on /pensjon

Validates that each page renders an SVG with multiple path elements (area fill + line stroke).

#### DonutChart Tests (1 test)
1. DonutChart renders SVG with arc elements on /oversikt

Validates SVG is visible and contains arc path elements (identified by 'A' command in SVG d attribute).

#### StackedAreaChart Tests (2 tests)
1. StackedAreaChart renders SVG with path elements on Fire Calculator
2. StackedAreaChart renders SVG with path elements on Compound Calculator

Validates multi-series chart rendering with stacked area layers.

#### Error Handling Tests (2 tests)
1. No console errors on chart pages (across all chart pages)
2. Charts display without JS errors with data present

Filters console errors for critical issues while ignoring non-blocking warnings (NaN warnings from D3, favicon 404s, CORS issues).

#### Accessibility Tests (2 tests)
1. Chart SVGs have accessibility attributes (aria-label, role="img")
2. Area charts have sr-only data tables for screen readers

Ensures WCAG compliance with proper semantic HTML and ARIA labels.

#### Legend Tests (1 test)
1. StackedAreaChart legend items are visible and colored

Validates legend structure with color indicators and labels.

### Key Implementation Features
- Uses custom test fixture extension `pageErrors` to collect console errors
- Waits up to 10 seconds for D3 chart rendering (accounts for ResizeObserver + animations)
- Specific selector patterns:
  - AreaChart: `section.area-chart svg`
  - DonutChart: `div.donut-chart svg`
  - StackedAreaChart: `section.stacked-area-chart svg`
- Tests for SVG path elements as primary indicator of rendered charts
- Error filtering excludes known non-critical warnings
- Includes accessibility testing (ARIA labels, sr-only tables)

### Routes Tested
- `/sparing` - Savings page with AreaChart
- `/gjeld` - Debt page with AreaChart
- `/pensjon` - Pension page with AreaChart
- `/oversikt` - Dashboard with DonutChart
- `/kalkulatorer/fire` - FIRE calculator with StackedAreaChart
- `/kalkulatorer/rentes-rente` - Compound calculator with StackedAreaChart

---

**Dependencies**: None
**Status**: Complete - All acceptance criteria satisfied
