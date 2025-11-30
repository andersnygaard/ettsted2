/**
 * Zod Validation Schemas
 *
 * Input validation schemas for all API endpoints.
 * These provide type-safe, declarative validation using Zod.
 */

import { z } from 'zod';

/**
 * Norwegian date format: dd.MM.yyyy (e.g., "01.01.2024")
 */
const DATE_REGEX = /^\d{2}\.\d{2}\.\d{4}$/;

/**
 * Username validation:
 * - 3-30 characters (updated from 3-20 per task requirements)
 * - Alphanumeric + underscores only
 */
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

/**
 * Email validation (basic format)
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Custom date validator for Norwegian format
 */
const norwegianDateValidator = z.string().refine(
  (dateStr) => {
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
  },
  {
    message: 'Date must be in dd.MM.yyyy format (e.g., "01.01.2024") and be a valid date'
  }
);

// ============================================================================
// USER SCHEMAS
// ============================================================================

/**
 * User setup schema (first-time onboarding)
 */
export const userSetupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(USERNAME_REGEX, 'Username can only contain letters, numbers, and underscores'),
  email: z
    .string()
    .regex(EMAIL_REGEX, 'Invalid email format')
    .optional()
    .or(z.literal(''))
});

/**
 * User profile schema (for updates)
 */
export const userProfileSchema = z.object({
  monthlySalary: z
    .number()
    .nonnegative('Monthly salary cannot be negative')
    .optional(),
  monthlySavings: z
    .number()
    .nonnegative('Monthly savings cannot be negative')
    .optional(),
  annualExpenses: z
    .number()
    .nonnegative('Annual expenses cannot be negative')
    .optional(),
  birthYear: z
    .number()
    .int('Birth year must be an integer')
    .min(1900, 'Birth year must be 1900 or later')
    .max(new Date().getFullYear(), 'Birth year cannot be in the future')
    .optional(),
  plannedRetirementAge: z
    .number()
    .int('Retirement age must be an integer')
    .min(30, 'Retirement age must be at least 30')
    .max(100, 'Retirement age cannot exceed 100')
    .optional(),
  fireNumber: z
    .number()
    .nonnegative('F.I.R.E. number cannot be negative')
    .optional()
});

/**
 * Loan details schema (for gjeld accounts)
 */
export const loanDetailsSchema = z.object({
  interestRate: z.number().nonnegative('Interest rate cannot be negative'),
  remainingYears: z.number().int().nonnegative('Remaining years cannot be negative'),
  originalAmount: z.number().nonnegative('Original amount cannot be negative').optional()
});

/**
 * Account config schema (user's account configurations)
 */
export const accountConfigSchema = z.object({
  id: z.string().min(1, 'Account id is required'),
  name: z.string().min(1, 'Account name is required').max(100, 'Account name must be at most 100 characters'),
  category: z.enum(['sparing', 'gjeld', 'pensjon'], { errorMap: () => ({ message: 'Category must be sparing, gjeld, or pensjon' }) }),
  isActive: z.boolean(),
  sortOrder: z.number().int().nonnegative('Sort order cannot be negative'),
  createdAt: z.string().optional(),
  loanDetails: loanDetailsSchema.optional()
});

/**
 * User update schema
 */
export const userUpdateSchema = z
  .object({
    email: z
      .string()
      .regex(EMAIL_REGEX, 'Invalid email format')
      .optional()
      .or(z.literal('')),
    nickname: z
      .string()
      .min(3, 'Nickname must be at least 3 characters')
      .max(30, 'Nickname must be at most 30 characters')
      .regex(USERNAME_REGEX, 'Nickname can only contain letters, numbers, and underscores')
      .optional(),
    profile: userProfileSchema.optional(),
    preferences: z.record(z.unknown()).optional(),
    accounts: z.array(accountConfigSchema).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field to update is required'
  });

// ============================================================================
// ACCOUNT SCHEMAS
// ============================================================================

/**
 * Account schema (embedded in snapshots)
 * Allows negative values only for gjeld (debt) accounts
 */
export const accountSchema = z.object({
  id: z.string().optional(), // Auto-generated if not provided
  name: z
    .string()
    .min(1, 'Account name is required')
    .max(100, 'Account name must be at most 100 characters'),
  assetClass: z
    .string()
    .min(1, 'Asset class is required')
    .max(50, 'Asset class must be at most 50 characters'),
  value: z
    .number()
    .finite('Value must be a finite number'),
  notes: z
    .string()
    .max(500, 'Notes must be at most 500 characters')
    .optional()
}).refine(
  (data) => data.value >= 0 || data.assetClass === 'gjeld',
  {
    message: 'Value cannot be negative (except for gjeld)',
    path: ['value']
  }
);

/**
 * Account update schema (all fields optional)
 * Allows negative values only for gjeld (debt) accounts
 */
