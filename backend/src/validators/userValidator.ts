/**
 * User Input Validators
 *
 * Validates user-related inputs for API endpoints.
 * Two-layer validation: input validation + business validation.
 */

import { Request, Response, NextFunction } from 'express';
import { getUserByUsername } from '../services/userService';
import { logger } from '../utils/logger';

/**
 * Username validation rules:
 * - 3-20 characters
 * - Alphanumeric characters (a-z, A-Z, 0-9)
 * - Underscores allowed
 * - No special characters, spaces, or emojis
 */
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

/**
 * Email validation (basic format check)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates username setup request body
 *
 * Checks:
 * - username field exists and is string
 * - username matches format requirements (3-20 chars, alphanumeric + underscore)
 * - email field (if provided) is valid format
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export function validateSetupRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { username, email } = req.body;

  // Validate username is provided
  if (!username) {
    res.status(400).json({
      error: {
        message: 'Username is required',
        code: 'VALIDATION_ERROR',
        details: { field: 'username' }
      },
      success: false
    });
    return;
  }

  // Validate username is string
  if (typeof username !== 'string') {
    res.status(400).json({
      error: {
        message: 'Username must be a string',
        code: 'VALIDATION_ERROR',
        details: { field: 'username', type: typeof username }
      },
      success: false
    });
    return;
  }

  // Validate username format
  if (!USERNAME_REGEX.test(username)) {
    res.status(400).json({
      error: {
        message: 'Username must be 3-20 characters (alphanumeric and underscores only)',
        code: 'VALIDATION_ERROR',
        details: {
          field: 'username',
          value: username,
          pattern: '3-20 characters, a-z, A-Z, 0-9, _'
        }
      },
      success: false
    });
    return;
  }

  // Validate email if provided
  if (email !== undefined) {
    if (typeof email !== 'string') {
      res.status(400).json({
        error: {
          message: 'Email must be a string',
          code: 'VALIDATION_ERROR',
          details: { field: 'email', type: typeof email }
        },
        success: false
      });
      return;
    }

    if (email.length > 0 && !EMAIL_REGEX.test(email)) {
      res.status(400).json({
        error: {
          message: 'Invalid email format',
          code: 'VALIDATION_ERROR',
          details: { field: 'email', value: email }
        },
        success: false
      });
      return;
    }
  }

  logger.debug('Setup request validation passed', { username, hasEmail: !!email });
  next();
}

/**
 * Validates username uniqueness (business validation)
 *
 * Checks that username is not already taken by another user.
 * Returns 409 Conflict if username exists.
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
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
 * Validates user update request body
 *
 * Checks:
 * - At least one field to update is provided
 * - email (if provided) is valid format
 * - preferences (if provided) is object
 * - Blocked fields (id, username, createdAt) are not included
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export function validateUpdateRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const updates = req.body;

  // Check that request body is an object
  if (typeof updates !== 'object' || updates === null || Array.isArray(updates)) {
    res.status(400).json({
      error: {
        message: 'Request body must be an object',
        code: 'VALIDATION_ERROR',
        details: { type: typeof updates }
      },
      success: false
    });
    return;
  }

  // Check that at least one field is provided
  const updateFields = Object.keys(updates);
  if (updateFields.length === 0) {
    res.status(400).json({
      error: {
        message: 'At least one field to update is required',
        code: 'VALIDATION_ERROR',
        details: { fields: updateFields }
      },
      success: false
    });
    return;
  }

  // Validate blocked fields are not included
  const blockedFields = ['id', 'username', 'createdAt'];
  const hasBlockedField = updateFields.some(field => blockedFields.includes(field));
  if (hasBlockedField) {
    res.status(400).json({
      error: {
        message: 'Cannot update id, username, or createdAt',
        code: 'VALIDATION_ERROR',
        details: {
          blockedFields,
          attempted: updateFields.filter(f => blockedFields.includes(f))
        }
      },
      success: false
    });
    return;
  }

  // Validate email if provided
  if (updates.email !== undefined) {
    if (typeof updates.email !== 'string') {
      res.status(400).json({
        error: {
          message: 'Email must be a string',
          code: 'VALIDATION_ERROR',
          details: { field: 'email', type: typeof updates.email }
        },
        success: false
      });
      return;
    }

    if (updates.email.length > 0 && !EMAIL_REGEX.test(updates.email)) {
      res.status(400).json({
        error: {
          message: 'Invalid email format',
          code: 'VALIDATION_ERROR',
          details: { field: 'email', value: updates.email }
        },
        success: false
      });
      return;
    }
  }

  // Validate preferences if provided
  if (updates.preferences !== undefined) {
    if (typeof updates.preferences !== 'object' || updates.preferences === null || Array.isArray(updates.preferences)) {
      res.status(400).json({
        error: {
          message: 'Preferences must be an object',
          code: 'VALIDATION_ERROR',
          details: { field: 'preferences', type: typeof updates.preferences }
        },
        success: false
      });
      return;
    }
  }

  logger.debug('Update request validation passed', { fields: updateFields });
  next();
}
