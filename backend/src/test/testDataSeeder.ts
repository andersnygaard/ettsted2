/**
 * Test Data Seeder
 *
 * Utility for creating deterministic test data in integration tests.
 * Provides methods to seed users, accounts, and snapshots with known values.
 */

import crypto from 'crypto';
import { createUser, deleteUser } from '../services/userService';
import { createSnapshot, deleteAllSnapshotsForUser } from '../services/portfolioService';
import { User, AccountConfig } from '../models/User';
import { MonthlySnapshot, Account } from '../models/Portfolio';

// Must match the secret in tokenUtils.ts
const DEMO_SECRET = process.env.DEMO_JWT_SECRET || 'demo-secret-key-for-development';

export class TestDataSeeder {
  public readonly userId: string;
  private seededUser = false;

  constructor(userId?: string) {
    this.userId = userId ?? `test-user-${Date.now()}`;
  }

  /**
   * Create a test user with the specified accounts
   */
  async seedUser(accounts: Omit<AccountConfig, 'createdAt'>[]): Promise<User> {
    const user: User = {
      id: this.userId,
      nickname: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        monthlySalary: 50000,
        monthlySavings: 16667,  // ~33% savings rate, gives ~400k annual expenses
        birthYear: 1990,
        plannedRetirementAge: 60,
      },
      accounts: accounts.map((acc) => ({
        ...acc,
        createdAt: new Date(),
      })),
    };

    const created = await createUser(user);
    this.seededUser = true;
    return created;
  }

  /**
   * Create a snapshot with exact account values
   *
   * @param date - Date in dd.MM.yyyy format
   * @param accountValues - Map of accountId to value
   * @param userAccounts - Account configs to derive names/assetClasses from
   */
  async seedSnapshot(
    date: string,
    accountValues: Record<string, number>,
    userAccounts: Omit<AccountConfig, 'createdAt'>[]
  ): Promise<MonthlySnapshot> {
    const accounts: Account[] = Object.entries(accountValues).map(([id, value]) => {
      const config = userAccounts.find((a) => a.id === id);
      return {
        id,
        name: config?.name ?? id,
        assetClass: this.categoryToAssetClass(config?.category ?? 'sparing'),
        value,
      };
    });

    const totalNetWorth = accounts.reduce((sum, a) => sum + a.value, 0);

    const snapshot: MonthlySnapshot = {
      id: `${this.userId}-snap-${date.replace(/\./g, '-')}`,
      userId: this.userId,
      date,
      accounts,
      totalNetWorth,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return createSnapshot(snapshot);
  }

  /**
   * Generate a valid auth token for this test user
   */
  getAuthToken(): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      sub: this.userId,
      email: 'test@example.com',
      name: 'Test User',
      iss: 'finans-demo',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');

    const signature = crypto
      .createHmac('sha256', DEMO_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    return `${headerB64}.${payloadB64}.${signature}`;
  }

  /**
   * Clean up all test data
   */
  async cleanup(): Promise<void> {
    try {
      await deleteAllSnapshotsForUser(this.userId);
    } catch {
      // Ignore if no snapshots exist
    }

    if (this.seededUser) {
      try {
        await deleteUser(this.userId);
      } catch {
        // Ignore if user doesn't exist
      }
    }
  }

  private categoryToAssetClass(category: string): string {
    switch (category) {
      case 'gjeld':
        return 'gjeld';
      case 'pensjon':
        return 'pensjon';
      default:
        return 'aksjer';
    }
  }
}
