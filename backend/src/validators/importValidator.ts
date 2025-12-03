/**
 * Import Validator Schemas
 *
 * Validation schemas for LLM-powered data import endpoints:
 * - Chat message validation (for LLM data extraction)
 * - Batch insert validation (for snapshot insertion)
 */

import { z } from 'zod';

/**
 * Norwegian date format: dd.MM.yyyy (e.g., "01.01.2024")
 */
const DATE_REGEX = /^\d{2}\.\d{2}\.\d{4}$/;

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

/**
 * Chat message schema for LLM data extraction
 *
 * Fields:
 * - message: User message (1-10000 chars)
 * - conversationId: Optional conversation ID for multi-turn chat
 */
export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500000, 'Message must be at most 500000 characters'),
  conversationId: z
    .string()
    .nullish() // Allow null, undefined, or string
    .transform(val => val ?? undefined) // Convert null to undefined
});

/**
 * Account schema for batch insert
 *
 * Fields:
 * - name: Account name (1-100 chars)
 * - value: Account value in NOK (number)
 * - assetClass: Asset class enum
 */
export const importAccountSchema = z.object({
  name: z
    .string()
    .min(1, 'Account name is required')
    .max(100, 'Account name must be at most 100 characters'),
  value: z
    .number()
    .finite('Value must be a finite number'),
  assetClass: z
    .string()
    .min(1, 'Asset class is required')
    .max(50, 'Asset class must be at most 50 characters')
}).refine(
  (data) => data.value >= 0 || data.assetClass === 'lån' || data.assetClass === 'gjeld',
  {
    message: 'Value cannot be negative (except for lån/gjeld)',
    path: ['value']
  }
);

/**
 * Snapshot schema for batch insert
 *
 * Fields:
 * - date: Date in dd.MM.yyyy format
 * - accounts: Array of accounts with name, value, assetClass
 */
export const importSnapshotSchema = z.object({
  date: norwegianDateValidator,
  accounts: z
    .array(importAccountSchema)
    .min(0, 'Accounts must be an array')
});

/**
 * Batch insert schema
 *
 * Fields:
 * - snapshots: Array of snapshots to insert
 */
export const batchInsertSchema = z.object({
  snapshots: z
    .array(importSnapshotSchema)
    .min(1, 'At least one snapshot is required')
});