export const accountUpdateSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Account name is required')
      .max(100, 'Account name must be at most 100 characters')
      .optional(),
    assetClass: z
      .string()
      .min(1, 'Asset class is required')
      .max(50, 'Asset class must be at most 50 characters')
      .optional(),
    value: z
      .number()
      .finite('Value must be a finite number')
      .optional(),
    notes: z
      .string()
      .max(500, 'Notes must be at most 500 characters')
      .optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field to update is required'
  })
  .refine(
    (data) => {
      // Allow negative values only for gjeld accounts
      if (data.value !== undefined && data.value < 0) {
        return data.assetClass === 'gjeld';
      }
      return true;
    },
    {
      message: 'Value cannot be negative (except for gjeld)',
      path: ['value']
    }
  );

// ============================================================================
// SNAPSHOT SCHEMAS
// ============================================================================

/**
 * Snapshot creation schema
 */
export const snapshotCreateSchema = z.object({
  date: norwegianDateValidator,
  accounts: z
    .array(accountSchema)
    .min(0, 'Accounts must be an array')
});

/**
 * Snapshot update schema (all fields optional)
 */
export const snapshotUpdateSchema = z
  .object({
    date: norwegianDateValidator.optional(),
    accounts: z.array(accountSchema).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field to update is required'
  });

// ============================================================================
// PARAM SCHEMAS
// ============================================================================

/**
 * Snapshot ID param validation
 */
export const snapshotIdSchema = z.object({
  id: z.string().min(1, 'Snapshot ID is required')
});

/**
 * Account ID param validation
 */
export const accountIdSchema = z.object({
  accountId: z.string().min(1, 'Account ID is required')
});

/**
 * Combined snapshot and account ID params
 */
export const snapshotAndAccountIdSchema = z.object({
  id: z.string().min(1, 'Snapshot ID is required'),
  accountId: z.string().min(1, 'Account ID is required')
});

// ============================================================================
// QUERY SCHEMAS
// ============================================================================

/**
 * Snapshot list query params
 */
export const snapshotQuerySchema = z.object({
  orderBy: z.enum(['date', 'createdAt']).optional().default('date'),
  ascending: z
    .string()
    .optional()
    .default('false')
    .transform((val) => val === 'true'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
});

// ============================================================================
// ACCOUNT CONFIG SCHEMAS
// ============================================================================

/**
 * Account config creation schema
 *
 * For AccountConfig CRUD operations (NOT for snapshot balances).
 * Accounts are embedded in User document and have categories: sparing, gjeld, pensjon
 */
export const createAccountConfigSchema = z.object({
  name: z
    .string()
    .min(1, 'Account name is required')
    .max(100, 'Account name must be at most 100 characters'),
  category: z
    .enum(['sparing', 'gjeld', 'pensjon'], {
      errorMap: () => ({ message: 'Category must be one of: sparing, gjeld, pensjon' })
    }),
  isActive: z
    .boolean()
    .optional()
    .default(true),
  loanDetails: z
    .object({
      interestRate: z
        .number()
        .min(0, 'Interest rate cannot be negative')
        .max(100, 'Interest rate cannot exceed 100%'),
      remainingYears: z
        .number()
        .min(0, 'Remaining years cannot be negative')
        .max(50, 'Remaining years cannot exceed 50'),
      originalAmount: z
        .number()
        .positive('Original amount must be positive')
        .optional()
    })
    .optional()
});

/**
 * Account config update schema (all fields optional)
 */
export const updateAccountConfigSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Account name is required')
      .max(100, 'Account name must be at most 100 characters')
      .optional(),
    isActive: z
      .boolean()
      .optional(),
    sortOrder: z
      .number()
      .int('Sort order must be an integer')
      .min(0, 'Sort order cannot be negative')
      .optional(),
    loanDetails: z
      .object({
        interestRate: z
          .number()
          .min(0, 'Interest rate cannot be negative')
          .max(100, 'Interest rate cannot exceed 100%'),
        remainingYears: z
          .number()
          .min(0, 'Remaining years cannot be negative')
          .max(50, 'Remaining years cannot exceed 50'),
        originalAmount: z
          .number()
          .positive('Original amount must be positive')
          .optional()
      })
      .optional()
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field to update is required'
  });

/**
 * Account config ID param validation
 */
export const accountConfigIdSchema = z.object({
  id: z.string().min(1, 'Account ID is required')
});

// ============================================================================
// CALCULATOR SCHEMAS
// ============================================================================

/**
 * Monte Carlo simulation request schema
 */
export const monteCarloSchema = z.object({
  portfolioValue: z
    .number()
    .positive('Portfolio value must be greater than 0'),
  annualWithdrawal: z
    .number()
    .nonnegative('Annual withdrawal cannot be negative'),
  years: z
    .number()
    .int('Years must be an integer')
    .positive('Years must be greater than 0'),
  expectedReturn: z
    .number()
    .optional()
    .default(7)
    .describe('Expected annual return as percentage (default: 7)'),
  volatility: z
    .number()
    .optional()
    .default(15)
    .describe('Return volatility (std dev) as percentage (default: 15)'),
  simulations: z
    .number()
    .int('Simulations must be an integer')
    .optional()
    .default(1000)
    .describe('Number of simulations to run (default: 1000, max: 10000)')
});
