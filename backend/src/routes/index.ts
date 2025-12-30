import { Router, Request, Response, IRouter } from 'express';
import { validateAuth } from '../middleware/auth';
import { getUsersContainer, isCiMockMode } from '../config/cosmosdb';
import { logger } from '../utils/logger';
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
 * GET /api/v1/health?deep=true - Also verifies DB connection
 *
 * Returns server health status, timestamp, and uptime
 * Use deep=true to verify database connection is working (for E2E tests)
 */
router.get('/health', async (req: Request, res: Response) => {
  const isDeep = req.query.deep === 'true';

  const baseHealth = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    mockMode: isCiMockMode(),
  };

  if (!isDeep) {
    return res.status(200).json({ data: baseHealth, success: true });
  }

  // In CI mock mode, skip database check
  if (isCiMockMode()) {
    return res.status(200).json({
      data: { ...baseHealth, db: 'mock' },
      success: true,
    });
  }

  // Deep check: verify database connection is working
  try {
    const container = getUsersContainer();
    // Attempt to read a non-existent item - 404 is fine, other errors mean DB is down
    await container.item('__healthcheck__', '__healthcheck__').read();
  } catch (error: unknown) {
    const cosmosError = error as { code?: number };
    // 404 is expected (item doesn't exist), any other error means DB problem
    if (cosmosError.code !== 404) {
      logger.warn('Deep health check failed - DB unreachable', { error });
      return res.status(503).json({
        data: { ...baseHealth, status: 'degraded', db: 'unreachable' },
        success: false,
      });
    }
  }

  return res.status(200).json({
    data: { ...baseHealth, db: 'connected' },
    success: true,
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

// Protected route modules (require authentication)
router.use('/kalkulatorer', validateAuth, calculatorRoutes);

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
