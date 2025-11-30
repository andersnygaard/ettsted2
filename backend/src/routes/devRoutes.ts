/**
 * Development-only Routes
 *
 * These routes are only available in development mode.
 * Used for testing, seeding, and resetting the database.
 */

import { Router, IRouter, Request, Response } from 'express';
import { getUsersContainer, getPortfoliosContainer } from '../config/cosmosdb';
import { resetDatabase, clearUserData } from '../seed/reset';
import { logger } from '../utils/logger';

const router: IRouter = Router();

/**
 * Reset database to seed state
 *
 * POST /api/v1/dev/reset
 *
 * Clears all test data and reseeds with fixtures.
 * Useful for Playwright tests and manual testing.
 */
router.post('/reset', async (_req: Request, res: Response) => {
  try {
    logger.info('Dev reset endpoint called');

    const result = await resetDatabase({
      usersContainer: getUsersContainer(),
      portfoliosContainer: getPortfoliosContainer(),
    });

    res.status(200).json({
      data: {
        message: 'Database reset successfully',
        seeded: result,
      },
      success: true,
    });
  } catch (error) {
    logger.error('Dev reset failed', { error });
    res.status(500).json({
      error: {
        message: 'Failed to reset database',
        code: 'RESET_FAILED',
      },
      success: false,
    });
  }
});

/**
 * Clear database (no reseed)
 *
 * POST /api/v1/dev/clear
 *
 * Clears all test data without reseeding.
 */
router.post('/clear', async (_req: Request, res: Response) => {
  try {
    logger.info('Dev clear endpoint called');

    await resetDatabase({
      usersContainer: getUsersContainer(),
      portfoliosContainer: getPortfoliosContainer(),
      clearOnly: true,
    });

    res.status(200).json({
      data: {
        message: 'Database cleared successfully',
      },
      success: true,
    });
  } catch (error) {
    logger.error('Dev clear failed', { error });
    res.status(500).json({
      error: {
        message: 'Failed to clear database',
        code: 'CLEAR_FAILED',
      },
      success: false,
    });
  }
});

/**
 * Clear data for a specific user
 *
 * DELETE /api/v1/dev/users/:userId
 */
router.delete('/users/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    logger.info('Dev delete user endpoint called', { userId });

    await clearUserData(userId, {
      usersContainer: getUsersContainer(),
      portfoliosContainer: getPortfoliosContainer(),
    });

    res.status(200).json({
      data: {
        message: `User ${userId} deleted successfully`,
      },
      success: true,
    });
  } catch (error) {
    logger.error('Dev delete user failed', { error });
    res.status(500).json({
      error: {
        message: 'Failed to delete user',
        code: 'DELETE_FAILED',
      },
      success: false,
    });
  }
});

export default router;
