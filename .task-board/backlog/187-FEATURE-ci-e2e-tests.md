# 187-FEATURE: Add E2E Tests to CI Pipeline

## Context

Playwright E2E tests exist in [e2e/tests/sanity.spec.ts](e2e/tests/sanity.spec.ts) and cover 14 pages, but they are not executed in the CI pipeline. Adding E2E tests to CI ensures regressions are caught before merge.

**Current tests**:
- 5 test cases covering login, logout, navigation, all pages
- 14 pages tested (dashboard, portfolio, sparing, gjeld, pensjon, kalkulatorer, import, min-okonomi, 4 calculator sub-pages)

## Type

FEATURE

## Priority

Medium - Quality assurance, prevents regressions

## Acceptance Criteria

- [ ] CI workflow runs Playwright tests
- [ ] Tests run against built frontend + backend
- [ ] Test results uploaded as artifacts on failure
- [ ] Pipeline uses GitHub Actions cache for Playwright browsers

## Technical Approach

Create new job in [ci.yml](.github/workflows/ci.yml) that:

1. Builds frontend and backend
2. Starts backend with in-memory/test database
3. Runs Playwright tests
4. Uploads test-results on failure

```yaml
e2e-tests:
  runs-on: ubuntu-latest
  needs: lint-and-test
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v2
      with:
        version: 8
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'
    - run: pnpm install
    - run: pnpm build
    - name: Install Playwright browsers
      run: pnpm --filter e2e exec playwright install --with-deps chromium
    - name: Run E2E tests
      run: pnpm test:e2e
      env:
        VITE_API_URL: http://localhost:3000/api/v1
    - uses: actions/upload-artifact@v4
      if: failure()
      with:
        name: playwright-report
        path: e2e/playwright-report/
```

**Note**: May need to start backend in background before running tests. Check [e2e/README.md](e2e/README.md) for setup details.

## Files to Modify

- [.github/workflows/ci.yml](.github/workflows/ci.yml) - Add e2e-tests job
- Possibly [e2e/playwright.config.ts](e2e/playwright.config.ts) - CI-specific config

## Effort Estimate

Medium - 1-2 hours (needs testing to ensure backend starts correctly in CI)

## Related Plans

- E2E tests already written and passing locally
- Due diligence suggests adding automated testing to CI
