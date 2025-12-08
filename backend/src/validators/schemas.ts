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
    message: 'Dato må være i formatet dd.MM.yyyy og være en gyldig dato'
  }
);

// ============================================================================
// USER SCHEMAS
// ============================================================================

/**
 * User setup schema (first-time onboarding)
 */
export const userSetupSchema = z.object({
  nickname: z
    .string()
    .min(3, 'Kallenavn må være minst 3 tegn')
    .max(30, 'Kallenavn kan ikke være mer enn 30 tegn')
    .regex(USERNAME_REGEX, 'Kallenavn kan kun inneholde bokstaver, tall og understrek'),
  email: z
    .string()
    .regex(EMAIL_REGEX, 'Ugyldig e-postformat')
    .optional()
    .or(z.literal(''))
});

/**
 * User profile schema (for updates)
 */
export const userProfileSchema = z.object({
  monthlySalary: z
    .number()
    .nonnegative('Månedslønn kan ikke være negativ')
    .optional(),
  monthlySavings: z
    .number()
    .nonnegative('Månedlig sparing kan ikke være negativ')
    .optional(),
  birthYear: z
    .number()
    .int('Fødselsår må være et heltall')
    .min(1900, 'Fødselsår må være 1900 eller senere')
    .max(new Date().getFullYear(), 'Fødselsår kan ikke være i fremtiden')
    .optional(),
  plannedRetirementAge: z
    .number()
    .int('Pensjonsalder må være et heltall')
    .min(30, 'Pensjonsalder må være minst 30')
    .max(100, 'Pensjonsalder kan ikke være over 100')
    .optional(),
  fireNumber: z
    .number()
    .nonnegative('F.I.R.E.-tall kan ikke være negativt')
    .optional()
});

/**
 * Loan details schema (for gjeld accounts)
 */
export const loanDetailsSchema = z.object({
  interestRate: z.number().nonnegative('Rente kan ikke være negativ'),
  remainingYears: z.number().int().nonnegative('Gjenværende år kan ikke være negativt'),
  originalAmount: z.number().nonnegative('Opprinnelig beløp kan ikke være negativt').optional()
});

/**
 * Account config schema (user's account configurations)
 */
export const accountConfigSchema = z.object({
  id: z.string().min(1, 'Konto-ID er påkrevd'),
  name: z.string().min(1, 'Kontonavn er påkrevd').max(100, 'Kontonavn kan ikke være mer enn 100 tegn'),
  category: z.enum(['sparing', 'gjeld', 'pensjon'], { errorMap: () => ({ message: 'Kategori må være sparing, gjeld eller pensjon' }) }),
  isActive: z.boolean(),
  sortOrder: z.number().int().nonnegative('Sorteringsrekkefølge kan ikke være negativ'),
  createdAt: z.string().optional(),
  loanDetails: loanDetailsSchema.optional(),
  // Value is optional - only used when updating from edit mode to sync snapshot
  value: z.number().finite('Verdi må være et gyldig tall').optional(),
  // Whether this is a public pension account (Folketrygden) - only for pensjon category
  isPublicPension: z.boolean().optional()
});

/**
 * User update schema
 */
export const userUpdateSchema = z
  .object({
    email: z
      .string()
      .regex(EMAIL_REGEX, 'Ugyldig e-postformat')
      .optional()
      .or(z.literal('')),
    nickname: z
      .string()
      .min(3, 'Kallenavn må være minst 3 tegn')
      .max(30, 'Kallenavn kan ikke være mer enn 30 tegn')
      .regex(USERNAME_REGEX, 'Kallenavn kan kun inneholde bokstaver, tall og understrek')
      .optional(),
    profile: userProfileSchema.optional(),
    preferences: z.record(z.unknown()).optional(),
    accounts: z.array(accountConfigSchema).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Minst ett felt må oppdateres'
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
    .min(1, 'Kontonavn er påkrevd')
    .max(100, 'Kontonavn kan ikke være mer enn 100 tegn'),
  assetClass: z
    .string()
    .min(1, 'Aktivaklasse er påkrevd')
    .max(50, 'Aktivaklasse kan ikke være mer enn 50 tegn'),
  value: z
    .number()
    .finite('Verdi må være et gyldig tall'),
  notes: z
    .string()
    .max(500, 'Notater kan ikke være mer enn 500 tegn')
    .optional()
}).refine(
  (data) => data.value >= 0 || data.assetClass === 'gjeld',
  {
    message: 'Verdi kan ikke være negativ (unntatt for gjeld)',
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
      .min(1, 'Kontonavn er påkrevd')
      .max(100, 'Kontonavn kan ikke være mer enn 100 tegn')
      .optional(),
    assetClass: z
      .string()
      .min(1, 'Aktivaklasse er påkrevd')
      .max(50, 'Aktivaklasse kan ikke være mer enn 50 tegn')
      .optional(),
    value: z
      .number()
      .finite('Verdi må være et gyldig tall')
      .optional(),
    notes: z
      .string()
      .max(500, 'Notater kan ikke være mer enn 500 tegn')
      .optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Minst ett felt må oppdateres'
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
      message: 'Verdi kan ikke være negativ (unntatt for gjeld)',
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
    .min(0, 'Kontoer må være en liste')
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
    message: 'Minst ett felt må oppdateres'
  });

// ============================================================================
// PARAM SCHEMAS
// ============================================================================

