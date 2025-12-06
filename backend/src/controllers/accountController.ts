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

import { Request, Response } from 'express';
import * as accountService from '../services/accountService';
import { asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * GET /api/v1/accounts
 * Get all accounts for authenticated user (including inactive)
 *
 * @param req - Express request (req.user populated by validateAuth middleware)
 * @param res - Express response
 *
 * @returns 200 with array of all accounts
 */
export const getAllAccounts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  logger.debug('Fetching all accounts', { userId });

  const accounts = await accountService.getAccounts(userId);

  logger.info('All accounts retrieved', { userId, count: accounts.length });
  res.json({
    data: accounts,
    success: true
  });
});

/**
 * GET /api/v1/accounts/active
 * Get only active accounts for user
 *
 * @param req - Express request (req.user populated by validateAuth middleware)
 * @param res - Express response
 *
 * @returns 200 with array of active accounts
 */
export const getActiveAccounts = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  logger.debug('Fetching active accounts', { userId });

  const accounts = await accountService.getActiveAccounts(userId);

  logger.info('Active accounts retrieved', { userId, count: accounts.length });
  res.json({
    data: accounts,
    success: true
  });
});

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
 *
 * @returns 201 with created account
 */
export const createAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  logger.debug('Creating account', { userId, name: req.body.name });

  const account = await accountService.createAccount(userId, req.body);

  logger.info('Account created', { userId, accountId: account.id, name: account.name });
  res.status(201).json({
    data: account,
    success: true
  });
});

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
 *
 * @returns 200 with updated account, or 404 if not found
 */
export const updateAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  logger.debug('Updating account', { userId, accountId: id });

  const account = await accountService.updateAccount(userId, id, req.body);

  logger.info('Account updated', { userId, accountId: id });
  res.json({
    data: account,
    success: true
  });
});

/**
 * DELETE /api/v1/accounts/:id
 * Soft delete account (set isActive: false)
 *
 * Accounts are not hard deleted to preserve historical snapshot data.
 *
 * @param req - Express request with accountId in params
 * @param res - Express response
 *
 * @returns 204 No Content on success
 */
export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { id } = req.params;

  logger.debug('Deleting account', { userId, accountId: id });

  await accountService.deleteAccount(userId, id);

  logger.info('Account deleted', { userId, accountId: id });
  res.status(204).send();
});
