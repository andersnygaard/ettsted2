import { test, expect } from '@playwright/test';

test.describe('Demo Login Rate Limiting', () => {
  const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  
  test('demo login limited to 5 requests per 15 minutes per IP', async () => {
    // Make 5 successful requests
    for (let i = 0; i < 5; i++) {
      const response = await fetch(`${API_URL}/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.token).toBeDefined();
    }
  });
  
  test('demo login returns 429 when rate limit exceeded', async () => {
    // Make requests until we hit the limit (5+)
    let response;
    let statusCode = 200;
    let attempts = 0;
    const maxAttempts = 10; // Give it 10 tries to ensure we hit limit
    
    while (statusCode !== 429 && attempts < maxAttempts) {
      response = await fetch(`${API_URL}/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      statusCode = response.status;
      attempts++;
    }
    
    // Verify we got rate limited
    expect(statusCode).toBe(429);
    expect(response).toBeDefined();
    const data = await response!.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('DEMO_LOGIN_RATE_LIMIT_EXCEEDED');
    expect(data.error.message).toContain('For mange demo-forespørsler');
  });
  
  test('demo login returns correct rate limit headers', async () => {
    const response = await fetch(`${API_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    expect(response.status).toBe(200);
    
    // Check for RateLimit-* headers (standard format)
    const headers = response.headers;
    const rateLimitLimit = headers.get('RateLimit-Limit');
    const rateLimitRemaining = headers.get('RateLimit-Remaining');
    
    // Rate limiter should include standard headers
    expect(rateLimitLimit).toBeTruthy();
    expect(rateLimitRemaining).toBeTruthy();
  });
  
  test('demo login error response matches expected format', async () => {
    // Exhaust the rate limit first
    for (let i = 0; i < 6; i++) {
      await fetch(`${API_URL}/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Next request should be rate limited
    const response = await fetch(`${API_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    
    expect(response.status).toBe(429);
    const data = await response.json();
    
    // Verify response format matches API conventions
    expect(data).toHaveProperty('success', false);
    expect(data).toHaveProperty('error');
    expect(data.error).toHaveProperty('message');
    expect(data.error).toHaveProperty('code');
    expect(data.error.message).toBe('For mange demo-forespørsler. Prøv igjen senere.');
    expect(data.error.code).toBe('DEMO_LOGIN_RATE_LIMIT_EXCEEDED');
  });
});
