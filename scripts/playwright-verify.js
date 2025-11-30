#!/usr/bin/env node
/**
 * Playwright verification script for frontend tasks.
 * Usage: node scripts/playwright-verify.js <url> [screenshot-name] [--interactive]
 *
 * Examples:
 *   node scripts/playwright-verify.js http://localhost:5173/portfolio portfolio-page
 *   node scripts/playwright-verify.js http://localhost:5175/sparing sparing --interactive
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const url = args[0];
const screenshotName = args[1] || 'page';
const interactive = args.includes('--interactive');

if (!url) {
  console.error('Usage: node scripts/playwright-verify.js <url> [screenshot-name] [--interactive]');
  console.error('Example: node scripts/playwright-verify.js http://localhost:5173/portfolio portfolio-page');
  process.exit(1);
}

// Output directory for screenshots
const outputDir = path.join(__dirname, '..', '.playwright-output');

async function verify() {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: !interactive,
    slowMo: interactive ? 100 : 0
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  // Collect console messages
  const consoleErrors = [];
  const consoleWarnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    consoleErrors.push(error.message);
  });

  try {
    console.log(`\nNavigating to: ${url}`);

    // Navigate and wait for network to be idle
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait a bit for any dynamic content
    await page.waitForTimeout(1000);

    const title = await page.title();
    console.log(`\n✓ Page loaded: ${title}`);
    console.log(`  URL: ${page.url()}`);

    // Check for console errors
    if (consoleErrors.length === 0) {
      console.log('✓ No console errors');
    } else {
      console.log(`\n✗ Console errors (${consoleErrors.length}):`);
      consoleErrors.forEach((err, i) => {
        // Truncate long error messages
        const truncated = err.length > 200 ? err.substring(0, 200) + '...' : err;
        console.log(`  ${i + 1}. ${truncated}`);
      });
    }

    // Show warnings (informational)
    if (consoleWarnings.length > 0) {
      console.log(`\n⚠ Console warnings (${consoleWarnings.length}):`);
      consoleWarnings.slice(0, 3).forEach((warn, i) => {
        const truncated = warn.length > 150 ? warn.substring(0, 150) + '...' : warn;
        console.log(`  ${i + 1}. ${truncated}`);
      });
      if (consoleWarnings.length > 3) {
        console.log(`  ... and ${consoleWarnings.length - 3} more`);
      }
    }

    // Take screenshot
    const screenshotPath = path.join(outputDir, `${screenshotName}.png`);
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`\n✓ Screenshot: ${screenshotPath}`);

    // Interactive mode: keep browser open
    if (interactive) {
      console.log('\n--- Interactive mode ---');
      console.log('Browser will stay open for manual inspection.');
      console.log('Press Ctrl+C to close.\n');

      // Keep the script running
      await new Promise(() => {});
    }

    // Final verdict
    console.log('\n' + '─'.repeat(40));
    if (consoleErrors.length === 0) {
      console.log('PASS - Page loaded successfully with no errors');
    } else {
      console.log('WARN - Page loaded but has console errors');
    }
    console.log('─'.repeat(40) + '\n');

  } catch (error) {
    console.error(`\n✗ Failed to load page: ${error.message}`);
    console.log('\n' + '─'.repeat(40));
    console.log('FAIL - Page did not load');
    console.log('─'.repeat(40) + '\n');
    process.exit(1);
  } finally {
    if (!interactive) {
      await browser.close();
    }
  }
}

verify().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
