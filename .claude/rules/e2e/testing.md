# Testing Rules

## Stack
Playwright, TypeScript, cross-env

## Structure
- `/tests/*.spec.ts` - Test suites
- `/tests/fixtures.ts` - Shared helpers, page arrays, custom test extension
- `/fixtures/mobile-viewports.ts` - Viewport configs for responsive tests
- `/playwright.config.ts` - Config with webServer auto-start

## Patterns

### Test File Organization
```typescript
import { test, expect, login } from './fixtures';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    // Navigate to page under test
  });

  test('specific behavior', async ({ page }) => {
    // Arrange, Act, Assert
  });
});
```

### Page Arrays
```typescript
PROTECTED_PAGES  // Main pages requiring auth
CALCULATOR_PAGES // Calculator sub-pages
ALL_PAGES        // Combined array for iteration
```

### Custom Test Extension
`fixtures.ts` exports extended `test` that collects console errors:
```typescript
export const test = base.extend<{ pageErrors: string[] }>({...});
```

### Helper Functions
- `login(page)` - Demo login flow with retry
- `logout(page)` - Clear auth state
- `clearAuthState(page)` - Reset localStorage
- `checkPageHealth(page)` - Check for errors, empty pages, broken images
- `createSnapshot(page, data)` - Portfolio snapshot via modal
- `editCell(page, row, col, value)` - Inline spreadsheet edit
- `navigateToWizardStep(page, step)` - Wizard navigation

## Decisions
- Integration + E2E only, no unit tests
- Sequential execution (`fullyParallel: false`) for sanity checks
- Demo login seeds real data into database (no mock mode bypass)
- Mobile tests disabled by default (rate limit issues)
- Screenshot mode via `SCREENSHOTS=1` env var

## Gotchas
- **Rate limiting**: Demo login limited to 5 req/15min per IP. Run `demo-rate-limiting.spec.ts` separately.
- **D3 chart warnings**: Non-critical NaN path errors on empty charts. Ignore in console error assertions.
- **Auth timing**: Always use `clearAuthState()` in `beforeEach` to prevent cross-test pollution.
- **networkidle**: Use `await page.waitForLoadState('networkidle')` after navigation/API calls.
- **Mobile menu**: At `viewport.width < 768`, use hamburger menu, not header nav links.
- **Zod stripping**: Backend strips unknown fields. If test sends extra fields, they're dropped.

## Commands
```bash
pnpm test              # Headless run
pnpm test:watch        # Headed, no timeout
pnpm test:screenshots  # Capture screenshots + video
pnpm test:ui           # Playwright interactive UI
pnpm report            # Open HTML report
```

## Test Suites

| File | Purpose |
|------|---------|
| `sanity.spec.ts` | Page loads, navigation, login/logout |
| `calculators.spec.ts` | Calculator inputs, results, edge cases |
| `calculations.spec.ts` | Net worth, savings rate, F.I.R.E. formulas |
| `account-management.spec.ts` | Wizard CRUD, validation, persistence |
| `portfolio-data-entry.spec.ts` | Spreadsheet CRUD, export, filtering |
| `mobile-responsive.spec.ts` | Viewport tests, touch targets, scroll |
| `demo-rate-limiting.spec.ts` | Rate limit headers, 429 response |
