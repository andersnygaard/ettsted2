/**
 * User Controller
 *
 * Handles user management endpoints:
 * - GET /api/v1/users/me - Get current user profile
 * - POST /api/v1/users/me/setup - First-time username setup
 * - PATCH /api/v1/users/me - Update user preferences
 */

import { Request, Response } from 'express';
import {
  getUserById,
  createUser,
  updateUser as updateUserService,
  updateUserWithValues,
  deleteUser
} from '../services/userService';
import { deleteAllSnapshotsForUser } from '../services/portfolioService';
import { asyncHandler } from '../middleware/errorHandler';
import { NotFoundError, ConflictError } from '../errors';
import { logger } from '../utils/logger';
import { isCiMockMode } from '../config/cosmosdb';
import { mockUser } from '../utils/mockData';

/**
 * Get current user profile
 *
 * GET /api/v1/users/me
 *
 * Returns the authenticated user's profile.
 * If user doesn't exist (first login), returns 404.
 *
 * @param req - Express request (req.user populated by validateAuth middleware)
 * @param res - Express response
 *
 * @returns 200 with user data, or 404 if user not found
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  // In CI mock mode, return mock user
  if (isCiMockMode()) {
    logger.debug('Returning mock user in CI mode');
    res.json({
      data: mockUser,
      success: true
    });
    return;
  }

  const userId = req.user!.userId;

  logger.debug('Fetching user profile', { userId });

  const user = await getUserById(userId);

  if (!user) {
    logger.info('User not found (first login)', { userId });
    throw new NotFoundError('User not found. Please complete setup.');
  }

  logger.info('User profile retrieved', { userId, nickname: user.nickname });
  res.json({
    data: user,
    success: true
  });
});

/**
 * Setup user profile (first-time onboarding)
 *
 * POST /api/v1/users/me/setup
 *
 * Creates a new user profile with chosen nickname.
 * Should only be called once per user (on first login).
 *
 * Request body:
 * {
 *   nickname: string (3-20 chars, alphanumeric + underscore)
 *   email?: string (optional)
 * }
 *
 * @param req - Express request
 * @param res - Express response
 *
 * @returns 201 with created user, or 409 if username taken
 */
export const setupUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { nickname, email } = req.body;

  logger.debug('Setting up new user', { userId, nickname, hasEmail: !!email });

  // Check if user already exists
  const existingUser = await getUserById(userId);
  if (existingUser) {
    logger.warn('User setup attempted but user already exists', {
      userId,
      existingNickname: existingUser.nickname
    });
    throw new ConflictError('User already set up', {
      nickname: existingUser.nickname
    });
  }

  // Create new user
  const newUser = await createUser({
    id: userId,
    nickname,
    email,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: {
      monthlySalary: 0,
      monthlySavings: 0,
      birthYear: new Date().getFullYear() - 30,
      plannedRetirementAge: 67
    },
    accounts: []
  });

  logger.info('User setup completed', { userId, nickname });
  res.status(201).json({
    data: newUser,
    success: true
  });
});

/**
 * Update user profile
 *
 * PATCH /api/v1/users/me
 *
 * Updates user settings (nickname, email, profile, etc.).
 * Cannot update id or createdAt.
 *
 * Request body (partial):
 * {
 *   email?: string
 *   preferences?: object
 * }
 *
 * @param req - Express request
 * @param res - Express response
 *
 * @returns 200 with updated user, or 404 if user not found
 */
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const updates = req.body;

  logger.debug('Updating user profile', { userId, fields: Object.keys(updates) });

  // Check if user exists
  const existingUser = await getUserById(userId);
  if (!existingUser) {
    logger.warn('User update attempted but user not found', { userId });
    throw new NotFoundError('User not found. Please complete setup first.');
  }

  // Check if accounts have values (from edit mode) - use updateUserWithValues to also update snapshot
  const hasAccountValues = updates.accounts?.some(
    (acc: { value?: number }) => acc.value !== undefined
  );

  logger.info('Update user check', {
    userId,
    hasAccounts: !!updates.accounts,
    accountCount: updates.accounts?.length,
    hasAccountValues,
    sampleAccount: updates.accounts?.[0],
  });

  const updatedUser = hasAccountValues
    ? await updateUserWithValues(userId, updates)
    : await updateUserService(userId, updates);

  logger.info('User profile updated', { userId, fields: Object.keys(updates) });
  res.json({
    data: updatedUser,
    success: true
  });
});

/**
 * Delete user account and all associated data
 *
 * DELETE /api/v1/users/me
 *
 * GDPR compliant account deletion. Deletes:
 * 1. All snapshots from portfolios container
 * 2. User document from users container
 *
 * This is irreversible and should be used with caution.
 *
 * @param req - Express request
 * @param res - Express response
 *
 * @returns 200 with success message, or 404 if user not found
 */
export const deleteMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  logger.info('User deletion initiated', { userId });

  // Check if user exists
  const existingUser = await getUserById(userId);
  if (!existingUser) {
    logger.warn('User deletion attempted but user not found', { userId });
    throw new NotFoundError('User not found');
  }

  // Delete all snapshots for user
  const snapshotsDeleted = await deleteAllSnapshotsForUser(userId);
  logger.info('Snapshots deleted during user deletion', { userId, count: snapshotsDeleted });

  // Delete user document
  await deleteUser(userId);
  logger.warn('User account deleted', { userId, snapshotCount: snapshotsDeleted });

  res.json({
    data: {
      message: 'Bruker slettet'
    },
    success: true
  });
});
