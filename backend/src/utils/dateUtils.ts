/**
 * Date utilities for Norwegian date format
 *
 * Handles parsing and sorting of dates in dd.MM.yyyy format.
 */

/**
 * Parse Norwegian date string (dd.MM.yyyy) to Date object
 *
 * @param dateString - Date in dd.MM.yyyy format
 * @returns Date object
 * @throws Error if format is invalid
 */
export function parseDate(dateString: string): Date {
  const parts = dateString.split('.');
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${dateString}. Expected dd.MM.yyyy`);
  }

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
  const year = parseInt(parts[2], 10);

  const date = new Date(year, month, day);

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${dateString}`);
  }

  return date;
}

/**
 * Compare two date strings for sorting (newest first)
 *
 * @param a - First date string (dd.MM.yyyy)
 * @param b - Second date string (dd.MM.yyyy)
 * @returns Negative if a > b, positive if a < b (descending order)
 */
export function compareDatesDesc(a: string, b: string): number {
  return parseDate(b).getTime() - parseDate(a).getTime();
}

/**
 * Compare two date strings for sorting (oldest first)
 *
 * @param a - First date string (dd.MM.yyyy)
 * @param b - Second date string (dd.MM.yyyy)
 * @returns Negative if a < b, positive if a > b (ascending order)
 */
export function compareDatesAsc(a: string, b: string): number {
  return parseDate(a).getTime() - parseDate(b).getTime();
}

/**
 * Get the first day of the current month in dd.MM.yyyy format
 *
 * @returns Date string in dd.MM.yyyy format (e.g., "01.12.2024")
 */
export function getCurrentMonthFirstDay(): string {
  const now = new Date();
  const day = '01';
  const month = String(now.getMonth() + 1).padStart(2, '0'); // JS months are 0-indexed
  const year = String(now.getFullYear());

  return `${day}.${month}.${year}`;
}
