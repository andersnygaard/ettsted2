/**
 * Authentication Routes
 *
 * Handles demo login for users who want to try the app without OAuth.
 */

import { Router, Request, Response, IRouter } from 'express';
import crypto from 'crypto';
import { logger } from '../utils/logger';
import { getUserById, createUser, deleteUser } from '../services/userService';
import { deleteAllSnapshotsForUser, createSnapshot } from '../services/portfolioService';
import {
  loadDemoProfile,
  isValidDemoProfile,
  DEMO_PROFILE_NAMES,
  DemoProfileName,
} from '../seed/fixtures/demo';
import { demoLoginRateLimiter } from '../middleware/rateLimiter';

const router: IRouter = Router();

/**
 * Demo user constants
 */
const DEMO_USER_ID = 'demo-user-001';
const DEMO_SECRET = process.env.DEMO_JWT_SECRET || 'demo-secret-key-for-development';
const IS_DEV = process.env.NODE_ENV !== 'production';

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
 * Clear and seed demo data from JSON fixtures
 */
async function seedDemoData(profileName: DemoProfileName): Promise<void> {
  // Load profile from JSON fixtures
  const { user, snapshots } = loadDemoProfile(profileName);

  // Delete existing demo data (ignore errors if not found)
  try {
    await deleteAllSnapshotsForUser(DEMO_USER_ID);
  } catch {
    // Ignore - snapshots may not exist
  }

  try {
    await deleteUser(DEMO_USER_ID);
  } catch {
    // Ignore - user may not exist
  }

  // Create demo user
  await createUser(user);
  logger.info('Demo user created from fixture', { userId: DEMO_USER_ID, profile: profileName });

  // Create snapshots
  for (const snapshot of snapshots) {
    await createSnapshot(snapshot);
  }
  logger.info('Demo snapshots seeded from fixture', {
    count: snapshots.length,
    profile: profileName,
  });
}

/**
 * Demo login endpoint
 *
 * POST /api/v1/auth/demo-login
 *
 * Creates a demo session without OAuth.
 * Returns a JWT token that can be used for API requests.
 *
 * Query params (dev only):
 *   - profile: Demo profile to use (standard, empty, debt-heavy, fire-achieved)
 */
router.post('/demo-login', demoLoginRateLimiter, async (req: Request, res: Response) => {
  try {
    // Get profile from query param (dev only) or default to 'standard'
    let profileName: DemoProfileName = 'standard';
    const requestedProfile = req.query.profile as string | undefined;

    if (requestedProfile) {
      if (!IS_DEV) {
        logger.warn('Profile selection attempted in production, using standard');
      } else if (isValidDemoProfile(requestedProfile)) {
        profileName = requestedProfile;
      } else {
        return res.status(400).json({
          error: {
            message: `Invalid profile. Available: ${DEMO_PROFILE_NAMES.join(', ')}`,
            code: 'INVALID_PROFILE',
          },
          success: false,
        });
      }
    }

    logger.info('Demo login requested', { profile: profileName });

    // Clear and seed demo data from fixtures
    await seedDemoData(profileName);

    // Get user for response
    const user = await getUserById(DEMO_USER_ID);
    if (!user) {
      throw new Error('Demo user not found after seeding');
    }

    // Generate demo token
    const token = createDemoToken();

    logger.info('Demo login successful', { userId: DEMO_USER_ID, profile: profileName });

    return res.status(200).json({
      data: {
        token,
        user: {
          id: user.id,
          nickname: user.nickname,
          email: user.email,
        },
        profile: profileName,
      },
      success: true,
    });
  } catch (error) {
    logger.error('Demo login failed', { error });
    return res.status(500).json({
      error: {
        message: 'Demo login failed',
        code: 'DEMO_LOGIN_FAILED',
      },
      success: false,
    });
  }
});

/**
 * Get available demo profiles (dev only)
 *
 * GET /api/v1/auth/demo-profiles
 */
router.get('/demo-profiles', (_req: Request, res: Response) => {
  if (!IS_DEV) {
    return res.status(404).json({
      error: { message: 'Not found', code: 'NOT_FOUND' },
      success: false,
    });
  }

  return res.status(200).json({
    data: {
      profiles: DEMO_PROFILE_NAMES,
      default: 'standard',
    },
    success: true,
  });
});

export default router;
