/**
 * Snapshot Routes
 *
 * API endpoints for portfolio snapshot management:
 * - GET /api/v1/snapshots - Get all snapshots for user
 * - POST /api/v1/snapshots - Create new monthly snapshot
 * - GET /api/v1/snapshots/:id - Get specific snapshot
 * - PATCH /api/v1/snapshots/:id - Update snapshot
 * - DELETE /api/v1/snapshots/:id - Delete snapshot
 * - GET /api/v1/snapshots/:id/accounts - Get accounts for snapshot
 * - POST /api/v1/snapshots/:id/accounts - Add account to snapshot
 * - PATCH /api/v1/snapshots/:id/accounts/:accountId - Update account
 * - DELETE /api/v1/snapshots/:id/accounts/:accountId - Delete account
 *
 * All routes require authentication via validateAuth middleware.
 */

import { Router, IRouter } from 'express';
import {
  getAllSnapshots,
  createSnapshot,
  getSnapshot,
  updateSnapshot,
  deleteSnapshot,
  getSnapshotAccounts,
  addAccount,
  updateSnapshotAccount,
  deleteSnapshotAccount
} from '../controllers/snapshotController';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import {
  snapshotCreateSchema,
  snapshotUpdateSchema,
  accountSchema,
  accountUpdateSchema,
  snapshotIdSchema,
  snapshotAndAccountIdSchema,
  snapshotQuerySchema
} from '../validators';

const router: IRouter = Router();

/**
 * GET /api/v1/snapshots
 * Get all snapshots for authenticated user
 *
 * Query params:
 * - orderBy: 'date' | 'createdAt' (default: 'date')
 * - ascending: 'true' | 'false' (default: 'false')
 * - limit: number (optional)
 *
 * Returns: 200 with array of snapshots
 */
router.get('/', validateQuery(snapshotQuerySchema), getAllSnapshots);

/**
 * POST /api/v1/snapshots
 * Create new monthly snapshot
 *
 * Body: { date: string, accounts: Account[] }
 * Returns: 201 with created snapshot
 */
router.post('/', validateBody(snapshotCreateSchema), createSnapshot);

/**
 * GET /api/v1/snapshots/:id
 * Get specific snapshot by ID
 *
 * Returns: 200 with snapshot, or 404 if not found
 */
router.get('/:id', validateParams(snapshotIdSchema), getSnapshot);

/**
 * PATCH /api/v1/snapshots/:id
 * Update snapshot
 *
 * Body: { date?: string, accounts?: Account[] }
 * Returns: 200 with updated snapshot, or 404 if not found
 */
router.patch(
  '/:id',
  validateParams(snapshotIdSchema),
  validateBody(snapshotUpdateSchema),
  updateSnapshot
);

/**
 * DELETE /api/v1/snapshots/:id
 * Delete snapshot
 *
 * Returns: 200 on success, or 404 if not found
 */
router.delete('/:id', validateParams(snapshotIdSchema), deleteSnapshot);

/**
 * GET /api/v1/snapshots/:id/accounts
 * Get accounts for a snapshot
 *
 * Returns: 200 with array of accounts, or 404 if snapshot not found
 */
router.get('/:id/accounts', validateParams(snapshotIdSchema), getSnapshotAccounts);

/**
 * POST /api/v1/snapshots/:id/accounts
 * Add account to snapshot
 *
 * Body: { name: string, assetClass: string, value: number, notes?: string }
 * Returns: 201 with updated snapshot, or 404 if snapshot not found
 */
router.post(
  '/:id/accounts',
  validateParams(snapshotIdSchema),
  validateBody(accountSchema),
  addAccount
);

/**
 * PATCH /api/v1/snapshots/:id/accounts/:accountId
 * Update account in snapshot
 *
 * Body: { name?: string, assetClass?: string, value?: number, notes?: string }
 * Returns: 200 with updated snapshot, or 404 if not found
 */
router.patch(
  '/:id/accounts/:accountId',
  validateParams(snapshotAndAccountIdSchema),
  validateBody(accountUpdateSchema),
  updateSnapshotAccount
);

/**
 * DELETE /api/v1/snapshots/:id/accounts/:accountId
 * Delete account from snapshot
 *
 * Returns: 200 with updated snapshot, or 404 if not found
 */
router.delete(
  '/:id/accounts/:accountId',
  validateParams(snapshotAndAccountIdSchema),
  deleteSnapshotAccount
);

export default router;
