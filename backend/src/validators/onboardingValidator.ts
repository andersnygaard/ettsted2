/**
 * Onboarding Validator
 *
 * Validates the complete onboarding request:
 * - User info (nickname)
 * - Profile (salary, expenses, birth year, retirement age, fireNumber)
 * - Accounts (with values for initial snapshot)
 *
 * Hard validation: all required fields must be present and valid.
 */

import { Request, Response, NextFunction } from 'express';
import { getUserByNickname, getUserById } from '../services/userService';
import { getSnapshotsByUserId } from '../services/portfolioService';
import { logger } from '../utils/logger';
import { Category } from '../models/User';

/**
 * Nickname validation rules:
 * - 3-20 characters
 * - Alphanumeric characters (a-z, A-Z, 0-9)
 * - Underscores allowed
 */
const NICKNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

/**
 * Valid account categories
 */
const VALID_CATEGORIES: Category[] = ['sparing', 'gjeld', 'pensjon'];

/**
 * Account data from onboarding request
 */
interface OnboardingAccount {
  name: string;
  category: Category;
  value: number;
  isActive: boolean;
  loanDetails?: {
    interestRate: number;
    remainingYears: number;
    originalAmount?: number;
  };
  isPublicPension?: boolean;
}

/**
 * Profile data from onboarding request
 */
interface OnboardingProfile {
  monthlySalary: number;
  monthlySavings: number;
  birthYear: number;
  plannedRetirementAge: number;
  fireNumber?: number;
}

/**
 * Full onboarding request body
 */
export interface OnboardingRequest {
  nickname: string;
  profile: OnboardingProfile;
  accounts: OnboardingAccount[];
}

