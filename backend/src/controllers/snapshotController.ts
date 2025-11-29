/**
 * Snapshot Controller
 *
 * Handles portfolio snapshot management endpoints:
 * - GET /api/v1/snapshots - Get all snapshots for user
 * - POST /api/v1/snapshots - Create new monthly snapshot
 * - GET /api/v1/snapshots/:id - Get specific snapshot
 * - PATCH /api/v1/snapshots/:id - Update snapshot
 * - DELETE /api/v1/snapshots/:id - Delete snapshot
 * - GET /api/v1/snapshots/:id/accounts - Get accounts for snapshot
 * - POST /api/v1/snapshots/:id/accounts - Add account to snapshot
 * - PATCH /api/v1/snapshots/:id/accounts/:accountId - Update account
 * - DELETE /api/v1/snapshots/:id/accounts/:accountId - Delete account
 */

import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import {
  createSnapshot as createSnapshotService,
  getSnapshotById,
  getSnapshotsByUserId,
  updateSnapshot as updateSnapshotService,
  deleteSnapshot as deleteSnapshotService
} from '../services/portfolioService';
import { MonthlySnapshot, Account } from '../models/Portfolio';
import { logger } from '../utils/logger';

/**
 * Calculate total net worth from accounts
 */
function calculateTotalNetWorth(accounts: Account[]): number {
  return accounts.reduce((sum, account) => sum + account.value, 0);
}

/**
 * Get all snapshots for authenticated user
 *
 * GET /api/v1/snapshots
 *
 * Query params:
 * - orderBy: 'date' | 'createdAt' (default: 'date')
 * - ascending: 'true' | 'false' (default: 'false' - newest first)
 * - limit: number (optional)
 *
 * @param req - Express request (req.user populated by validateAuth middleware)
 * @param res - Express response
 *
 * @returns 200 with array of snapshots
 */
