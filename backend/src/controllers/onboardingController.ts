/**
 * Onboarding Controller
 *
 * Handles the complete onboarding endpoint:
 * POST /api/v1/users/me/onboarding
 *
 * Creates user + profile + accounts + first snapshot atomically.
 */

import { Request, Response } from 'express';
import { createUserWithSnapshot } from '../services/onboardingService';
import { OnboardingRequest } from '../validators/onboardingValidator';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError } from '../errors';
import { logger } from '../utils/logger';

/**
 * Complete user onboarding
 *
 * POST /api/v1/users/me/onboarding
 *
 * Creates a new user with:
 * - Profile (salary, expenses, birth year, retirement age, fireNumber)
 * - Account configurations
 * - First monthly snapshot with account values
 *
 * Request body:
 * {
 *   nickname: string,
 *   profile: {
 *     monthlySalary: number,
 *     monthlySavings: number,
 *     birthYear: number,
 *     plannedRetirementAge: number,
 *     fireNumber?: number
 *   },
 *   accounts: Array<{
 *     name: string,
 *     category: 'sparing' | 'gjeld' | 'pensjon',
 *     value: number,
 *     isActive: boolean,
 *     loanDetails?: {
 *       interestRate: number,
 *       remainingYears: number,
 *       originalAmount?: number
 *     }
 *   }>
 * }
 *
 * Note: Email comes from OAuth token (req.user.email), not from request body.
 *
 * @param req - Express request (req.user populated by validateAuth middleware)
 * @param res - Express response
 *
 * @returns 201 with created user and snapshot
 */
export const completeOnboarding = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const userEmail = req.user!.email;
  const { nickname, profile, accounts } = req.body as OnboardingRequest;

  // Validate email is present from OAuth
  if (!userEmail) {
    logger.warn('OAuth did not provide email during onboarding', { userId });
    throw new ValidationError('Din OAuth-leverandør ga ikke e-postadresse. Vennligst bruk en annen innloggingsmetode.', {
      code: 'MISSING_EMAIL'
    });
  }

  logger.info('Starting onboarding', {
    userId,
    nickname,
    hasEmail: !!userEmail,
    accountCount: accounts.length
  });

  const result = await createUserWithSnapshot({
    userId,
    email: userEmail,
    nickname,
    profile,
    accounts
  });

  logger.info('Onboarding completed successfully', {
    userId,
    nickname,
    snapshotId: result.snapshot.id,
    totalNetWorth: result.snapshot.totalNetWorth
  });

  res.status(201).json({
    data: {
      user: result.user,
      snapshot: result.snapshot
    },
    success: true
  });
});
