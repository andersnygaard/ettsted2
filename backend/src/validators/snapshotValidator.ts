/**
 * Snapshot Input Validators
 *
 * Validates snapshot-related inputs for API endpoints.
 * Two-layer validation: input validation + business validation.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Norwegian date format: dd.MM.yyyy (e.g., "01.01.2024")
 */
const DATE_REGEX = /^\d{2}\.\d{2}\.\d{4}$/;

/**
 * Account name constraints
 */
const ACCOUNT_NAME_MIN_LENGTH = 1;
const ACCOUNT_NAME_MAX_LENGTH = 100;

/**
 * Asset class constraints
 */
const ASSET_CLASS_MIN_LENGTH = 1;
const ASSET_CLASS_MAX_LENGTH = 50;

/**
 * Notes constraints
 */
const NOTES_MAX_LENGTH = 500;

/**
 * Validates if a date string is in dd.MM.yyyy format and represents a valid date
 */
function isValidDate(dateStr: string): boolean {
  if (!DATE_REGEX.test(dateStr)) {
    return false;
  }

  const [day, month, year] = dateStr.split('.').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Validates an account object
 */
function validateAccount(
  account: unknown,
  index: number
): { valid: true } | { valid: false; error: string; details: Record<string, unknown> } {
  if (typeof account !== 'object' || account === null) {
    return {
      valid: false,
      error: `Account at index ${index} must be an object`,
      details: { index, type: typeof account }
    };
  }

  const acc = account as Record<string, unknown>;

  // Validate name
  if (!acc.name) {
    return {
      valid: false,
      error: `Account at index ${index} requires a name`,
      details: { index, field: 'name' }
    };
  }

  if (typeof acc.name !== 'string') {
    return {
      valid: false,
      error: `Account name at index ${index} must be a string`,
      details: { index, field: 'name', type: typeof acc.name }
    };
  }

  if (acc.name.length < ACCOUNT_NAME_MIN_LENGTH || acc.name.length > ACCOUNT_NAME_MAX_LENGTH) {
    return {
      valid: false,
      error: `Account name at index ${index} must be ${ACCOUNT_NAME_MIN_LENGTH}-${ACCOUNT_NAME_MAX_LENGTH} characters`,
      details: { index, field: 'name', length: acc.name.length }
    };
  }

  // Validate assetClass
  if (!acc.assetClass) {
    return {
      valid: false,
      error: `Account at index ${index} requires an assetClass`,
      details: { index, field: 'assetClass' }
    };
  }

  if (typeof acc.assetClass !== 'string') {
    return {
      valid: false,
      error: `Account assetClass at index ${index} must be a string`,
      details: { index, field: 'assetClass', type: typeof acc.assetClass }
    };
  }

  if (acc.assetClass.length < ASSET_CLASS_MIN_LENGTH || acc.assetClass.length > ASSET_CLASS_MAX_LENGTH) {
    return {
      valid: false,
      error: `Account assetClass at index ${index} must be ${ASSET_CLASS_MIN_LENGTH}-${ASSET_CLASS_MAX_LENGTH} characters`,
      details: { index, field: 'assetClass', length: acc.assetClass.length }
    };
  }

  // Validate value
  if (acc.value === undefined || acc.value === null) {
    return {
      valid: false,
      error: `Account at index ${index} requires a value`,
      details: { index, field: 'value' }
    };
  }

  if (typeof acc.value !== 'number') {
    return {
      valid: false,
      error: `Account value at index ${index} must be a number`,
      details: { index, field: 'value', type: typeof acc.value }
    };
  }

  if (!Number.isFinite(acc.value)) {
    return {
      valid: false,
      error: `Account value at index ${index} must be a finite number`,
      details: { index, field: 'value', value: acc.value }
    };
  }

  // Allow negative values only for gjeld (debt) accounts
  if (acc.value < 0 && acc.assetClass !== 'gjeld') {
    return {
      valid: false,
      error: `Account value at index ${index} cannot be negative (except for gjeld)`,
      details: { index, field: 'value', value: acc.value }
    };
  }

  // Validate notes (optional)
  if (acc.notes !== undefined) {
    if (typeof acc.notes !== 'string') {
      return {
        valid: false,
        error: `Account notes at index ${index} must be a string`,
        details: { index, field: 'notes', type: typeof acc.notes }
      };
    }

    if (acc.notes.length > NOTES_MAX_LENGTH) {
      return {
        valid: false,
        error: `Account notes at index ${index} must be max ${NOTES_MAX_LENGTH} characters`,
        details: { index, field: 'notes', length: acc.notes.length }
      };
    }
  }

  return { valid: true };
}

/**
 * Validates snapshot creation request body
 *
 * Checks:
 * - date field exists and is in dd.MM.yyyy format
 * - accounts array exists and contains valid account objects
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export function validateCreateSnapshotRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { date, accounts } = req.body;

  // Validate date is provided
  if (!date) {
    res.status(400).json({
      error: {
        message: 'Date is required',
        code: 'VALIDATION_ERROR',
        details: { field: 'date' }
      },
      success: false
    });
    return;
  }

  // Validate date is string
  if (typeof date !== 'string') {
    res.status(400).json({
      error: {
        message: 'Date must be a string',
        code: 'VALIDATION_ERROR',
        details: { field: 'date', type: typeof date }
      },
      success: false
    });
    return;
  }

  // Validate date format
  if (!isValidDate(date)) {
    res.status(400).json({
      error: {
        message: 'Date must be in dd.MM.yyyy format (e.g., "01.01.2024")',
        code: 'VALIDATION_ERROR',
        details: { field: 'date', value: date, expectedFormat: 'dd.MM.yyyy' }
      },
      success: false
    });
    return;
  }

  // Validate accounts is provided
  if (!accounts) {
    res.status(400).json({
      error: {
        message: 'Accounts array is required',
        code: 'VALIDATION_ERROR',
        details: { field: 'accounts' }
      },
      success: false
    });
    return;
  }

  // Validate accounts is array
  if (!Array.isArray(accounts)) {
    res.status(400).json({
      error: {
        message: 'Accounts must be an array',
        code: 'VALIDATION_ERROR',
        details: { field: 'accounts', type: typeof accounts }
      },
      success: false
    });
    return;
  }

  // Validate each account
  for (let i = 0; i < accounts.length; i++) {
    const result = validateAccount(accounts[i], i);
    if (!result.valid) {
      res.status(400).json({
        error: {
          message: result.error,
          code: 'VALIDATION_ERROR',
          details: result.details
        },
        success: false
      });
      return;
    }
  }

  logger.debug('Create snapshot request validation passed', {
    date,
    accountCount: accounts.length
  });
  next();
}

/**
 * Validates snapshot update request body
 *
 * Checks:
 * - At least one field to update is provided
 * - date (if provided) is in dd.MM.yyyy format
 * - accounts (if provided) is valid array of accounts
 * - Blocked fields (id, userId, createdAt) are not included
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export function validateUpdateSnapshotRequest(
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
  const blockedFields = ['id', 'userId', 'createdAt'];
  const hasBlockedField = updateFields.some(field => blockedFields.includes(field));
  if (hasBlockedField) {
    res.status(400).json({
      error: {
        message: 'Cannot update id, userId, or createdAt',
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

  // Validate date if provided
  if (updates.date !== undefined) {
    if (typeof updates.date !== 'string') {
      res.status(400).json({
        error: {
          message: 'Date must be a string',
          code: 'VALIDATION_ERROR',
          details: { field: 'date', type: typeof updates.date }
        },
        success: false
      });
      return;
    }

    if (!isValidDate(updates.date)) {
      res.status(400).json({
        error: {
          message: 'Date must be in dd.MM.yyyy format (e.g., "01.01.2024")',
          code: 'VALIDATION_ERROR',
          details: { field: 'date', value: updates.date, expectedFormat: 'dd.MM.yyyy' }
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

    for (let i = 0; i < updates.accounts.length; i++) {
      const result = validateAccount(updates.accounts[i], i);
      if (!result.valid) {
        res.status(400).json({
          error: {
            message: result.error,
            code: 'VALIDATION_ERROR',
            details: result.details
          },
          success: false
        });
        return;
      }
    }
  }

  logger.debug('Update snapshot request validation passed', { fields: updateFields });
  next();
}

/**
 * Validates add account request body
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export function validateAddAccountRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const account = req.body;

  // Check that request body is an object
  if (typeof account !== 'object' || account === null || Array.isArray(account)) {
    res.status(400).json({
      error: {
        message: 'Request body must be an object',
        code: 'VALIDATION_ERROR',
        details: { type: typeof account }
      },
      success: false
    });
    return;
  }

  const result = validateAccount(account, 0);
  if (!result.valid) {
    res.status(400).json({
      error: {
        message: result.error.replace('at index 0 ', ''),
        code: 'VALIDATION_ERROR',
        details: { ...result.details, index: undefined }
      },
      success: false
    });
    return;
  }

  logger.debug('Add account request validation passed', { name: account.name });
  next();
}

/**
 * Validates update account request body
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export function validateUpdateAccountRequest(
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

  // Validate blocked fields
  const blockedFields = ['id'];
  const hasBlockedField = updateFields.some(field => blockedFields.includes(field));
  if (hasBlockedField) {
    res.status(400).json({
      error: {
        message: 'Cannot update account id',
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

  // Validate name if provided
  if (updates.name !== undefined) {
    if (typeof updates.name !== 'string') {
      res.status(400).json({
        error: {
          message: 'Name must be a string',
          code: 'VALIDATION_ERROR',
          details: { field: 'name', type: typeof updates.name }
        },
        success: false
      });
      return;
    }

    if (updates.name.length < ACCOUNT_NAME_MIN_LENGTH || updates.name.length > ACCOUNT_NAME_MAX_LENGTH) {
      res.status(400).json({
        error: {
          message: `Name must be ${ACCOUNT_NAME_MIN_LENGTH}-${ACCOUNT_NAME_MAX_LENGTH} characters`,
          code: 'VALIDATION_ERROR',
          details: { field: 'name', length: updates.name.length }
        },
        success: false
      });
      return;
    }
  }

  // Validate assetClass if provided
  if (updates.assetClass !== undefined) {
    if (typeof updates.assetClass !== 'string') {
      res.status(400).json({
        error: {
          message: 'Asset class must be a string',
          code: 'VALIDATION_ERROR',
          details: { field: 'assetClass', type: typeof updates.assetClass }
        },
        success: false
      });
      return;
    }

    if (updates.assetClass.length < ASSET_CLASS_MIN_LENGTH || updates.assetClass.length > ASSET_CLASS_MAX_LENGTH) {
      res.status(400).json({
        error: {
          message: `Asset class must be ${ASSET_CLASS_MIN_LENGTH}-${ASSET_CLASS_MAX_LENGTH} characters`,
          code: 'VALIDATION_ERROR',
          details: { field: 'assetClass', length: updates.assetClass.length }
        },
        success: false
      });
      return;
    }
  }

  // Validate value if provided
  if (updates.value !== undefined) {
    if (typeof updates.value !== 'number') {
      res.status(400).json({
        error: {
          message: 'Value must be a number',
          code: 'VALIDATION_ERROR',
          details: { field: 'value', type: typeof updates.value }
        },
        success: false
      });
      return;
    }

    if (!Number.isFinite(updates.value)) {
      res.status(400).json({
        error: {
          message: 'Value must be a finite number',
          code: 'VALIDATION_ERROR',
          details: { field: 'value', value: updates.value }
        },
        success: false
      });
      return;
    }

    // Allow negative values only for gjeld (debt) accounts
    if (updates.value < 0 && updates.assetClass !== 'gjeld') {
      res.status(400).json({
        error: {
          message: 'Value cannot be negative (except for gjeld)',
          code: 'VALIDATION_ERROR',
          details: { field: 'value', value: updates.value }
        },
        success: false
      });
      return;
    }
  }

  // Validate notes if provided
  if (updates.notes !== undefined) {
    if (typeof updates.notes !== 'string') {
      res.status(400).json({
        error: {
          message: 'Notes must be a string',
          code: 'VALIDATION_ERROR',
          details: { field: 'notes', type: typeof updates.notes }
        },
        success: false
      });
      return;
    }

    if (updates.notes.length > NOTES_MAX_LENGTH) {
      res.status(400).json({
        error: {
          message: `Notes must be max ${NOTES_MAX_LENGTH} characters`,
          code: 'VALIDATION_ERROR',
          details: { field: 'notes', length: updates.notes.length }
        },
        success: false
      });
      return;
    }
  }

  logger.debug('Update account request validation passed', { fields: updateFields });
  next();
}

/**
 * Validates snapshot ID parameter
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export function validateSnapshotIdParam(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { id } = req.params;

  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Snapshot ID is required',
        code: 'VALIDATION_ERROR',
        details: { param: 'id' }
      },
      success: false
    });
    return;
  }

  next();
}

/**
 * Validates account ID parameter
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export function validateAccountIdParam(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { accountId } = req.params;

  if (!accountId || typeof accountId !== 'string' || accountId.trim().length === 0) {
    res.status(400).json({
      error: {
        message: 'Account ID is required',
        code: 'VALIDATION_ERROR',
        details: { param: 'accountId' }
      },
      success: false
    });
    return;
  }

  next();
}