/**
 * Validates the complete onboarding request
 *
 * Checks:
 * - nickname: required, 3-20 chars, alphanumeric + underscore
 * - profile: all required fields with valid ranges
 * - accounts: at least 1 per category, valid structure
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export function validateOnboardingRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { nickname, profile, accounts } = req.body as OnboardingRequest;
  const errors: { field: string; message: string }[] = [];
  const currentYear = new Date().getFullYear();

  // === NICKNAME VALIDATION ===
  if (!nickname) {
    errors.push({ field: 'nickname', message: 'Brukernavn er påkrevd' });
  } else if (typeof nickname !== 'string') {
    errors.push({ field: 'nickname', message: 'Brukernavn må være tekst' });
  } else if (!NICKNAME_REGEX.test(nickname)) {
    errors.push({
      field: 'nickname',
      message: 'Brukernavn må være 3-20 tegn (bokstaver, tall, understrek)'
    });
  }

  // === PROFILE VALIDATION ===
  if (!profile || typeof profile !== 'object') {
    errors.push({ field: 'profile', message: 'Profil er påkrevd' });
  } else {
    // Monthly salary
    if (profile.monthlySalary === undefined || profile.monthlySalary === null) {
      errors.push({ field: 'profile.monthlySalary', message: 'Månedlig inntekt er påkrevd' });
    } else if (typeof profile.monthlySalary !== 'number' || profile.monthlySalary < 0) {
      errors.push({ field: 'profile.monthlySalary', message: 'Månedlig inntekt må være et tall >= 0' });
    }

    // Monthly savings
    if (profile.monthlySavings === undefined || profile.monthlySavings === null) {
      errors.push({ field: 'profile.monthlySavings', message: 'Månedlig sparing er påkrevd' });
    } else if (typeof profile.monthlySavings !== 'number' || profile.monthlySavings < 0) {
      errors.push({ field: 'profile.monthlySavings', message: 'Månedlig sparing må være et tall >= 0' });
    }

    // Birth year
    if (profile.birthYear === undefined || profile.birthYear === null) {
      errors.push({ field: 'profile.birthYear', message: 'Fødselsår er påkrevd' });
    } else if (typeof profile.birthYear !== 'number') {
      errors.push({ field: 'profile.birthYear', message: 'Fødselsår må være et tall' });
    } else if (profile.birthYear < 1900 || profile.birthYear > currentYear) {
      errors.push({ field: 'profile.birthYear', message: `Fødselsår må være mellom 1900 og ${currentYear}` });
    }

    // Planned retirement age
    if (profile.plannedRetirementAge === undefined || profile.plannedRetirementAge === null) {
      errors.push({ field: 'profile.plannedRetirementAge', message: 'Pensjonsalder er påkrevd' });
    } else if (typeof profile.plannedRetirementAge !== 'number') {
      errors.push({ field: 'profile.plannedRetirementAge', message: 'Pensjonsalder må være et tall' });
    } else if (profile.plannedRetirementAge < 30 || profile.plannedRetirementAge > 100) {
      errors.push({ field: 'profile.plannedRetirementAge', message: 'Pensjonsalder må være mellom 30 og 100' });
    }

    // Fire number (optional, but if provided must be positive)
    if (profile.fireNumber !== undefined && profile.fireNumber !== null) {
      if (typeof profile.fireNumber !== 'number' || profile.fireNumber <= 0) {
        errors.push({ field: 'profile.fireNumber', message: 'F.I.R.E. tall må være større enn 0' });
      }
    }
  }

  // === ACCOUNTS VALIDATION ===
  if (!accounts || !Array.isArray(accounts)) {
    errors.push({ field: 'accounts', message: 'Kontoer er påkrevd og må være en liste' });
  } else {
    // Track categories to ensure at least one per category
    const categoryCounts: Record<Category, number> = {
      sparing: 0,
      gjeld: 0,
      pensjon: 0
    };

    accounts.forEach((account, index) => {
      const prefix = `accounts[${index}]`;

      // Name validation
      if (!account.name || typeof account.name !== 'string') {
        errors.push({ field: `${prefix}.name`, message: 'Kontonavn er påkrevd' });
      } else if (account.name.length < 1 || account.name.length > 50) {
        errors.push({ field: `${prefix}.name`, message: 'Kontonavn må være 1-50 tegn' });
      }

      // Category validation
      if (!account.category || !VALID_CATEGORIES.includes(account.category)) {
        errors.push({
          field: `${prefix}.category`,
          message: `Kategori må være en av: ${VALID_CATEGORIES.join(', ')}`
        });
      } else {
        categoryCounts[account.category]++;
      }

      // Value validation
      if (account.value === undefined || account.value === null) {
        errors.push({ field: `${prefix}.value`, message: 'Verdi er påkrevd' });
      } else if (typeof account.value !== 'number' || account.value < 0) {
        errors.push({ field: `${prefix}.value`, message: 'Verdi må være et tall >= 0' });
      }

      // isActive validation
      if (typeof account.isActive !== 'boolean') {
        errors.push({ field: `${prefix}.isActive`, message: 'isActive må være true eller false' });
      }

      // Loan details validation (required for gjeld, forbidden for others)
      if (account.category === 'gjeld') {
        if (!account.loanDetails) {
          errors.push({ field: `${prefix}.loanDetails`, message: 'Lånedetaljer er påkrevd for gjeld' });
        } else {
          // Interest rate
          if (account.loanDetails.interestRate === undefined || account.loanDetails.interestRate === null) {
            errors.push({ field: `${prefix}.loanDetails.interestRate`, message: 'Rente er påkrevd' });
          } else if (typeof account.loanDetails.interestRate !== 'number') {
            errors.push({ field: `${prefix}.loanDetails.interestRate`, message: 'Rente må være et tall' });
          } else if (account.loanDetails.interestRate < 0 || account.loanDetails.interestRate > 100) {
            errors.push({ field: `${prefix}.loanDetails.interestRate`, message: 'Rente må være mellom 0 og 100' });
          }

          // Remaining years
          if (account.loanDetails.remainingYears === undefined || account.loanDetails.remainingYears === null) {
            errors.push({ field: `${prefix}.loanDetails.remainingYears`, message: 'Gjenstående år er påkrevd' });
          } else if (typeof account.loanDetails.remainingYears !== 'number') {
            errors.push({ field: `${prefix}.loanDetails.remainingYears`, message: 'Gjenstående år må være et tall' });
          } else if (account.loanDetails.remainingYears < 0 || account.loanDetails.remainingYears > 50) {
            errors.push({ field: `${prefix}.loanDetails.remainingYears`, message: 'Gjenstående år må være mellom 0 og 50' });
          }

          // Original amount (optional)
          if (account.loanDetails.originalAmount !== undefined && account.loanDetails.originalAmount !== null) {
            if (typeof account.loanDetails.originalAmount !== 'number' || account.loanDetails.originalAmount < 0) {
              errors.push({ field: `${prefix}.loanDetails.originalAmount`, message: 'Opprinnelig beløp må være >= 0' });
            }
          }
        }
      } else if (account.loanDetails) {
        // loanDetails provided for non-gjeld account
        errors.push({ field: `${prefix}.loanDetails`, message: 'Lånedetaljer er kun tillatt for gjeld-kontoer' });
      }
    });

    // Check at least one account per category
    for (const category of VALID_CATEGORIES) {
      if (categoryCounts[category] === 0) {
        errors.push({
          field: 'accounts',
          message: `Minst én konto i kategorien "${category}" er påkrevd`
        });
      }
    }
  }

  // Return errors if any
  if (errors.length > 0) {
    logger.warn('Onboarding validation failed', { errors, nickname });
    res.status(400).json({
      error: {
        message: 'Validering feilet',
        code: 'VALIDATION_ERROR',
        details: errors
      },
      success: false
    });
    return;
  }

  logger.debug('Onboarding validation passed', { nickname, accountCount: accounts?.length });
  next();
}

/**
 * Validates that nickname is available (not taken by another user)
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
      logger.warn('Nickname already taken during onboarding', { nickname, existingUserId: existingUser.id });
      res.status(409).json({
        error: {
          message: 'Brukernavnet er allerede tatt',
          code: 'CONFLICT',
          details: { field: 'nickname' }
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
        message: 'Kunne ikke validere brukernavn',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}

/**
 * Validates that user doesn't already exist (first-time setup only)
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export async function validateUserNotExists(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.user!.userId;

  try {
    const existingUser = await getUserById(userId);

    if (existingUser) {
      logger.warn('User already exists during onboarding', { userId, nickname: existingUser.nickname });
      res.status(409).json({
        error: {
          message: 'Bruker er allerede satt opp',
          code: 'CONFLICT',
          details: { nickname: existingUser.nickname }
        },
        success: false
      });
      return;
    }

    logger.debug('User does not exist, can proceed with onboarding', { userId });
    next();
  } catch (error) {
    logger.error('Error checking if user exists', { userId, error });
    res.status(500).json({
      error: {
        message: 'Kunne ikke validere bruker',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}

/**
 * Gets the first day of the current month in dd.MM.yyyy format
 */
