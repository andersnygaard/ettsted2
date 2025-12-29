/**
 * Global Setup for E2E Tests
 *
 * Runs once before all tests to:
 * 1. Wait for backend to be fully ready (including DB)
 * 2. Perform demo login via UI
 * 3. Save storage state (localStorage with token) for reuse
 *
 * All tests then reuse this authenticated state instead of logging in each time.
 * This eliminates:
 * - Race conditions from repeated logins
 * - Rate limiting from too many demo-login calls
 * - Slow test runs from repeated DB seeding
 */

import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export const STORAGE_PATH = path.join(__dirname, 'storage', 'auth-state.json');

/**
 * Wait for backend to be fully ready with DB connection
 */
async function waitForBackendReady(baseURL: string, timeout = 60000): Promise<void> {
  const backendUrl = baseURL.replace(':5173', ':3000');
  const healthUrl = `${backendUrl}/api/v1/health?deep=true`;
  const deadline = Date.now() + timeout;

  console.log(`[global-setup] Waiting for backend at ${healthUrl}...`);

  while (Date.now() < deadline) {
    try {
      const response = await fetch(healthUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.db === 'connected') {
          console.log('[global-setup] Backend ready with DB connection');
          return;
        }
      }
    } catch {
      // Backend not up yet, retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  throw new Error(`Backend not ready after ${timeout}ms`);
}

/**
 * Perform demo login and save storage state
 */
async function performDemoLogin(baseURL: string): Promise<void> {
  console.log('[global-setup] Starting demo login...');

  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  try {
    // Navigate to home page
    await page.goto('/');

    // Clear any existing auth state
    await page.evaluate(() => {
      localStorage.removeItem('finans_demo_token');
      localStorage.removeItem('finans_dev_logout');
    });

    // Click login button to open modal
    const loginBtn = page.getByRole('button', { name: /logg inn/i });
    await loginBtn.waitFor({ state: 'visible', timeout: 10000 });
    await loginBtn.click();

    // Click demo login button
    const demoBtn = page.getByRole('button', { name: /prøv demo/i });
    await demoBtn.waitFor({ state: 'visible', timeout: 10000 });
    await demoBtn.click();

    // Wait for redirect to oversikt (signals login complete)
    await page.waitForURL('**/oversikt', { timeout: 90000 });
    console.log('[global-setup] Redirected to /oversikt');

    // Wait for token to be stored in localStorage
    await page.waitForFunction(
      () => {
        const token = localStorage.getItem('finans_demo_token');
        if (!token) return false;
        // Verify token is valid JWT format
        const parts = token.split('.');
        return parts.length === 3;
      },
      { timeout: 10000 }
    );
    console.log('[global-setup] Token stored in localStorage');

    // Wait for React auth context to initialize (app header shows user menu when authenticated)
    await page.locator('.app-header').waitFor({ state: 'visible', timeout: 15000 });
    console.log('[global-setup] App header visible - auth context ready');

    // Ensure storage directory exists
    const storageDir = path.dirname(STORAGE_PATH);
    if (!fs.existsSync(storageDir)) {
      fs.mkdirSync(storageDir, { recursive: true });
    }

    // Save storage state
    await context.storageState({ path: STORAGE_PATH });
    console.log(`[global-setup] Storage state saved to ${STORAGE_PATH}`);
  } finally {
    await browser.close();
  }
}

async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:5173';

  console.log('[global-setup] Starting E2E test setup...');

  // Wait for backend to be ready
  await waitForBackendReady(baseURL);

  // Perform demo login and save state
  await performDemoLogin(baseURL);

  console.log('[global-setup] Setup complete!');
}

export default globalSetup;
