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
 * User update schema
 */
export const userUpdateSchema = z
  .object({
    email: z
      .string()
      .regex(EMAIL_REGEX, 'Invalid email format')
      .optional()
      .or(z.literal('')),
    preferences: z.record(z.unknown()).optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field to update is required'
  });

// ============================================================================
// ACCOUNT SCHEMAS
// ============================================================================

/**
 * Account schema (embedded in snapshots)
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
    .finite('Value must be a finite number')
    .nonnegative('Value cannot be negative'),
  notes: z
    .string()
    .max(500, 'Notes must be at most 500 characters')
    .optional()
});

/**
 * Account update schema (all fields optional)
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
      .nonnegative('Value cannot be negative')
      .optional(),
    notes: z
      .string()
      .max(500, 'Notes must be at most 500 characters')
      .optional()
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field to update is required'
  });

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
