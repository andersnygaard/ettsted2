import { Page, expect } from '@playwright/test';

export interface MockUser {
  id: string;
  username: string;
  email?: string;
  provider?: 'google' | 'facebook';
}

export function createMockUser(overrides?: Partial<MockUser>): MockUser {
  return {
    id: 'test-user-123',
    username: 'testuser',
    email: 'test@example.com',
    provider: 'google',
    ...overrides,
  };
}

/**
 * Login via demo account - uses real backend
 */
export async function loginAsDemo(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /prøv demo/i }).click();
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
}

/**
 * Mock authenticated user - uses route interception (for isolated tests)
 */
export async function mockAuthenticatedUser(page: Page, user?: MockUser) {
  const mockUser = user ?? createMockUser();

  await page.route('**/api/v1/users/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: mockUser, success: true }),
    });
  });
}

/**
 * Mock unauthenticated user - uses route interception
 */
export async function mockUnauthenticatedUser(page: Page) {
  await page.route('**/api/v1/users/me', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: { message: 'Unauthorized' }, success: false }),
    });
  });
}
