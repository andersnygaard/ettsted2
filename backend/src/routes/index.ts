import { Router, Request, Response, IRouter } from 'express';
import { validateAuth } from '../middleware/auth';
import userRoutes from './userRoutes';
import accountRoutes from './accountRoutes';
import snapshotRoutes from './snapshotRoutes';
import calculatorRoutes from './calculatorRoutes';
import summaryRoutes from './summaryRoutes';
import devRoutes from './devRoutes';
import authRoutes from './authRoutes';
import importRoutes from './importRoutes';

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
router.get('/test/me', validateAuth, (req: Request, res: Response) => {
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

// Protected route modules (require authentication)
router.use('/users', validateAuth, userRoutes);
router.use('/accounts', validateAuth, accountRoutes);
router.use('/snapshots', validateAuth, snapshotRoutes);
router.use('/import', validateAuth, importRoutes);
router.use('/', validateAuth, summaryRoutes);

// Development-only routes (database seeding, reset)
// Requires both NODE_ENV=development AND explicit DEV_MODE_ENABLED=true
if (process.env.NODE_ENV === 'development' &&
    process.env.DEV_MODE_ENABLED === 'true') {
  router.use('/dev', devRoutes);
}

export default router;
