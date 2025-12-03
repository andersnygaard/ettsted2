/**
 * Authentication Routes
 *
 * Handles demo login for users who want to try the app without OAuth.
 */

import { Router, Request, Response, IRouter } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';
import { getUserById, createUser } from '../services/userService';
import { getSnapshotsByUserId, createSnapshot } from '../services/portfolioService';
import { User } from '../models/User';
import { MonthlySnapshot } from '../models/Portfolio';

const router: IRouter = Router();

/**
 * Demo user constants
 */
const DEMO_USER_ID = 'demo-user-001';
const DEMO_SECRET = process.env.DEMO_JWT_SECRET || 'demo-secret-key-for-development';

/**
 * Create a simple JWT token with HMAC-SHA256 signature.
 */
function createDemoToken(): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload = {
    sub: DEMO_USER_ID,
    email: 'demo@finans.no',
    name: 'Demo Bruker',
    iss: 'finans-demo',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
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
 * Verify demo token signature
 */
export function verifyDemoToken(token: string): { sub: string; email: string; name: string; iss: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signature] = parts;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', DEMO_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      logger.debug('Demo token signature mismatch');
      return null;
    }

    // Decode and parse payload
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      logger.debug('Demo token expired');
      return null;
    }

    // Check issuer
    if (payload.iss !== 'finans-demo') {
      logger.debug('Demo token has wrong issuer');
      return null;
    }

    return payload;
  } catch (error) {
    logger.error('Failed to verify demo token', { error });
    return null;
  }
}

/**
 * Get or create demo user
 */
async function getOrCreateDemoUser(): Promise<User> {
  let user = await getUserById(DEMO_USER_ID);

  if (!user) {
    // Create demo user with sample data
    const demoUser: User = {
      id: DEMO_USER_ID,
      nickname: 'Demo Bruker',
      email: 'demo@finans.no',
      createdAt: new Date(),
      updatedAt: new Date(),
      profile: {
        monthlySalary: 55000,
        annualExpenses: 400000,
        birthYear: 1990,
        plannedRetirementAge: 60,
        fireNumber: 10000000,
      },
      accounts: [
        {
          id: 'demo-acc-nordnet',
          name: 'Nordnet',
          category: 'sparing',
          isActive: true,
          sortOrder: 1,
          createdAt: new Date(),
        },
        {
          id: 'demo-acc-kron',
          name: 'Kron',
          category: 'sparing',
          isActive: true,
          sortOrder: 2,
          createdAt: new Date(),
        },
        {
          id: 'demo-acc-sparekonto',
          name: 'Sparekonto',
          category: 'sparing',
          isActive: true,
          sortOrder: 3,
          createdAt: new Date(),
        },
        {
          id: 'demo-acc-huslan',
          name: 'Boliglån',
          category: 'gjeld',
          isActive: true,
          sortOrder: 1,
          createdAt: new Date(),
          loanDetails: {
            interestRate: 5.0,
            remainingYears: 25,
            originalAmount: 3000000,
          },
        },
        {
          id: 'demo-acc-arbeidsgiver',
          name: 'Arbeidsgiver',
          category: 'pensjon',
          isActive: true,
          sortOrder: 1,
          createdAt: new Date(),
        },
        {
          id: 'demo-acc-folketrygden',
          name: 'Folketrygden',
          category: 'pensjon',
          isActive: true,
          sortOrder: 2,
          createdAt: new Date(),
        },
      ],
    };

    user = await createUser(demoUser);
    logger.info('Demo user created', { userId: DEMO_USER_ID });
  }

  return user;
}

/**
 * Generate demo snapshots with realistic portfolio data
 */
