/**
 * Account Routes
 *
 * API endpoints for account management:
 * - GET /api/v1/accounts - Get all accounts
 * - GET /api/v1/accounts/active - Get active accounts only
 * - POST /api/v1/accounts - Create new account
 * - PATCH /api/v1/accounts/:id - Update account
 * - DELETE /api/v1/accounts/:id - Soft delete account
 *
 * All routes require authentication via validateAuth middleware.
 */

import { Router, IRouter } from 'express';
import {
  getAllAccounts,
  getActiveAccounts,
  createAccount,
  updateAccount,
  deleteAccount
} from '../controllers/accountController';
import { validateBody, validateParams } from '../middleware/validate';
import { createAccountConfigSchema, updateAccountConfigSchema, accountConfigIdSchema } from '../validators/schemas';

const router: IRouter = Router();

/**
 * GET /api/v1/accounts
 * Get all accounts for authenticated user
 *
 * Requires: Authentication (validateAuth applied in main router)
 * Returns: Array of all accounts (active and inactive)
 */
router.get('/', getAllAccounts);

/**
 * GET /api/v1/accounts/active
 * Get only active accounts
 *
 * Requires: Authentication
 * Returns: Array of active accounts only
 */
router.get('/active', getActiveAccounts);

/**
 * POST /api/v1/accounts
 * Create new account
 *
 * Requires: Authentication, valid account data
 * Body: { name, category, isActive?, loanDetails? }
 * Returns: 201 with created account
 */
router.post('/', validateBody(createAccountConfigSchema), createAccount);

/**
 * PATCH /api/v1/accounts/:id
 * Update account configuration
 *
 * Requires: Authentication, valid update fields
 * Body: { name?, isActive?, loanDetails? }
 * Returns: 200 with updated account
 */
router.patch(
  '/:id',
  validateParams(accountConfigIdSchema),
  validateBody(updateAccountConfigSchema),
  updateAccount
);

/**
 * DELETE /api/v1/accounts/:id
 * Soft delete account (set isActive: false)
 *
 * Requires: Authentication
 * Returns: 204 No Content
 */
router.delete('/:id', validateParams(accountConfigIdSchema), deleteAccount);

export default router;
