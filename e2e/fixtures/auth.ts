import { Page } from '@playwright/test';

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

export async function mockUnauthenticatedUser(page: Page) {
  await page.route('**/api/v1/users/me', async (route) => {
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ error: { message: 'Unauthorized' }, success: false }),
    });
  });
}
