import { defineConfig, devices } from '@playwright/test';

// Screenshot mode: SCREENSHOTS=1 pnpm test
const screenshotMode = process.env.SCREENSHOTS === '1';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false, // Run sequentially for sanity checks
  forbidOnly: !!process.env.CI,
  retries: screenshotMode ? 0 : 1,
  workers: 1,
  timeout: 60000, // 60s per test
  reporter: [['html'], ['list']],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: screenshotMode ? 'on' : 'only-on-failure',
    video: screenshotMode ? 'on' : 'on-first-retry',
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
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
      command: 'pnpm --filter backend dev',
      url: 'http://localhost:3000/api/v1/health',
      reuseExistingServer: !process.env.CI,
      cwd: '..',
      timeout: 30000,
    },
    {
      command: 'pnpm --filter frontend dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      cwd: '..',
      timeout: 30000,
    },
  ],
});
