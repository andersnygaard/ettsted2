/**
 * Sparing API Integration Tests
 *
 * Tests the savings calculation endpoint and verifies that
 * account deletion properly affects savings totals.
 */

import { describe, it, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { Application } from 'express';
import { createApp } from '../../app';
import { TestDataSeeder } from '../testDataSeeder';
import { AccountConfig } from '../../models/User';

describe('Sparing API', () => {
  let app: Application;
  let seeder: TestDataSeeder;

  const testAccounts: Omit<AccountConfig, 'createdAt'>[] = [
    { id: 'acc-nordnet', name: 'Nordnet', category: 'sparing', isActive: true, sortOrder: 1 },
    { id: 'acc-kron', name: 'Kron', category: 'sparing', isActive: true, sortOrder: 2 },
    { id: 'acc-sparekonto', name: 'Sparekonto', category: 'sparing', isActive: true, sortOrder: 3 },
  ];

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(async () => {
    seeder = new TestDataSeeder();
    await seeder.seedUser(testAccounts);
    await seeder.seedSnapshot(
      '01.01.2025',
      {
        'acc-nordnet': 100000,
        'acc-kron': 200000,
        'acc-sparekonto': 50000,
      },
      testAccounts
    );
  });

  afterEach(async () => {
    await seeder.cleanup();
  });

  it('returns sum of all sparing accounts in latest snapshot', async () => {
    const token = seeder.getAuthToken();

    const response = await request(app)
      .get('/api/v1/sparing')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.sumSavings).toBe(350000); // 100k + 200k + 50k
  });

  it('deleting accounts reduces savings sum', async () => {
    const token = seeder.getAuthToken();

    // 1. Verify initial savings = 350,000
    const initial = await request(app)
      .get('/api/v1/sparing')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(initial.body.data.sumSavings).toBe(350000);

    // 2. Delete two accounts
    await request(app)
      .delete('/api/v1/accounts/acc-kron')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    await request(app)
      .delete('/api/v1/accounts/acc-sparekonto')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    // 3. Savings should now be 100,000 (only Nordnet remains)
    const after = await request(app)
      .get('/api/v1/sparing')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(after.body.data.sumSavings).toBe(100000);
  });

  it('PATCH /users/me with removed accounts reduces savings sum (wizard flow)', async () => {
    const token = seeder.getAuthToken();

    // 1. Verify initial savings = 350,000
    const initial = await request(app)
      .get('/api/v1/sparing')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(initial.body.data.sumSavings).toBe(350000);

    // 2. Update user with only one account (simulates wizard removing 2 accounts)
    const updatedAccounts = [
      { id: 'acc-nordnet', name: 'Nordnet', category: 'sparing', isActive: true, sortOrder: 1 },
    ];

    await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ accounts: updatedAccounts })
      .expect(200);

    // 3. Savings should now be 100,000 (only Nordnet remains)
    const after = await request(app)
      .get('/api/v1/sparing')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(after.body.data.sumSavings).toBe(100000);
  });
});
