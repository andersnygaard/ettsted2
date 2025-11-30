/**
 * User Routes
 *
 * API endpoints for user management:
 * - GET /api/v1/users/me - Get current user profile
 * - POST /api/v1/users/me/setup - First-time nickname setup
 * - PATCH /api/v1/users/me - Update user settings
 *
 * All routes require authentication via validateAuth middleware.
 */

import { Router, IRouter } from 'express';
import {
  getCurrentUser,
  setupUser,
  updateUser
} from '../controllers/userController';
import { validateBody } from '../middleware/validate';
import {
  userSetupSchema,
  userUpdateSchema,
  validateNicknameAvailable
} from '../validators';

const router: IRouter = Router();

/**
 * GET /api/v1/users/me
 * Get current user profile
 *
 * Requires: Authentication (validateAuth applied in main router)
 * Returns: User object or 404 if not found
 */
router.get('/me', getCurrentUser);

/**
 * POST /api/v1/users/me/setup
 * Setup user profile (first-time onboarding)
 *
 * Requires: Authentication, valid nickname, nickname not taken
 * Body: { nickname: string, email: string }
 * Returns: 201 with created user, or 409 if nickname taken
 *
 * Two-layer validation:
 * 1. Input validation (Zod schema) - validates format and types
 * 2. Business validation - checks nickname uniqueness
 */
router.post(
  '/me/setup',
  validateBody(userSetupSchema),
  validateNicknameAvailable,
  setupUser
);

/**
 * PATCH /api/v1/users/me
 * Update user settings
 *
 * Requires: Authentication, valid update fields
 * Body: { nickname?: string, email?: string, profile?: UserProfile, accounts?: AccountConfig[] }
 * Returns: 200 with updated user, or 404 if user not found
 */
router.patch('/me', validateBody(userUpdateSchema), updateUser);

export default router;
