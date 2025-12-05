/**
 * User Routes
 *
 * API endpoints for user management:
 * - GET /api/v1/users/me - Get current user profile
 * - POST /api/v1/users/me/setup - First-time nickname setup (legacy)
 * - POST /api/v1/users/me/onboarding - Complete onboarding wizard
 * - PATCH /api/v1/users/me - Update user settings
 * - DELETE /api/v1/users/me - Delete user account (GDPR compliant)
 *
 * All routes require authentication via validateAuth middleware.
 */

import { Router, IRouter } from 'express';
import {
  getCurrentUser,
  setupUser,
  updateUser,
  deleteMe
} from '../controllers/userController';
import { completeOnboarding } from '../controllers/onboardingController';
import { validateBody } from '../middleware/validate';
import {
  userSetupSchema,
  userUpdateSchema,
  validateNicknameAvailable
} from '../validators';
import {
  validateOnboardingRequest,
  validateNicknameAvailable as validateOnboardingNickname,
  validateUserNotExists,
  validateNoSnapshotForMonth
} from '../validators/onboardingValidator';

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

/**
 * DELETE /api/v1/users/me
 * Delete user account and all associated data (GDPR compliant)
 *
 * Requires: Authentication
 * Returns: 200 with success message, or 404 if user not found
 *
 * Deletes:
 * - All snapshots from portfolios container
 * - User document from users container
 */
router.delete('/me', deleteMe);

/**
 * POST /api/v1/users/me/onboarding
 * Complete onboarding wizard (new user setup with profile, accounts, and first snapshot)
 *
 * Requires: Authentication, user must not exist, nickname must be available
 * Body: {
 *   nickname: string,
 *   profile: { monthlySalary, annualExpenses, birthYear, plannedRetirementAge, fireNumber? },
 *   accounts: Array<{ name, category, value, isActive, loanDetails? }>
 * }
 * Returns: 201 with created user and snapshot, or 409 if user/nickname exists
 *
 * Validation chain:
 * 1. validateOnboardingRequest - validates all input fields
 * 2. validateUserNotExists - ensures user hasn't already been set up
 * 3. validateOnboardingNickname - ensures nickname is available
 * 4. validateNoSnapshotForMonth - ensures no duplicate snapshot for current month
 */
router.post(
  '/me/onboarding',
  validateOnboardingRequest,
  validateUserNotExists,
  validateOnboardingNickname,
  validateNoSnapshotForMonth,
  completeOnboarding
);

export default router;
