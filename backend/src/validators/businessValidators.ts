/**
 * Business Validation Layer
 *
 * Second layer of validation that checks business rules:
 * - Uniqueness constraints
 * - Resource ownership
 * - Data integrity
 * - Authorization checks
 *
 * Unlike input validators (Zod schemas), these validators may:
 * - Query the database
 * - Check cross-entity relationships
 * - Enforce business logic
 */

import { Request, Response, NextFunction } from 'express';
import { getUserByUsername } from '../services/userService';
import { logger } from '../utils/logger';

/**
 * Validates that username is not already taken
 *
 * Business rule: Usernames must be unique across all users
 *
 * @throws {ConflictError} if username is already taken
 */
export async function validateUsernameAvailable(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { username } = req.body;

  try {
    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      logger.warn('Username already taken', { username, existingUserId: existingUser.id });

      res.status(409).json({
        error: {
          message: 'Username already taken',
          code: 'CONFLICT',
          details: { field: 'username', value: username }
        },
        success: false
      });
      return;
    }

    logger.debug('Username available', { username });
    next();
  } catch (error) {
    logger.error('Error checking username availability', { username, error });
    res.status(500).json({
      error: {
        message: 'Failed to validate username availability',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}

/**
 * Validates that user owns the specified snapshot
 *
 * Business rule: Users can only modify their own snapshots
 *
 * @throws {ForbiddenError} if user doesn't own the snapshot
 * @throws {NotFoundError} if snapshot doesn't exist
 */
export async function validateSnapshotOwnership(
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  // This would require snapshot service integration
  // Placeholder for future implementation
  next();
}

/**
 * Validates that snapshot date is unique for user
 *
 * Business rule: Users can only have one snapshot per date
 *
 * @throws {ConflictError} if snapshot already exists for that date
 */
export async function validateUniqueDateForUser(
  _req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  // This would require snapshot service integration
  // Placeholder for future implementation
  next();
}
