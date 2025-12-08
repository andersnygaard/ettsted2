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
import { getUserByNickname } from '../services/userService';
import { getSnapshotById, getSnapshotsByUserId } from '../services/portfolioService';
import { ForbiddenError, ConflictError } from '../errors';
import { logger } from '../utils/logger';

/**
 * Validates that nickname is not already taken
 *
 * Business rule: Nicknames must be unique across all users
 *
 * @throws {ConflictError} if nickname is already taken
 */
export async function validateNicknameAvailable(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { nickname } = req.body;

  try {
    const existingUser = await getUserByNickname(nickname);

    if (existingUser) {
      logger.warn('Nickname already taken', { nickname, existingUserId: existingUser.id });

      res.status(409).json({
        error: {
          message: 'Nickname already taken',
          code: 'CONFLICT',
          details: { field: 'nickname', value: nickname }
        },
        success: false
      });
      return;
    }

    logger.debug('Nickname available', { nickname });
    next();
  } catch (error) {
    logger.error('Error checking nickname availability', { nickname, error });
    res.status(500).json({
      error: {
        message: 'Failed to validate nickname availability',
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
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.user!.userId;
  const snapshotId = req.params.id;

  try {
    const snapshot = await getSnapshotById(userId, snapshotId);

    // If snapshot doesn't exist for this user, check if it belongs to someone else
    if (!snapshot) {
      // Try to fetch with a null userId partition key won't work, so this is secure
      // The snapshot either doesn't exist or belongs to another user
      logger.warn('Snapshot not found or does not belong to user', { userId, snapshotId });
      throw new ForbiddenError('Access denied to this snapshot');
    }

    // Verify ownership (paranoid check - should always be true since we queried by userId)
    if (snapshot.userId !== userId) {
      logger.warn('Snapshot ownership check failed', {
        userId,
        snapshotId,
        snapshotUserId: snapshot.userId
      });
      throw new ForbiddenError('Access denied to this snapshot');
    }

    logger.debug('Snapshot ownership validated', { userId, snapshotId });
    next();
  } catch (error) {
    // Re-throw our errors (ForbiddenError)
    if (error instanceof ForbiddenError) {
      throw error;
    }

    logger.error('Error validating snapshot ownership', { userId, snapshotId, error });
    throw new ForbiddenError('Failed to validate snapshot ownership');
  }
}

/**
 * Validates that snapshot date is unique for user
 *
 * Business rule: Users can only have one snapshot per date
 *
 * @throws {ConflictError} if snapshot already exists for that date
 */
export async function validateUniqueDateForUser(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.user!.userId;
  const { date } = req.body;
  const snapshotId = req.params.id; // For PATCH requests (optional)

  try {
    // Get all snapshots for user
    const snapshots = await getSnapshotsByUserId(userId);

    // Check if date already exists for another snapshot
    const duplicateSnapshot = snapshots.find(
      snapshot => snapshot.date === date && snapshot.id !== snapshotId
    );

    if (duplicateSnapshot) {
      logger.warn('Snapshot date already exists for user', {
        userId,
        date,
        existingSnapshotId: duplicateSnapshot.id
      });
      throw new ConflictError('Snapshot already exists for this date', {
        field: 'date',
        value: date,
        existingSnapshotId: duplicateSnapshot.id
      });
    }

    logger.debug('Snapshot date is unique for user', { userId, date });
    next();
  } catch (error) {
    // Re-throw our errors (ConflictError)
    if (error instanceof ConflictError) {
      throw error;
    }

    logger.error('Error validating snapshot date uniqueness', { userId, date, error });
    throw new ConflictError('Failed to validate snapshot date uniqueness');
  }
}
