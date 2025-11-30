import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: ['frontend/**/*.spec.ts', 'backend/**/*.spec.ts'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'frontend',
      testDir: './frontend',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'backend',
      testDir: './backend',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run both frontend and backend dev servers before tests
  webServer: [
    {
      command: 'pnpm --filter backend dev',
      url: 'http://localhost:3000/health',
      reuseExistingServer: !process.env.CI,
      cwd: '..',
    },
    {
      command: 'pnpm --filter frontend dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      cwd: '..',
    },
  ],
});
