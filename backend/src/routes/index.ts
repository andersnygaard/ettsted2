import { Router, Request, Response, IRouter } from 'express';
import { validateAuth } from '../middleware/auth';
import userRoutes from './userRoutes';
import snapshotRoutes from './snapshotRoutes';

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

// Protected route modules (require authentication)
router.use('/users', validateAuth, userRoutes);
router.use('/snapshots', validateAuth, snapshotRoutes);

// Future route modules will be mounted here:
// router.use('/calculators', calculatorRoutes); // Public - no auth
// router.use('/import', validateAuth, importRoutes);

export default router;
