/**
 * Norwegian number formatting utilities for components
 *
 * Provides functions to format and parse numbers according to Norwegian conventions:
 * - Space as thousands separator (123 456)
 * - Comma as decimal separator (123,45)
 *
 * Usage:
 *   import { formatNumber, parseNumber } from '@/forms/utils/numberFormat';
 *
 *   formatNumber(123456.78)  // "123 456,78"
 *   parseNumber("123 456,78")  // 123456.78
 */

/**
 * Format a number with Norwegian separators
 *
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with thousands separator and decimal separator
 *
 * @example
 * formatNumber(123456.78)     // "123 456,78"
 * formatNumber(123456.78, 0)  // "123 457"
 * formatNumber(123456.78, 1)  // "123 456,8"
 */
export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString('nb-NO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Parse a Norwegian-formatted number string to a JavaScript number
 *
 * Handles both Norwegian format (space + comma) and standard format (dot)
 *
 * @param value - The string to parse
 * @returns Parsed number, or NaN if invalid
 *
 * @example
 * parseNumber("123 456,78")  // 123456.78
 * parseNumber("123456.78")   // 123456.78
 * parseNumber("1 234")       // 1234
 * parseNumber("invalid")     // NaN
 */
export function parseNumber(value: string): number {
  if (typeof value !== 'string') {
    return NaN;
  }

  // Remove spaces (thousands separator) and replace comma with dot (decimal separator)
  const normalized = value.trim().replace(/\s/g, '').replace(',', '.');

  // Parse to float
  const result = parseFloat(normalized);

  return result;
}