function generateDemoSnapshots(): Omit<MonthlySnapshot, 'createdAt' | 'updatedAt'>[] {
  const snapshots: Omit<MonthlySnapshot, 'createdAt' | 'updatedAt'>[] = [];

  // Generate 12 months of data (Dec 2024 to Nov 2025)
  const baseValues = {
    nordnet: 280000,
    kron: 520000,
    sparekonto: 95000,
    huslan: -2400000,
    arbeidsgiver: 450000,
    folketrygden: 380000,
  };

  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, 11 + i, 1); // Start from Dec 2024
    const dateStr = `01.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
    const monthId = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    // Simulate growth with some variance
    const growthFactor = 1 + (0.005 + Math.random() * 0.015); // 0.5-2% monthly growth
    const nordnetValue = Math.round(baseValues.nordnet * Math.pow(growthFactor, i) + (Math.random() - 0.5) * 10000);
    const kronValue = Math.round(baseValues.kron * Math.pow(growthFactor, i) + (Math.random() - 0.5) * 15000);
    const sparekontoValue = Math.round(baseValues.sparekonto + i * 2000 + (Math.random() - 0.5) * 3000);
    const huslanValue = Math.round(baseValues.huslan + i * 4000); // Paying down debt
    const arbeidsgiverValue = Math.round(baseValues.arbeidsgiver * Math.pow(1.005, i) + i * 3000);
    const folketrygdenValue = Math.round(baseValues.folketrygden + i * 1500);

    const sparingSum = nordnetValue + kronValue + sparekontoValue;
    const gjeldSum = huslanValue;
    const pensjonSum = arbeidsgiverValue + folketrygdenValue;
    const totalNetWorth = sparingSum + gjeldSum + pensjonSum;

    snapshots.push({
      id: `demo-snap-${monthId}`,
      userId: DEMO_USER_ID,
      date: dateStr,
      accounts: [
        { id: 'demo-acc-nordnet', name: 'Nordnet', assetClass: 'aksjer', value: nordnetValue },
        { id: 'demo-acc-kron', name: 'Kron', assetClass: 'fond', value: kronValue },
        { id: 'demo-acc-sparekonto', name: 'Sparekonto', assetClass: 'bankkonto', value: sparekontoValue },
        { id: 'demo-acc-huslan', name: 'Boliglån', assetClass: 'gjeld', value: huslanValue },
        { id: 'demo-acc-arbeidsgiver', name: 'Arbeidsgiver', assetClass: 'pensjon', value: arbeidsgiverValue },
        { id: 'demo-acc-folketrygden', name: 'Folketrygden', assetClass: 'pensjon', value: folketrygdenValue },
      ],
      totalNetWorth,
    });
  }

  return snapshots;
}

/**
 * Seed demo snapshots if they don't exist
 */
async function seedDemoSnapshots(): Promise<void> {
  const existingSnapshots = await getSnapshotsByUserId(DEMO_USER_ID);

  if (existingSnapshots.length > 0) {
    logger.debug('Demo snapshots already exist', { count: existingSnapshots.length });
    return;
  }

  const demoSnapshots = generateDemoSnapshots();
  const now = new Date();

  for (const snapshot of demoSnapshots) {
    await createSnapshot({
      ...snapshot,
      createdAt: now,
      updatedAt: now,
    });
  }

  logger.info('Demo snapshots seeded', { count: demoSnapshots.length });
}

/**
 * Demo login endpoint
 *
 * POST /api/v1/auth/demo-login
 *
 * Creates a demo session without OAuth.
 * Returns a JWT token that can be used for API requests.
 */
router.post('/demo-login', async (_req: Request, res: Response) => {
  try {
    logger.info('Demo login requested');

    // Get or create demo user and seed snapshots
    const user = await getOrCreateDemoUser();
    await seedDemoSnapshots();

    // Generate demo token
    const token = createDemoToken();

    logger.info('Demo login successful', { userId: DEMO_USER_ID });

    res.status(200).json({
      data: {
        token,
        user: {
          id: user.id,
          nickname: user.nickname,
          email: user.email,
        },
      },
      success: true,
    });
  } catch (error) {
    logger.error('Demo login failed', { error });
    res.status(500).json({
      error: {
        message: 'Demo login failed',
        code: 'DEMO_LOGIN_FAILED',
      },
      success: false,
    });
  }
});

export default router;
