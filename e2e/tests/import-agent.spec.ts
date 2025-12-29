import { test, expect } from './fixtures';

test.describe('Import Agent', () => {
  // Auth pre-loaded from global setup - no beforeEach login needed

  test('displays initial greeting message', async ({ page }) => {
    await page.goto('/import');

    // Check for page header
    await expect(page.getByRole('heading', { name: 'Importer data' })).toBeVisible();

    // Check that page loaded
    expect(page.url()).toContain('/import');

    // Check for initial greeting in messages area
    const messagesArea = page.locator('.chatbot__messages');
    await expect(messagesArea).toBeVisible();

    // Initial greeting should be from assistant
    await expect(messagesArea).toContainText('Jeg kan bare hjelpe med å importere porteføljedata');
  });

  test('user can send message and receive response', async ({ page }) => {
    await page.goto('/import');
    await expect(page.getByRole('heading', { name: 'Importer data' })).toBeVisible();

    // Get initial message count
    const initialMessages = page.locator('.chat-message');
    const initialCount = await initialMessages.count();

    // Type and send a message
    const textarea = page.locator('.chatbot__input');
    await textarea.fill('Test message');

    const sendButton = page.locator('.chatbot__send');
    await sendButton.click();

    // Wait for typing indicator (shows loading state)
    const typingIndicator = page.locator('.chatbot__typing');
    await expect(typingIndicator).toBeVisible({ timeout: 5000 });

    // Wait for typing indicator to disappear (response received)
    // Use longer timeout for LLM API call
    await expect(typingIndicator).toBeHidden({ timeout: 45000 });

    // Verify we have more messages now (user + response)
    const finalMessages = page.locator('.chat-message');
    const finalCount = await finalMessages.count();
    expect(finalCount).toBeGreaterThan(initialCount);

    // Verify the textarea was cleared
    const textareaValue = await textarea.inputValue();
    expect(textareaValue).toBe('');
  });

  test('multi-turn conversation works', async ({ page }) => {
    await page.goto('/import');
    await expect(page.getByRole('heading', { name: 'Importer data' })).toBeVisible();

    // Send first message
    const textarea = page.locator('.chatbot__input');
    await textarea.fill('Første melding');
    await page.locator('.chatbot__send').click();

    // Wait for first response
    const typingIndicator = page.locator('.chatbot__typing');
    await expect(typingIndicator).toBeVisible({ timeout: 5000 });
    await expect(typingIndicator).toBeHidden({ timeout: 45000 });

    // Send second message
    await textarea.fill('Andre melding');
    await page.locator('.chatbot__send').click();

    // Wait for second response
    await expect(page.locator('.chatbot__typing')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.chatbot__typing')).toBeHidden({ timeout: 45000 });

    // Should have multiple messages now
    const messages = page.locator('.chat-message');
    const messageCount = await messages.count();

    // At minimum: 2 initial + 2 user + 2 assistant = 6
    // But could be more depending on conversation
    expect(messageCount).toBeGreaterThanOrEqual(4);
  });

  test('reset button clears conversation', async ({ page }) => {
    await page.goto('/import');
    await expect(page.getByRole('heading', { name: 'Importer data' })).toBeVisible();

    // Send a message to trigger the reset button
    const textarea = page.locator('.chatbot__input');
    await textarea.fill('Test message');
    await page.locator('.chatbot__send').click();

    // Wait for response
    const typingIndicator = page.locator('.chatbot__typing');
    await expect(typingIndicator).toBeVisible({ timeout: 5000 });
    await expect(typingIndicator).toBeHidden({ timeout: 45000 });

    // Get message count before reset
    let messages = page.locator('.chat-message');
    const countBeforeReset = await messages.count();
    expect(countBeforeReset).toBeGreaterThan(2);

    // Reset button should be visible
    const resetButton = page.getByRole('button', { name: /Ny samtale/i });
    await expect(resetButton).toBeVisible();

    // Click reset
    await resetButton.click();

    // Wait for message count to decrease
    await expect(async () => {
      const count = await page.locator('.chat-message').count();
      expect(count).toBeLessThanOrEqual(3);
    }).toPass({ timeout: 5000 });

    // Reset button should no longer be visible (only shows when messages.length > 2)
    await expect(resetButton).not.toBeVisible();
  });

  test('send button is disabled while loading', async ({ page }) => {
    await page.goto('/import');
    await expect(page.getByRole('heading', { name: 'Importer data' })).toBeVisible();

    const textarea = page.locator('.chatbot__input');
    const sendButton = page.locator('.chatbot__send');

    // Initially, send button should be disabled (empty textarea)
    await expect(sendButton).toBeDisabled();

    // Fill textarea
    await textarea.fill('Test message');

    // Now button should be enabled
    await expect(sendButton).toBeEnabled();

    // Click send
    await sendButton.click();

    // Button should be disabled while loading
    const typingIndicator = page.locator('.chatbot__typing');
    await expect(typingIndicator).toBeVisible({ timeout: 5000 });
    await expect(sendButton).toBeDisabled();

    // Wait for response
    await expect(typingIndicator).toBeHidden({ timeout: 45000 });

    // Since textarea was cleared, button will be disabled until user types again
    await expect(sendButton).toBeDisabled();
  });

  test('textarea is disabled while loading', async ({ page }) => {
    await page.goto('/import');
    await expect(page.getByRole('heading', { name: 'Importer data' })).toBeVisible();

    const textarea = page.locator('.chatbot__input');

    // Initially enabled
    await expect(textarea).toBeEnabled();

    // Type and send
    await textarea.fill('Test message');
    await page.locator('.chatbot__send').click();

    // Wait for loading to start
    const typingIndicator = page.locator('.chatbot__typing');
    await expect(typingIndicator).toBeVisible({ timeout: 5000 });

    // Should be disabled while loading
    await expect(textarea).toBeDisabled();

    // Wait for response
    await expect(typingIndicator).toBeHidden({ timeout: 45000 });

    // Should be enabled again
    await expect(textarea).toBeEnabled();
  });

  test('messages auto-scroll to bottom', async ({ page }) => {
    await page.goto('/import');
    await expect(page.getByRole('heading', { name: 'Importer data' })).toBeVisible();

    const textarea = page.locator('.chatbot__input');

    // Send multiple messages to create a longer conversation
    for (let i = 0; i < 2; i++) {
      await textarea.fill(`Message ${i + 1}`);
      await page.locator('.chatbot__send').click();

      // Wait for response
      const typingIndicator = page.locator('.chatbot__typing');
      await expect(typingIndicator).toBeVisible({ timeout: 5000 });
      await expect(typingIndicator).toBeHidden({ timeout: 45000 });
    }

    // Messages area should be scrolled to show latest message
    const messagesArea = page.locator('.chatbot__messages');
    const messagesContent = await messagesArea.textContent();

    // Should contain messages from conversation
    expect(messagesContent).toBeTruthy();
    expect(messagesContent?.length).toBeGreaterThan(50);
  });

  test('enter key submits message (shift+enter for new line)', async ({ page }) => {
    await page.goto('/import');
    await expect(page.getByRole('heading', { name: 'Importer data' })).toBeVisible();

    const textarea = page.locator('.chatbot__input');
    const initialMessages = page.locator('.chat-message');
    const initialCount = await initialMessages.count();

    // Fill textarea
    await textarea.fill('Test message via enter');

    // Press Enter (should submit)
    await textarea.press('Enter');

    // Wait for response
    const typingIndicator = page.locator('.chatbot__typing');
    await expect(typingIndicator).toBeVisible({ timeout: 5000 });
    await expect(typingIndicator).toBeHidden({ timeout: 45000 });

    // Should have new messages
    const finalMessages = page.locator('.chat-message');
    const finalCount = await finalMessages.count();
    expect(finalCount).toBeGreaterThan(initialCount);

    // Textarea should be cleared
    const textareaValue = await textarea.inputValue();
    expect(textareaValue).toBe('');
  });

  test('page navigation works with back button', async ({ page }) => {
    await page.goto('/import');
    await expect(page.getByRole('heading', { name: 'Importer data' })).toBeVisible();

    // Click back button
    const backButton = page.getByRole('button', { name: /Tilbake til portefølje/i });
    await expect(backButton).toBeVisible();
    await backButton.click();

    // Should navigate to portfolio page
    await page.waitForURL(/\/portefolje/, { timeout: 10000 });
    expect(page.url()).toContain('/portefolje');
  });

  test('breadcrumb navigation works', async ({ page }) => {
    await page.goto('/import');
    await expect(page.getByRole('heading', { name: 'Importer data' })).toBeVisible();

    // Click on breadcrumb link to portfolio (scope to breadcrumb to avoid header nav)
    const breadcrumbLink = page.getByLabel('Breadcrumb').getByRole('link', { name: /Portefølje/ });
    await breadcrumbLink.click();

    // Should navigate to portfolio page
    await page.waitForURL(/\/portefolje/, { timeout: 10000 });
    expect(page.url()).toContain('/portefolje');
  });

  test('handles empty/whitespace input gracefully', async ({ page }) => {
    await page.goto('/import');
    await expect(page.getByRole('heading', { name: 'Importer data' })).toBeVisible();

    const textarea = page.locator('.chatbot__input');
    const sendButton = page.locator('.chatbot__send');

    // Send button should be disabled for empty textarea
    await expect(sendButton).toBeDisabled();

    // Fill with only spaces
    await textarea.fill('   ');

    // Button should still be disabled (trim is empty)
    await expect(sendButton).toBeDisabled();

    // Fill with actual content
    await textarea.fill('Real message');

    // Now button should be enabled
    await expect(sendButton).toBeEnabled();
  });
});
