import { test, expect } from '@playwright/test';

/**
 * Rate Limiting Tests
 *
 * Rate limiting is only active in production (1000 req/hour).
 * In development/test, rate limiting is disabled, so these tests are skipped.
 */
test.describe('Rate Limiting', () => {
  const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  const isProduction = process.env.NODE_ENV === 'production';

  test('rate limit headers present in response', async () => {
    // Rate limiting is disabled in development - skip this test
    test.skip(!isProduction, 'Rate limiting only active in production');

    const response = await fetch(`${API_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status).toBe(200);

    const rateLimitLimit = response.headers.get('RateLimit-Limit');
    const rateLimitRemaining = response.headers.get('RateLimit-Remaining');

    expect(rateLimitLimit).toBeTruthy();
    expect(rateLimitRemaining).toBeTruthy();
  });
});