export function getFirstOfMonth(): string {
  const now = new Date();
  const day = '01';
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Validates that no snapshot exists for current month
 * (one snapshot per month rule)
 *
 * @param req - Express request
 * @param res - Express response
 * @param next - Express next function
 */
export async function validateNoSnapshotForMonth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.user!.userId;
  const snapshotDate = getFirstOfMonth();

  try {
    // Get all snapshots for user
    const snapshots = await getSnapshotsByUserId(userId);

    // Check if any snapshot has the same date
    const existingSnapshot = snapshots.find(s => s.date === snapshotDate);

    if (existingSnapshot) {
      logger.warn('Snapshot already exists for month', { userId, date: snapshotDate });
      res.status(409).json({
        error: {
          message: `Du har allerede et snapshot for denne måneden (${snapshotDate})`,
          code: 'SNAPSHOT_EXISTS',
          details: { date: snapshotDate, snapshotId: existingSnapshot.id }
        },
        success: false
      });
      return;
    }

    logger.debug('No existing snapshot for month', { userId, date: snapshotDate });
    next();
  } catch (error) {
    logger.error('Error checking for existing snapshot', { userId, date: snapshotDate, error });
    res.status(500).json({
      error: {
        message: 'Kunne ikke validere snapshot',
        code: 'INTERNAL_SERVER_ERROR'
      },
      success: false
    });
  }
}
