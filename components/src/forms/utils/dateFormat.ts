/**
 * Norwegian date formatting utilities
 *
 * Provides functions to format and parse dates according to Norwegian conventions:
 * - Display format: dd.MM.yyyy (01.01.2024)
 * - Storage format: ISO 8601 (2024-01-01T00:00:00.000Z)
 *
 * Uses date-fns with Norwegian (Bokmål) locale for formatting.
 *
 * Usage:
 *   import { formatDate, parseDate } from '@finans/components';
 *
 *   formatDate(new Date())       // "28.11.2025"
 *   parseDate("01.01.2024")      // Date object for 2024-01-01
 */

import { format, parse, isValid } from 'date-fns';
import { nb } from 'date-fns/locale';

/**
 * Norwegian date format pattern (dd.MM.yyyy)
 */
const DATE_FORMAT = 'dd.MM.yyyy';

/**
 * Format a Date object to Norwegian date string
 *
 * @param date - The Date object to format
 * @returns Formatted date string in dd.MM.yyyy format
 *
 * @example
 * formatDate(new Date('2024-01-01'))  // "01.01.2024"
 * formatDate(new Date('2025-11-28'))  // "28.11.2025"
 */
export function formatDate(date: Date): string {
  if (!isValid(date)) {
    throw new Error('Invalid date provided to formatDate');
  }
  return format(date, DATE_FORMAT, { locale: nb });
}

/**
 * Parse a Norwegian date string to a Date object
 *
 * @param dateString - The date string in dd.MM.yyyy format
 * @returns Parsed Date object
 * @throws Error if date string is invalid
 *
 * @example
 * parseDate("01.01.2024")  // Date object for 2024-01-01
 * parseDate("28.11.2025")  // Date object for 2025-11-28
 */
export function parseDate(dateString: string): Date {
  if (typeof dateString !== 'string') {
    throw new Error('Date string must be a string');
  }

  const parsedDate = parse(dateString, DATE_FORMAT, new Date(), { locale: nb });

  if (!isValid(parsedDate)) {
    throw new Error(`Invalid date string: ${dateString}. Expected format: dd.MM.yyyy`);
  }

  return parsedDate;
}

/**
 * Convert a Date object to ISO 8601 string for API communication
 *
 * This should be used when sending dates to the backend API.
 *
 * @param date - The Date object to convert
 * @returns ISO 8601 formatted string
 *
 * @example
 * toISOString(new Date('2024-01-01'))  // "2024-01-01T00:00:00.000Z"
 */
export function toISOString(date: Date): string {
  if (!isValid(date)) {
    throw new Error('Invalid date provided to toISOString');
  }
  return date.toISOString();
}

/**
 * Parse an ISO 8601 string from API to a Date object
 *
 * This should be used when receiving dates from the backend API.
 *
 * @param isoString - The ISO 8601 formatted string
 * @returns Parsed Date object
 * @throws Error if ISO string is invalid
 *
 * @example
 * fromISOString("2024-01-01T00:00:00.000Z")  // Date object
 */
export function fromISOString(isoString: string): Date {
  if (typeof isoString !== 'string') {
    throw new Error('ISO string must be a string');
  }

  const date = new Date(isoString);

  if (!isValid(date)) {
    throw new Error(`Invalid ISO date string: ${isoString}`);
  }

  return date;
}

/**
 * Format a Date object to a more readable Norwegian format with month name
 *
 * @param date - The Date object to format
 * @returns Formatted date string (e.g., "1. januar 2024")
 *
 * @example
 * formatDateLong(new Date('2024-01-01'))  // "1. januar 2024"
 */
export function formatDateLong(date: Date): string {
  if (!isValid(date)) {
    throw new Error('Invalid date provided to formatDateLong');
  }
  return format(date, 'd. MMMM yyyy', { locale: nb });
}

/**
 * Get the first day of the month for a given date
 *
 * Useful for monthly snapshots where we always use the 1st of the month.
 *
 * @param date - The reference date
 * @returns Date object set to the 1st of the same month
 *
 * @example
 * getFirstDayOfMonth(new Date('2024-01-15'))  // Date for 2024-01-01
 */
export function getFirstDayOfMonth(date: Date): Date {
  if (!isValid(date)) {
    throw new Error('Invalid date provided to getFirstDayOfMonth');
  }
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * Parse a Norwegian date string to a Date object (lenient parsing for form input)
 *
 * Expected format: dd.MM.yyyy
 * Returns undefined if invalid (useful for form validation).
 *
 * @param input - The date string to parse
 * @returns Parsed Date object or undefined if invalid
 *
 * @example
 * parseNorwegianDate("01.01.2024")  // Date object for 2024-01-01
 * parseNorwegianDate("invalid")     // undefined
 */
export function parseNorwegianDate(input: string): Date | undefined {
  // Allow partial input during typing
  if (!input || input.trim() === '') {
    return undefined;
  }

  // Expected format: dd.MM.yyyy
  const parts = input.split('.');
  if (parts.length !== 3) {
    return undefined;
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  // Basic validation
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return undefined;
  }

  if (month < 1 || month > 12) {
    return undefined;
  }

  if (day < 1 || day > 31) {
    return undefined;
  }

  // Year should be reasonable (e.g., 1900-2100)
  if (year < 1900 || year > 2100) {
    return undefined;
  }

  // Create date object (month is 0-indexed in JavaScript)
  const date = new Date(year, month - 1, day);

  // Validate the date is correct (e.g., Feb 30 would roll over to Mar 2)
  if (
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    return undefined;
  }

  return date;
}