export async function getAllSnapshots(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;

    // Parse query parameters
    const orderBy = (req.query.orderBy as 'date' | 'createdAt') || 'date';
    const ascending = req.query.ascending === 'true';
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    logger.debug('Fetching all snapshots for user', { userId, orderBy, ascending, limit });

    const snapshots = await getSnapshotsByUserId(userId, {
      orderBy,
      ascending,
      limit
    });

    logger.info('Snapshots retrieved', { userId, count: snapshots.length });
    res.status(200).json({
      data: snapshots,
      success: true
    });
  } catch (error) {
    logger.error('Error fetching snapshots', {
      userId: req.user!.userId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Failed to fetch snapshots',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}

/**
 * Create new monthly snapshot
 *
 * POST /api/v1/snapshots
 *
 * Request body:
 * {
 *   date: string (dd.MM.yyyy format)
 *   accounts: Account[]
 * }
 *
 * @param req - Express request
 * @param res - Express response
 *
 * @returns 201 with created snapshot
 */
export async function createSnapshot(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { date, accounts } = req.body;

    logger.debug('Creating new snapshot', { userId, date, accountCount: accounts.length });

    // Generate IDs for snapshot and accounts
    const snapshotId = randomUUID();
    const accountsWithIds: Account[] = accounts.map((account: Omit<Account, 'id'>) => ({
      ...account,
      id: randomUUID()
    }));

    // Calculate total net worth
    const totalNetWorth = calculateTotalNetWorth(accountsWithIds);

    const snapshot: MonthlySnapshot = {
      id: snapshotId,
      userId,
      date,
      accounts: accountsWithIds,
      totalNetWorth,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const createdSnapshot = await createSnapshotService(snapshot);

    logger.info('Snapshot created successfully', {
      snapshotId,
      userId,
      date,
      totalNetWorth,
      accountCount: accountsWithIds.length
    });

    res.status(201).json({
      data: createdSnapshot,
      success: true
    });
  } catch (error) {
    logger.error('Error creating snapshot', {
      userId: req.user!.userId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Failed to create snapshot',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}

/**
 * Get specific snapshot by ID
 *
 * GET /api/v1/snapshots/:id
 *
 * @param req - Express request
 * @param res - Express response
 *
 * @returns 200 with snapshot, or 404 if not found
 */
export async function getSnapshot(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const snapshotId = req.params.id;

    logger.debug('Fetching snapshot', { userId, snapshotId });

    const snapshot = await getSnapshotById(userId, snapshotId);

    if (!snapshot) {
      logger.warn('Snapshot not found', { userId, snapshotId });
      res.status(404).json({
        error: {
          message: 'Snapshot not found',
          code: 'NOT_FOUND'
        },
        success: false
      });
      return;
    }

    logger.info('Snapshot retrieved', { userId, snapshotId });
    res.status(200).json({
      data: snapshot,
      success: true
    });
  } catch (error) {
    logger.error('Error fetching snapshot', {
      userId: req.user!.userId,
      snapshotId: req.params.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Failed to fetch snapshot',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}

/**
 * Update snapshot
 *
 * PATCH /api/v1/snapshots/:id
 *
 * Request body (partial):
 * {
 *   date?: string
 *   accounts?: Account[]
 * }
 *
 * @param req - Express request
 * @param res - Express response
 *
 * @returns 200 with updated snapshot, or 404 if not found
 */
export async function updateSnapshot(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const snapshotId = req.params.id;
    const updates = req.body;

    logger.debug('Updating snapshot', { userId, snapshotId, fields: Object.keys(updates) });

    // Check if snapshot exists
    const existingSnapshot = await getSnapshotById(userId, snapshotId);
    if (!existingSnapshot) {
      logger.warn('Snapshot not found for update', { userId, snapshotId });
      res.status(404).json({
        error: {
          message: 'Snapshot not found',
          code: 'NOT_FOUND'
        },
        success: false
      });
      return;
    }

    // If accounts are being updated, generate IDs for new accounts and recalculate total
    if (updates.accounts) {
      updates.accounts = updates.accounts.map((account: Account | Omit<Account, 'id'>) => ({
        ...account,
        id: (account as Account).id || randomUUID()
      }));
      updates.totalNetWorth = calculateTotalNetWorth(updates.accounts);
    }

    const updatedSnapshot = await updateSnapshotService(userId, snapshotId, updates);

    logger.info('Snapshot updated successfully', { userId, snapshotId, fields: Object.keys(updates) });
    res.status(200).json({
      data: updatedSnapshot,
      success: true
    });
  } catch (error) {
    logger.error('Error updating snapshot', {
      userId: req.user!.userId,
      snapshotId: req.params.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Failed to update snapshot',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}

/**
 * Delete snapshot
 *
 * DELETE /api/v1/snapshots/:id
 *
 * @param req - Express request
 * @param res - Express response
 *
 * @returns 200 on success, or 404 if not found
 */
export async function deleteSnapshot(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const snapshotId = req.params.id;

    logger.debug('Deleting snapshot', { userId, snapshotId });

    // Check if snapshot exists
    const existingSnapshot = await getSnapshotById(userId, snapshotId);
    if (!existingSnapshot) {
      logger.warn('Snapshot not found for deletion', { userId, snapshotId });
      res.status(404).json({
        error: {
          message: 'Snapshot not found',
          code: 'NOT_FOUND'
        },
        success: false
      });
      return;
    }

    await deleteSnapshotService(userId, snapshotId);

    logger.info('Snapshot deleted successfully', { userId, snapshotId });
    res.status(200).json({
      data: { message: 'Snapshot deleted successfully' },
      success: true
    });
  } catch (error) {
    logger.error('Error deleting snapshot', {
      userId: req.user!.userId,
      snapshotId: req.params.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Failed to delete snapshot',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}

/**
 * Get accounts for a snapshot
 *
 * GET /api/v1/snapshots/:id/accounts
 *
 * @param req - Express request
 * @param res - Express response
 *
 * @returns 200 with array of accounts, or 404 if snapshot not found
 */
export async function getSnapshotAccounts(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const snapshotId = req.params.id;

    logger.debug('Fetching accounts for snapshot', { userId, snapshotId });

    const snapshot = await getSnapshotById(userId, snapshotId);

    if (!snapshot) {
      logger.warn('Snapshot not found for accounts', { userId, snapshotId });
      res.status(404).json({
        error: {
          message: 'Snapshot not found',
          code: 'NOT_FOUND'
        },
        success: false
      });
      return;
    }

    logger.info('Accounts retrieved', { userId, snapshotId, count: snapshot.accounts.length });
    res.status(200).json({
      data: snapshot.accounts,
      success: true
    });
  } catch (error) {
    logger.error('Error fetching accounts', {
      userId: req.user!.userId,
      snapshotId: req.params.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Failed to fetch accounts',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}

/**
 * Add account to snapshot
 *
 * POST /api/v1/snapshots/:id/accounts
 *
 * Request body:
 * {
 *   name: string
 *   assetClass: string
 *   value: number
 *   notes?: string
 * }
 *
 * @param req - Express request
 * @param res - Express response
 *
 * @returns 201 with updated snapshot, or 404 if snapshot not found
 */
export async function addAccount(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const snapshotId = req.params.id;
    const accountData = req.body;

    logger.debug('Adding account to snapshot', { userId, snapshotId, accountName: accountData.name });

    // Check if snapshot exists
    const existingSnapshot = await getSnapshotById(userId, snapshotId);
    if (!existingSnapshot) {
      logger.warn('Snapshot not found for adding account', { userId, snapshotId });
      res.status(404).json({
        error: {
          message: 'Snapshot not found',
          code: 'NOT_FOUND'
        },
        success: false
      });
      return;
    }

    // Create new account with generated ID
    const newAccount: Account = {
      id: randomUUID(),
      name: accountData.name,
      assetClass: accountData.assetClass,
      value: accountData.value,
      notes: accountData.notes
    };

    // Add to accounts array and recalculate total
    const updatedAccounts = [...existingSnapshot.accounts, newAccount];
    const totalNetWorth = calculateTotalNetWorth(updatedAccounts);

    const updatedSnapshot = await updateSnapshotService(userId, snapshotId, {
      accounts: updatedAccounts,
      totalNetWorth
    });

    logger.info('Account added successfully', {
      userId,
      snapshotId,
      accountId: newAccount.id,
      accountName: newAccount.name
    });

    res.status(201).json({
      data: updatedSnapshot,
      success: true
    });
  } catch (error) {
    logger.error('Error adding account', {
      userId: req.user!.userId,
      snapshotId: req.params.id,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Failed to add account',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}

/**
 * Update account in snapshot
 *
 * PATCH /api/v1/snapshots/:id/accounts/:accountId
 *
 * Request body (partial):
 * {
 *   name?: string
 *   assetClass?: string
 *   value?: number
 *   notes?: string
 * }
 *
 * @param req - Express request
 * @param res - Express response
 *
 * @returns 200 with updated snapshot, or 404 if not found
 */
export async function updateAccount(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const snapshotId = req.params.id;
    const accountId = req.params.accountId;
    const updates = req.body;

    logger.debug('Updating account', { userId, snapshotId, accountId, fields: Object.keys(updates) });

    // Check if snapshot exists
    const existingSnapshot = await getSnapshotById(userId, snapshotId);
    if (!existingSnapshot) {
      logger.warn('Snapshot not found for updating account', { userId, snapshotId });
      res.status(404).json({
        error: {
          message: 'Snapshot not found',
          code: 'NOT_FOUND'
        },
        success: false
      });
      return;
    }

    // Find and update the account
    const accountIndex = existingSnapshot.accounts.findIndex(a => a.id === accountId);
    if (accountIndex === -1) {
      logger.warn('Account not found in snapshot', { userId, snapshotId, accountId });
      res.status(404).json({
        error: {
          message: 'Account not found',
          code: 'NOT_FOUND'
        },
        success: false
      });
      return;
    }

    // Update account fields
    const updatedAccounts = [...existingSnapshot.accounts];
    updatedAccounts[accountIndex] = {
      ...updatedAccounts[accountIndex],
      ...updates,
      id: accountId // Ensure ID is not changed
    };

    // Recalculate total
    const totalNetWorth = calculateTotalNetWorth(updatedAccounts);

    const updatedSnapshot = await updateSnapshotService(userId, snapshotId, {
      accounts: updatedAccounts,
      totalNetWorth
    });

    logger.info('Account updated successfully', { userId, snapshotId, accountId });
    res.status(200).json({
      data: updatedSnapshot,
      success: true
    });
  } catch (error) {
    logger.error('Error updating account', {
      userId: req.user!.userId,
      snapshotId: req.params.id,
      accountId: req.params.accountId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Failed to update account',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}

/**
 * Delete account from snapshot
 *
 * DELETE /api/v1/snapshots/:id/accounts/:accountId
 *
 * @param req - Express request
 * @param res - Express response
 *
 * @returns 200 with updated snapshot, or 404 if not found
 */
export async function deleteAccount(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.userId;
    const snapshotId = req.params.id;
    const accountId = req.params.accountId;

    logger.debug('Deleting account', { userId, snapshotId, accountId });

    // Check if snapshot exists
    const existingSnapshot = await getSnapshotById(userId, snapshotId);
    if (!existingSnapshot) {
      logger.warn('Snapshot not found for deleting account', { userId, snapshotId });
      res.status(404).json({
        error: {
          message: 'Snapshot not found',
          code: 'NOT_FOUND'
        },
        success: false
      });
      return;
    }

    // Find the account
    const accountIndex = existingSnapshot.accounts.findIndex(a => a.id === accountId);
    if (accountIndex === -1) {
      logger.warn('Account not found for deletion', { userId, snapshotId, accountId });
      res.status(404).json({
        error: {
          message: 'Account not found',
          code: 'NOT_FOUND'
        },
        success: false
      });
      return;
    }

    // Remove account and recalculate total
    const updatedAccounts = existingSnapshot.accounts.filter(a => a.id !== accountId);
    const totalNetWorth = calculateTotalNetWorth(updatedAccounts);

    const updatedSnapshot = await updateSnapshotService(userId, snapshotId, {
      accounts: updatedAccounts,
      totalNetWorth
    });

    logger.info('Account deleted successfully', { userId, snapshotId, accountId });
    res.status(200).json({
      data: updatedSnapshot,
      success: true
    });
  } catch (error) {
    logger.error('Error deleting account', {
      userId: req.user!.userId,
      snapshotId: req.params.id,
      accountId: req.params.accountId,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    res.status(500).json({
      error: {
        message: 'Failed to delete account',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}
