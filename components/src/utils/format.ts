/**
 * Format utilities for components
 *
 * Provides functions to format numbers and dates according to Norwegian conventions:
 * - Numbers: space as thousands separator, comma as decimal
 * - Dates: dd.MM.yyyy format
 */

/**
 * Format a number with Norwegian separators
 *
 * @param value - The number to format
 * @returns Formatted string with thousands separator and decimal separator
 *
 * @example
 * formatNumber(123456.78)     // "123 456,78"
 * formatNumber(1234)          // "1 234,00"
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('nb-NO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Format a number as Norwegian currency
 *
 * @param value - The number to format
 * @returns Formatted string with currency suffix
 *
 * @example
 * formatCurrency(123456.78)  // "123 456,78 kr"
 * formatCurrency(1234)       // "1 234,00 kr"
 */
export function formatCurrency(value: number): string {
  return formatNumber(value) + ' kr';
}

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
