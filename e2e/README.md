# E2E Sanity Tests

Playwright-based sanity check suite for the Finans application. Visits all pages, checks for errors, and verifies navigation works.

## Quick Start

```bash
# From root
pnpm test:e2e

# From e2e folder
pnpm test
```

## Test Modes

| Command | Description |
|---------|-------------|
| `pnpm test` | Headless run (default) |
| `pnpm test:watch` | Watch in browser (headed, no timeout) |
| `pnpm test:screenshots` | Capture screenshots + video of every test |
| `pnpm test:ui` | Playwright UI (interactive debugger) |
| `pnpm report` | Open HTML report |

## What Gets Tested

### Pages Visited
- `/oversikt` - Oversikt
- `/portefolje` - Portefølje
- `/sparing` - Sparing
- `/gjeld` - Gjeld
- `/pensjon` - Pensjon
- `/kalkulatorer` - Kalkulatorer
- `/import` - Importer data (LLM chatbot)
- `/min-okonomi` - Min økonomi (User settings)
- `/kalkulatorer/rentes-rente` - Compound calculator
- `/kalkulatorer/fire` - F.I.R.E. calculator
- `/kalkulatorer/lan` - Loan calculator
- `/kalkulatorer/monte-carlo` - Monte Carlo simulator

### Tests
1. **Home page loads** - Landing page visible when logged out
2. **Login works** - Dev mode auto-login functions
3. **Visit all pages** - Each page loads, scrolls, no errors
4. **Navigation works** - Header nav links function correctly
5. **Logout works** - Can log out and return to home

### Health Checks Per Page
- Page has content (not empty)
- No error boundary displayed
- No broken images
- No critical console errors

## Configuration

### Viewport
- Desktop Chrome: 1280x720

### Timeouts
- Test timeout: 60s
- Server start: 30s

### Retries
- Normal mode: 1 retry
- Screenshot mode: 0 retries

## Output Locations

| Mode | Location |
|------|----------|
| Screenshots | `test-results/` |
| Videos | `test-results/` |
| HTML Report | `playwright-report/` |
| Traces | `test-results/*/trace.zip` |

## Dev Server

Tests auto-start dev servers via `webServer` config:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

If servers are already running, they're reused (`reuseExistingServer: true`).

## Known Issues

1. **Mobile tests disabled** - Hits backend rate limits when running full suite
2. **Rate limiting** - Backend limits 100 req/min, can cause failures on repeated runs
3. **D3 Chart warnings** - Non-critical SVG path errors (NaN values) appear on pages with empty chart data

## File Structure

```
e2e/
├── playwright.config.ts   # Playwright configuration
├── package.json           # Scripts and dependencies
├── README.md              # This file
└── tests/
    ├── fixtures.ts        # Login/logout helpers, page lists
    └── sanity.spec.ts     # Main test suite
```

## Adding New Pages

Edit `tests/fixtures.ts`:

```typescript
export const PROTECTED_PAGES = [
  { path: '/oversikt', name: 'Oversikt' },
  { path: '/new-page', name: 'New Page' },  // Add here
  // ...
] as const;
```

## Running Mobile Tests

Mobile is disabled by default. Run separately:

```bash
npx playwright test --project=mobile
```

Or uncomment the mobile project in `playwright.config.ts`.
