/**
 * Authentication Routes
 *
 * Public routes for authentication-related operations.
 * Includes demo login endpoint.
 */

import { Router, Request, Response, IRouter } from 'express';
import { resetDemoUser, DEMO_USER_ID } from '../services/demoService';
import { DEMO_COOKIE_NAME } from '../middleware/demoAuth';
import { logger } from '../utils/logger';

const router: IRouter = Router();

/**
 * Demo login endpoint
 *
 * POST /api/v1/auth/demo-login
 *
 * Resets demo user data and sets demo session cookie.
 * Returns demo user info for immediate dashboard access.
 */
router.post('/demo-login', async (_req: Request, res: Response) => {
  try {
    logger.info('Demo login requested');

    // Reset demo user with fresh data
    const { user, snapshotCount } = await resetDemoUser();

    // Set demo session cookie (HTTP only, same-site strict)
    res.cookie(DEMO_COOKIE_NAME, 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/',
    });

    logger.info('Demo login successful', {
      userId: DEMO_USER_ID,
      snapshotCount,
    });

    res.status(200).json({
      data: {
        user: {
          id: user.id,
          nickname: user.nickname,
          email: user.email,
          profile: user.profile,
          accounts: user.accounts,
        },
        isDemo: true,
        message: 'Demo session started',
      },
      success: true,
    });
  } catch (error) {
    logger.error('Demo login failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    res.status(500).json({
      error: {
        message: 'Kunne ikke starte demo-sesjon',
        code: 'DEMO_LOGIN_FAILED',
      },
      success: false,
    });
  }
});

/**
 * Demo logout endpoint
 *
 * POST /api/v1/auth/demo-logout
 *
 * Clears demo session cookie.
 */
router.post('/demo-logout', (_req: Request, res: Response) => {
  res.clearCookie(DEMO_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  logger.info('Demo logout successful');

  res.status(200).json({
    data: {
      message: 'Demo session ended',
    },
    success: true,
  });
});

export default router;
