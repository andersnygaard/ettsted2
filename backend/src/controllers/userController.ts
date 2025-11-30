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
  updateUser as updateUserService
} from '../services/userService';
import { logger } from '../utils/logger';

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
export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;

    logger.debug('Fetching user profile', { userId });

    const user = await getUserById(userId);

    if (!user) {
      logger.info('User not found (first login)', { userId });
      res.status(404).json({
        error: {
          message: 'User not found. Please complete setup.',
          code: 'NOT_FOUND'
        },
        success: false
      });
      return;
    }

    logger.info('User profile retrieved', { userId, nickname: user.nickname });
    res.status(200).json({
      data: user,
      success: true
    });
  } catch (error) {
    logger.error('Error fetching user profile', {
      userId: req.user!.userId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Failed to fetch user profile',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}

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
export async function setupUser(req: Request, res: Response): Promise<void> {
  try {
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
      res.status(409).json({
        error: {
          message: 'User already set up',
          code: 'CONFLICT',
          details: { nickname: existingUser.nickname }
        },
        success: false
      });
      return;
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
        annualExpenses: 0,
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
  } catch (error) {
    logger.error('Error setting up user', {
      userId: req.user!.userId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Failed to setup user',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}

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
export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const updates = req.body;

    logger.debug('Updating user profile', { userId, fields: Object.keys(updates) });

    // Check if user exists
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      logger.warn('User update attempted but user not found', { userId });
      res.status(404).json({
        error: {
          message: 'User not found. Please complete setup first.',
          code: 'NOT_FOUND'
        },
        success: false
      });
      return;
    }

    // Update user
    const updatedUser = await updateUserService(userId, updates);

    logger.info('User profile updated', { userId, fields: Object.keys(updates) });
    res.status(200).json({
      data: updatedUser,
      success: true
    });
  } catch (error) {
    logger.error('Error updating user profile', {
      userId: req.user!.userId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Failed to update user profile',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}
