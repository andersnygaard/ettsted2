/**
 * Norwegian date formatting utilities for components
 *
 * Provides functions to format and parse dates according to Norwegian conventions:
 * - Display format: dd.MM.yyyy (01.01.2024)
 * - Storage format: ISO 8601 (2024-01-01T00:00:00.000Z)
 *
 * Usage:
 *   import { formatDate, getFirstDayOfMonth } from '@/forms/utils/dateFormat';
 *
 *   formatDate(new Date())       // "28.11.2025"
 *   getFirstDayOfMonth(new Date()) // Date for 1st of current month
 */

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
  return date.toLocaleDateString('nb-NO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Parse a Norwegian date string to a Date object
 *
 * Expected format: dd.MM.yyyy
 * Returns undefined if invalid.
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
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
