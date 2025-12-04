/**
 * User Input Validators
 *
 * Validates user-related inputs for API endpoints.
 * Two-layer validation: input validation + business validation.
 */

import { Request, Response, NextFunction } from 'express';
import { getUserByNickname } from '../services/userService';
import { logger } from '../utils/logger';

/**
 * Nickname validation rules:
 * - 3-20 characters
 * - Alphanumeric characters (a-z, A-Z, 0-9)
 * - Underscores allowed
 * - No special characters, spaces, or emojis
 */
const NICKNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

/**
 * Email validation (basic format check)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates nickname setup request body
 *
 * Checks:
 * - nickname field exists and is string
 * - nickname matches format requirements (3-20 chars, alphanumeric + underscore)
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
  const { nickname, email } = req.body;

  // Validate nickname is provided
  if (!nickname) {
    res.status(400).json({
      error: {
        message: 'Nickname is required',
        code: 'VALIDATION_ERROR',
        details: { field: 'nickname' }
      },
      success: false
    });
    return;
  }

  // Validate nickname is string
  if (typeof nickname !== 'string') {
    res.status(400).json({
      error: {
        message: 'Nickname must be a string',
        code: 'VALIDATION_ERROR',
        details: { field: 'nickname', type: typeof nickname }
      },
      success: false
    });
    return;
  }

  // Validate nickname format
  if (!NICKNAME_REGEX.test(nickname)) {
    res.status(400).json({
      error: {
        message: 'Nickname must be 3-20 characters (alphanumeric and underscores only)',
        code: 'VALIDATION_ERROR',
        details: {
          field: 'nickname',
          value: nickname,
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

  logger.debug('Setup request validation passed', { nickname, hasEmail: !!email });
  next();
}

/**
 * Validates nickname uniqueness (business validation)
 *
 * Checks that nickname is not already taken by another user.
 * Returns 409 Conflict if nickname exists.
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
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
 * Validates user update request body
 *
 * Checks:
 * - At least one field to update is provided
 * - email (if provided) is valid format
 * - profile (if provided) is object
 * - Blocked fields (id, createdAt) are not included
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
  const blockedFields = ['id', 'createdAt'];
  const hasBlockedField = updateFields.some(field => blockedFields.includes(field));
  if (hasBlockedField) {
    res.status(400).json({
      error: {
        message: 'Cannot update id or createdAt',
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

  // Validate profile if provided
  if (updates.profile !== undefined) {
    if (typeof updates.profile !== 'object' || updates.profile === null || Array.isArray(updates.profile)) {
      res.status(400).json({
        error: {
          message: 'Profile must be an object',
          code: 'VALIDATION_ERROR',
          details: { field: 'profile', type: typeof updates.profile }
        },
        success: false
      });
      return;
    }
  }

  // Validate accounts if provided
  if (updates.accounts !== undefined) {
    if (!Array.isArray(updates.accounts)) {
      res.status(400).json({
        error: {
          message: 'Accounts must be an array',
          code: 'VALIDATION_ERROR',
          details: { field: 'accounts', type: typeof updates.accounts }
        },
        success: false
      });
      return;
    }

    // Validate each account
    const validCategories = ['sparing', 'gjeld', 'pensjon'];
    const errors: { index: number; field: string; message: string }[] = [];

    (updates.accounts as unknown[]).forEach((account: unknown, index: number) => {
      const acc = account as Record<string, unknown>;
      if (!acc.id || typeof acc.id !== 'string') {
        errors.push({ index, field: 'id', message: 'Account id is required and must be a string' });
      }
      if (!acc.name || typeof acc.name !== 'string') {
        errors.push({ index, field: 'name', message: 'Account name is required and must be a string' });
      }
      if (!acc.category || !validCategories.includes(acc.category as string)) {
        errors.push({ index, field: 'category', message: `Category must be one of: ${validCategories.join(', ')}` });
      }
      if (typeof acc.isActive !== 'boolean') {
        errors.push({ index, field: 'isActive', message: 'isActive must be a boolean' });
      }
      if (typeof acc.sortOrder !== 'number') {
        errors.push({ index, field: 'sortOrder', message: 'sortOrder must be a number' });
      }
    });

    if (errors.length > 0) {
      res.status(400).json({
        error: {
          message: 'Invalid accounts data',
          code: 'VALIDATION_ERROR',
          details: errors
        },
        success: false
      });
      return;
    }
  }

  logger.debug('Update request validation passed', { fields: updateFields });
  next();
}