/**
 * Snapshot ID param validation
 */
export const snapshotIdSchema = z.object({
  id: z.string().min(1, 'Øyeblikksbilde-ID er påkrevd')
});

/**
 * Account ID param validation
 */
export const accountIdSchema = z.object({
  accountId: z.string().min(1, 'Konto-ID er påkrevd')
});

/**
 * Combined snapshot and account ID params
 */
export const snapshotAndAccountIdSchema = z.object({
  id: z.string().min(1, 'Øyeblikksbilde-ID er påkrevd'),
  accountId: z.string().min(1, 'Konto-ID er påkrevd')
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
    .min(1, 'Kontonavn er påkrevd')
    .max(100, 'Kontonavn kan ikke være mer enn 100 tegn'),
  category: z
    .enum(['sparing', 'gjeld', 'pensjon'], {
      errorMap: () => ({ message: 'Kategori må være sparing, gjeld eller pensjon' })
    }),
  isActive: z
    .boolean()
    .optional()
    .default(true),
  loanDetails: z
    .object({
      interestRate: z
        .number()
        .min(0, 'Rente kan ikke være negativ')
        .max(100, 'Rente kan ikke overstige 100 %'),
      remainingYears: z
        .number()
        .min(0, 'Gjenværende år kan ikke være negativt')
        .max(50, 'Gjenværende år kan ikke overstige 50'),
      originalAmount: z
        .number()
        .positive('Opprinnelig beløp må være positivt')
        .optional()
    })
    .optional(),
  isPublicPension: z
    .boolean()
    .optional()
});

/**
 * Account config update schema (all fields optional)
 */
export const updateAccountConfigSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Kontonavn er påkrevd')
      .max(100, 'Kontonavn kan ikke være mer enn 100 tegn')
      .optional(),
    isActive: z
      .boolean()
      .optional(),
    sortOrder: z
      .number()
      .int('Sorteringsrekkefølge må være et heltall')
      .min(0, 'Sorteringsrekkefølge kan ikke være negativ')
      .optional(),
    loanDetails: z
      .object({
        interestRate: z
          .number()
          .min(0, 'Rente kan ikke være negativ')
          .max(100, 'Rente kan ikke overstige 100 %'),
        remainingYears: z
          .number()
          .min(0, 'Gjenværende år kan ikke være negativt')
          .max(50, 'Gjenværende år kan ikke overstige 50'),
        originalAmount: z
          .number()
          .positive('Opprinnelig beløp må være positivt')
          .optional()
      })
      .optional(),
    isPublicPension: z
      .boolean()
      .optional()
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'Minst ett felt må oppdateres'
  });

/**
 * Account config ID param validation
 */
export const accountConfigIdSchema = z.object({
  id: z.string().min(1, 'Konto-ID er påkrevd')
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

/**
 * Compound interest calculator request schema
 * Formula: A = P(1 + r/n)^(nt) + PMT * (((1 + r/n)^(nt) - 1) / (r/n))
 */
export const compoundSchema = z.object({
  principal: z
    .number()
    .nonnegative('Principal cannot be negative'),
  annualRate: z
    .number()
    .min(0, 'Annual rate cannot be negative')
    .max(100, 'Annual rate cannot exceed 100%')
    .describe('Annual interest rate as percentage (e.g., 7 for 7%)'),
  years: z
    .number()
    .positive('Years must be greater than 0')
    .max(100, 'Years cannot exceed 100'),
  compoundingFrequency: z
    .number()
    .int('Compounding frequency must be an integer')
    .positive('Compounding frequency must be positive')
    .optional()
    .default(12)
    .describe('Compounding frequency per year (default: 12 for monthly)'),
  monthlyContribution: z
    .number()
    .nonnegative('Monthly contribution cannot be negative')
    .optional()
    .default(0)
});

/**
 * F.I.R.E. calculator request schema
 * Uses 4% rule (25x annual expenses) by default
 */
export const fireSchema = z.object({
  currentSavings: z
    .number()
    .nonnegative('Current savings cannot be negative'),
  annualExpenses: z
    .number()
    .positive('Annual expenses must be greater than 0'),
  annualIncome: z
    .number()
    .nonnegative('Annual income cannot be negative')
    .optional()
    .default(0),
  annualSavings: z
    .number()
    .optional()
    .describe('Annual savings (calculated from income - expenses if not provided)'),
  expectedReturn: z
    .number()
    .optional()
    .default(7)
    .describe('Expected annual return as percentage (default: 7)'),
  customFireNumber: z
    .number()
    .positive('Custom F.I.R.E. number must be positive')
    .optional()
    .describe('Override default 25x expenses calculation')
});

/**
 * Loan calculator request schema
 * Standard amortization formula
 */
export const loanSchema = z.object({
  principal: z
    .number()
    .positive('Principal must be greater than 0'),
  annualRate: z
    .number()
    .min(0, 'Annual rate cannot be negative')
    .max(50, 'Annual rate cannot exceed 50%')
    .describe('Annual interest rate as percentage (e.g., 5 for 5%)'),
  years: z
    .number()
    .positive('Years must be greater than 0')
    .max(50, 'Loan term cannot exceed 50 years'),
  extraPayment: z
    .number()
    .nonnegative('Extra payment cannot be negative')
    .optional()
    .default(0)
    .describe('Additional monthly payment towards principal')
});
