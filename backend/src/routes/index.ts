/// <reference path="../types/express.d.ts" />
import { Router, Request, Response, IRouter } from 'express';
import { validateAuth } from '../middleware/auth';
import { checkDemoSession, validateAuthWithDemo } from '../middleware/demoAuth';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import accountRoutes from './accountRoutes';
import snapshotRoutes from './snapshotRoutes';
import calculatorRoutes from './calculatorRoutes';
import summaryRoutes from './summaryRoutes';
import devRoutes from './devRoutes';

// Combined auth middleware: checks demo session first, then validates auth
const authMiddleware = [checkDemoSession, validateAuthWithDemo(validateAuth)];

/**
 * Main route aggregator
 *
 * Aggregates all API routes and mounts them under /api/v1.
 * Includes health check endpoint and protected test endpoint.
 *
 * Protected routes use validateAuth middleware to require authentication.
 */

const router: IRouter = Router();

/**
 * Health check endpoint
 *
 * GET /api/v1/health
 * Returns server health status, timestamp, and uptime
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    },
    success: true
  });
});

/**
 * Test endpoint to verify authentication middleware
 *
 * GET /api/v1/test/me
 * Requires authentication - returns authenticated user info
 */
router.get('/test/me', authMiddleware, (req: Request, res: Response) => {
  res.status(200).json({
    data: {
      message: 'Authentication successful',
      user: req.user
    },
    success: true
  });
});

// Public route modules (no authentication required)
router.use('/auth', authRoutes);
router.use('/calculators', calculatorRoutes);

// Protected route modules (require authentication or demo session)
router.use('/users', authMiddleware, userRoutes);
router.use('/accounts', authMiddleware, accountRoutes);
router.use('/snapshots', authMiddleware, snapshotRoutes);
router.use('/', authMiddleware, summaryRoutes);

// Development-only routes (database seeding, reset)
if (process.env.NODE_ENV === 'development') {
  router.use('/dev', devRoutes);
}

// Future route modules will be mounted here:
// router.use('/import', validateAuth, importRoutes);

export default router;
