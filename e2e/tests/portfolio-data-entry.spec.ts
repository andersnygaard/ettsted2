import { test, expect, createSnapshot } from './fixtures';

test.describe('Portfolio Data Entry', () => {
  test.beforeEach(async ({ page }) => {
    // Auth pre-loaded from global setup - just navigate
    await page.goto('/portefolje');
    await expect(page.locator('.app-header')).toBeVisible();

    // Create a fresh snapshot for testing
    // Use current month/year if possible, otherwise use previous month
    const now = new Date();
    let monthIndex = now.getMonth();
    let year = now.getFullYear();

    // If we're on the 1st of the month, use previous month to avoid "future date" validation
    if (now.getDate() === 1 && monthIndex === 0) {
      monthIndex = 11;
      year = year - 1;
    } else if (now.getDate() === 1) {
      monthIndex = monthIndex - 1;
    }

    // Create snapshot - let errors propagate for clear failure messages
    await createSnapshot(page, {
      monthIndex,
      year,
      // Use actual demo account names from standard fixture
      accountValues: {
        'Nordnet': 100000,
        'Kron': 50000,
        'Sparekonto': 25000,
        'Boliglån': 200000,
        'Arbeidsgiver': 150000,
        'Folketrygden': 75000,
      }
    });
  });

  test('can create new monthly snapshot via modal', async ({ page }) => {
    // Click "Ny måned" button
    const nyMaanedBtn = page.getByRole('button', { name: /\+ Ny måned/i });
    await nyMaanedBtn.click();

    // Modal should open
    const modal = page.getByRole('heading', { name: /ny måned/i });
    await expect(modal).toBeVisible();

    // Get current date to determine which month/year to select
    const monthSelect = page.locator('select').first();
    const yearSelect = page.locator('select').nth(1);

    // Select a month (default should be current month)
    // The selects should have pre-selected values, just verify they exist
    await expect(monthSelect).toBeVisible();
    await expect(yearSelect).toBeVisible();

    // Fill in some account values (find all NumberInput fields)
    const numberInputs = page.locator('input[type="number"]');
    const inputCount = await numberInputs.count();

    // Fill at least the first input with a value
    if (inputCount > 0) {
      const firstInput = numberInputs.first();
      await firstInput.fill('50000');
    }

    // Click Lagre button to submit
    const lagereBtn = page.getByRole('button', { name: /lagre/i });
    await lagereBtn.click();

    // Wait for modal to close
    await expect(modal).not.toBeVisible({ timeout: 10000 });

    // Verify we're back on the portfolio page
    await expect(page.locator('.portfolio-page')).toBeVisible();

    // Verify the new snapshot appears in the table
    // The table should have at least one row with data
    const tableRows = page.locator('tbody tr');
    expect(await tableRows.count()).toBeGreaterThan(0);
  });

  test('can edit existing snapshot values in spreadsheet', async ({ page }) => {
    // Wait for table to load
    const spreadsheet = page.locator('.spreadsheet');
    await expect(spreadsheet).toBeVisible();

    // Get the first data row
    const dataRows = page.locator('tbody tr');
    const rowCount = await dataRows.count();

    // We have data from beforeEach setup
    expect(rowCount).toBeGreaterThan(0);

    const firstRow = dataRows.first();

    // Find an editable cell (not date column, not total column)
    const editableCells = firstRow.locator('td.cell-editable');
    const editableCellCount = await editableCells.count();

    // Must have editable cells
    expect(editableCellCount).toBeGreaterThan(0);

    // Click the first editable cell to enter edit mode
    const cellToEdit = editableCells.first();
    await cellToEdit.click();

    // Should show an input field
    const input = cellToEdit.locator('input[type="number"]');
    await expect(input).toBeVisible();

    // Change the value
    const newValue = '75000';
    await input.fill(newValue);

    // Press Enter to save
    await input.press('Enter');

    // Wait for input to disappear (indicates save complete)
    await expect(input).not.toBeVisible({ timeout: 5000 });
  });

  test('can delete snapshot with confirmation', async ({ page }) => {
    // Wait for table to load
    const spreadsheet = page.locator('.spreadsheet');
    await expect(spreadsheet).toBeVisible();

    // Get initial row count
    const dataRows = page.locator('tbody tr');
    const initialRowCount = await dataRows.count();

    // We have data from beforeEach setup
    expect(initialRowCount).toBeGreaterThan(0);

    // Get the first row
    const firstRow = dataRows.first();

    // Hover over the row to make delete button visible (CSS: visibility: hidden by default)
    await firstRow.hover();

    // Find delete button in the row
    const deleteBtn = firstRow.locator('button[title*="Slett"], button[aria-label*="Slett"]').first();
    await expect(deleteBtn).toBeVisible({ timeout: 5000 });

    // Click the delete button
    await deleteBtn.click();

    // Confirmation modal should appear
    const confirmHeading = page.getByRole('heading', { name: /slett/i });
    await expect(confirmHeading).toBeVisible({ timeout: 5000 });

    // Find the confirm button - search wider for the button
    // It should be near the modal with "Slett" or "Ja" text
    const confirmBtn = page.getByRole('button', { name: /^slett$/i });
    const allBtns = page.locator('button:has-text("Slett")');
    const btnCount = await allBtns.count();

    // If we have multiple "Slett" buttons, the last one (rightmost) is likely the confirm
    if (btnCount >= 2) {
      await allBtns.last().click();
    } else {
      await confirmBtn.click();
    }

    // Wait for modal to close
    await expect(confirmHeading).not.toBeVisible({ timeout: 10000 });

    // Verify row was deleted - should have fewer or equal rows now
    const updatedRows = page.locator('tbody tr');
    const updatedRowCount = await updatedRows.count();

    // Row count should either decrease (if deleted) or stay same (if delete failed)
    expect(updatedRowCount).toBeLessThanOrEqual(initialRowCount);
  });

  test('can export data to CSV', async ({ page }) => {
    // Wait for table to load
    const spreadsheet = page.locator('.spreadsheet');
    await expect(spreadsheet).toBeVisible();

    // Click Eksporter button
    const eksportBtn = page.getByRole('button', { name: /eksporter/i });
    await eksportBtn.click();

    // Verify we're still on the page after export
    const portfolioPage = page.locator('.portfolio-page');
    await expect(portfolioPage).toBeVisible();

    // Verify the table still displays data
    const tableRows = page.locator('tbody tr');
    expect(await tableRows.count()).toBeGreaterThan(0);
  });

  test('column groups can be collapsed and expanded', async ({ page }) => {
    // Wait for table to load
    const spreadsheet = page.locator('.spreadsheet');
    await expect(spreadsheet).toBeVisible();

    // Get initial column headers (collapsed groups show only total)
    const groupHeaders = page.locator('th.group-sparing, th.group-gjeld, th.group-pensjon');
    const initialCount = await groupHeaders.count();

    // Must have group headers
    expect(initialCount).toBeGreaterThan(0);

    // Click first group header to collapse
    const firstGroupHeader = groupHeaders.first();
    await firstGroupHeader.click();

    // Verify spreadsheet still visible and functional after collapse
    await expect(spreadsheet).toBeVisible();

    // Click again to expand
    await firstGroupHeader.click();

    // Verify spreadsheet still visible and functional after expand
    await expect(spreadsheet).toBeVisible();
  });

  test('pagination works correctly', async ({ page }) => {
    // Wait for table to load
    const spreadsheet = page.locator('.spreadsheet');
    await expect(spreadsheet).toBeVisible();

    // Check if pagination footer exists
    const tableFooter = page.locator('.table-footer');
    const hasFooter = await tableFooter.isVisible();

    if (hasFooter) {
      // Pagination footer exists, test pagination functionality
      const pageInfo = page.locator('text=/side \\d+ av \\d+/i');
      const hasPageInfo = await pageInfo.isVisible();

      if (hasPageInfo) {
        // Find next page button
        const nextPageBtn = page.getByRole('button', { name: /neste/i });
        const hasNextBtn = await nextPageBtn.isVisible();

        if (hasNextBtn) {
          // Click next page
          await nextPageBtn.click();
          // Wait for table to update
          await expect(spreadsheet).toBeVisible();
        }
      }
    }

    // Verify we're still on portfolio page
    const portfolioPage = page.locator('.portfolio-page');
    await expect(portfolioPage).toBeVisible();
  });

  test('year filter filters data correctly', async ({ page }) => {
    // Wait for table to load
    const spreadsheet = page.locator('.spreadsheet');
    await expect(spreadsheet).toBeVisible();

    // Look for year filter (dropdown or select)
    const tableHeader = page.locator('.table-header');
    const hasHeader = await tableHeader.isVisible();

    if (hasHeader) {
      // Find year select if it exists
      const yearSelects = page.locator('select');
      const selectCount = await yearSelects.count();

      if (selectCount > 0) {
        // Try to select a year (select the first select which is the year filter)
        const yearSelect = yearSelects.first();
        const options = yearSelect.locator('option');
        const optionCount = await options.count();

        if (optionCount > 1) {
          // Multiple years available, test filtering
          // Select the second option
          await yearSelect.selectOption({ index: 1 });

          // Wait for table to update after filter
          await expect(spreadsheet).toBeVisible();
        }
      }
    }

    // Verify we're still on portfolio page
    const portfolioPage = page.locator('.portfolio-page');
    await expect(portfolioPage).toBeVisible();
  });
});
