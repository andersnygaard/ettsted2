import { chromium, Page, BrowserContext } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

const WIDTHS = [1280, 1024, 720, 360];
const BASE_URL = 'http://localhost:5173';
const API_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.resolve(__dirname, '../.docs/screenshots');

const PAGES = [
  { name: 'landing', path: '/', requiresAuth: false },
  { name: 'oversikt', path: '/oversikt', requiresAuth: true },
  { name: 'portefolje', path: '/portefolje', requiresAuth: true },
  { name: 'sparing', path: '/sparing', requiresAuth: true },
  { name: 'gjeld', path: '/gjeld', requiresAuth: true },
  { name: 'pensjon', path: '/pensjon', requiresAuth: true },
  { name: 'kalkulatorer', path: '/kalkulatorer', requiresAuth: true },
  { name: 'import', path: '/import', requiresAuth: true },
  { name: 'min-okonomi', path: '/min-okonomi', requiresAuth: true },
];

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function demoLogin(context: BrowserContext): Promise<string> {
  const response = await context.request.post(`${API_URL}/api/v1/auth/demo-login`);
  if (!response.ok()) {
    throw new Error(`Demo login failed: ${response.status()}`);
  }
  const data = await response.json();
  return data.data.token;
}

async function takeScreenshot(page: Page, name: string, width: number) {
  const widthDir = path.join(OUTPUT_DIR, `${width}px`);
  ensureDir(widthDir);

  await page.setViewportSize({ width, height: 900 });
  await page.waitForTimeout(500);

  const filepath = path.join(widthDir, `${name}.png`);
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`✓ ${width}px/${name}.png`);
}

async function main() {
  ensureDir(OUTPUT_DIR);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Taking screenshots...\n');

  // Screenshot landing page first (no auth)
  console.log('--- Landing Page ---');
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');
  for (const width of WIDTHS) {
    await takeScreenshot(page, 'landing', width);
  }

  // Demo login - get token and set in localStorage
  console.log('\n--- Logging in with demo account ---');
  const token = await demoLogin(context);

  // Navigate to app and set token in localStorage
  await page.goto(BASE_URL);
  await page.evaluate((t: string) => {
    localStorage.setItem('auth_token', t);
  }, token);

  // Reload to apply auth
  await page.reload();
  await page.waitForLoadState('networkidle');
  console.log('✓ Logged in\n');

  // Screenshot authenticated pages
  for (const pageInfo of PAGES) {
    if (!pageInfo.requiresAuth) continue;

    console.log(`--- ${pageInfo.name} ---`);
    await page.goto(`${BASE_URL}${pageInfo.path}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    for (const width of WIDTHS) {
      await takeScreenshot(page, pageInfo.name, width);
    }
    console.log('');
  }

  // Screenshot dialogs/modals
  console.log('--- Dialogs ---');

  // Avatar menu
  await page.goto(`${BASE_URL}/oversikt`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  for (const width of WIDTHS) {
    const widthDir = path.join(OUTPUT_DIR, `${width}px`);
    ensureDir(widthDir);

    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(300);

    // Try to find and click avatar menu
    const avatarButton = page.locator('button:has(.avatar), [class*="avatar"] button, button[aria-haspopup="menu"]').first();
    if (await avatarButton.isVisible()) {
      await avatarButton.click();
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(widthDir, 'dialog-avatar-menu.png') });
      console.log(`✓ ${width}px/dialog-avatar-menu.png`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
    }

    // Mobile menu at small widths
    if (width <= 720) {
      const mobileMenuButton = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"], [class*="hamburger"], [class*="mobile-menu"]').first();
      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();
        await page.waitForTimeout(300);
        await page.screenshot({ path: path.join(widthDir, 'dialog-mobile-menu.png'), fullPage: true });
        console.log(`✓ ${width}px/dialog-mobile-menu.png`);
        await page.keyboard.press('Escape');
      }
    }
  }

  await browser.close();
  console.log('\n✅ Done! Screenshots saved to .docs/screenshots/');
}

main().catch(console.error);
