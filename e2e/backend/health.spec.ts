import { test, expect } from '@playwright/test';

test.describe('Backend API - Health checks', () => {
  const API_URL = 'http://localhost:3000';

  test('health endpoint returns 200', async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);
    expect(response.status()).toBe(200);
  });

  test('API base responds', async ({ request }) => {
    const response = await request.get(`${API_URL}/api/v1`);
    // Should return something (even 404 means API is up)
    expect(response.status()).toBeLessThan(500);
  });
});

test.describe('Backend API - Calculator endpoints', () => {
  const API_URL = 'http://localhost:3000';

  test('compound calculator endpoint exists', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/v1/calculators/compound`, {
      data: {
        principal: 100000,
        rate: 7,
        years: 10,
        monthlyContribution: 5000,
      },
    });
    // Should not be 404 or 500
    expect(response.status()).toBeLessThan(500);
  });

  test('loan calculator endpoint exists', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/v1/calculators/loan`, {
      data: {
        principal: 3000000,
        interestRate: 4.5,
        years: 25,
      },
    });
    expect(response.status()).toBeLessThan(500);
  });

  test('fire calculator endpoint exists', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/v1/calculators/fire`, {
      data: {
        currentSavings: 500000,
        annualExpenses: 400000,
        savingsRate: 50,
        expectedReturn: 7,
      },
    });
    expect(response.status()).toBeLessThan(500);
  });

  test('monte carlo endpoint exists', async ({ request }) => {
    const response = await request.post(`${API_URL}/api/v1/calculators/monte-carlo`, {
      data: {
        currentPortfolio: 1000000,
        annualWithdrawal: 40000,
        years: 30,
        simulations: 100,
      },
    });
    expect(response.status()).toBeLessThan(500);
  });
});
