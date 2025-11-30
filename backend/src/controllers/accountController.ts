/**
 * Account Controller
 *
 * Handles account management endpoints:
 * - GET /api/v1/accounts - Get all accounts
 * - GET /api/v1/accounts/active - Get active accounts only
 * - POST /api/v1/accounts - Create new account
 * - PATCH /api/v1/accounts/:id - Update account
 * - DELETE /api/v1/accounts/:id - Soft delete account
 */

import { Request, Response, NextFunction } from 'express';
import * as accountService from '../services/accountService';
import { logger } from '../utils/logger';

/**
 * GET /api/v1/accounts
 * Get all accounts for authenticated user (including inactive)
 *
 * @param req - Express request (req.user populated by validateAuth middleware)
 * @param res - Express response
 * @param next - Express next function for error handling
 *
 * @returns 200 with array of all accounts
 */
export async function getAllAccounts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;

    logger.debug('Fetching all accounts', { userId });

    const accounts = await accountService.getAccounts(userId);

    logger.info('All accounts retrieved', { userId, count: accounts.length });
    res.status(200).json({
      data: accounts,
      success: true
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/accounts/active
 * Get only active accounts for user
 *
 * @param req - Express request (req.user populated by validateAuth middleware)
 * @param res - Express response
 * @param next - Express next function for error handling
 *
 * @returns 200 with array of active accounts
 */
export async function getActiveAccounts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;

    logger.debug('Fetching active accounts', { userId });

    const accounts = await accountService.getActiveAccounts(userId);

    logger.info('Active accounts retrieved', { userId, count: accounts.length });
    res.status(200).json({
      data: accounts,
      success: true
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/accounts
 * Create new account for user
 *
 * Request body:
 * {
 *   name: string (1-100 chars)
 *   category: 'sparing' | 'gjeld' | 'pensjon'
 *   isActive?: boolean (default: true)
 *   loanDetails?: { interestRate, remainingYears, originalAmount }
 * }
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function for error handling
 *
 * @returns 201 with created account
 */
export async function createAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;

    logger.debug('Creating account', { userId, name: req.body.name });

    const account = await accountService.createAccount(userId, req.body);

    logger.info('Account created', { userId, accountId: account.id, name: account.name });
    res.status(201).json({
      data: account,
      success: true
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/accounts/:id
 * Update account configuration
 *
 * Request body (partial):
 * {
 *   name?: string
 *   isActive?: boolean
 *   loanDetails?: { interestRate, remainingYears, originalAmount }
 * }
 *
 * @param req - Express request with accountId in params
 * @param res - Express response
 * @param next - Express next function for error handling
 *
 * @returns 200 with updated account, or 404 if not found
 */
export async function updateAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    logger.debug('Updating account', { userId, accountId: id });

    const account = await accountService.updateAccount(userId, id, req.body);

    logger.info('Account updated', { userId, accountId: id });
    res.status(200).json({
      data: account,
      success: true
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/accounts/:id
 * Soft delete account (set isActive: false)
 *
 * Accounts are not hard deleted to preserve historical snapshot data.
 *
 * @param req - Express request with accountId in params
 * @param res - Express response
 * @param next - Express next function for error handling
 *
 * @returns 204 No Content on success
 */
export async function deleteAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    logger.debug('Deleting account', { userId, accountId: id });

    await accountService.deleteAccount(userId, id);

    logger.info('Account deleted', { userId, accountId: id });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
