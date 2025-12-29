import { defineConfig, devices } from '@playwright/test';

// Screenshot mode: SCREENSHOTS=1 pnpm test
const screenshotMode = process.env.SCREENSHOTS === '1';

// Storage state path for cached auth (relative to this config file)
const STORAGE_STATE = './storage/auth-state.json';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false, // Run sequentially for sanity checks
  forbidOnly: !!process.env.CI,
  retries: 0, // No retries - tests should be deterministic
  workers: 1,
  timeout: 120000, // 2 minutes per test
  reporter: [
    ['html', { outputFolder: '../playwright-report' }],
    ['list'],
  ],

  // Global setup: login once and cache storage state
  globalSetup: './global-setup.ts',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: screenshotMode ? 'on' : 'only-on-failure',
    video: screenshotMode ? 'on' : 'on-first-retry',
    // Use cached auth state for all tests
    storageState: STORAGE_STATE,
  },

  projects: [
    {
      name: 'smoke',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /sanity\.spec\.ts/,
    },
    {
      name: 'full',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /sanity\.spec\.ts/, // Don't re-run sanity tests
    },
    // Mobile disabled - hits backend rate limits when running full suite
    // Run with: npx playwright test --project=mobile (separately)
    // {
    //   name: 'mobile',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     viewport: { width: 390, height: 844 },
    //     isMobile: true,
    //     hasTouch: true,
    //   },
    // },
  ],

  webServer: [
    {
      command: 'cross-env LOG_LEVEL=warn pnpm --filter backend dev',
      // Use deep health check to ensure DB is ready
      url: 'http://localhost:3000/api/v1/health?deep=true',
      // Never reuse - always start fresh to avoid stale state issues
      reuseExistingServer: false,
      cwd: '..',
      timeout: 60000, // Increased for DB initialization
      stdout: 'pipe',
    },
    {
      command: 'pnpm --filter frontend dev',
      url: 'http://localhost:5173',
      reuseExistingServer: false,
      cwd: '..',
      timeout: 30000,
      stdout: 'ignore',
    },
  ],
});
