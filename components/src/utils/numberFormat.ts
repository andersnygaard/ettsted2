/**
 * Norwegian number formatting utilities
 *
 * Provides functions to format and parse numbers according to Norwegian conventions:
 * - Space as thousands separator (123 456)
 * - Comma as decimal separator (123,45)
 * - Currency suffix "kr" (123 456,78 kr)
 *
 * Usage:
 *   import { formatCurrency, formatNumber, parseNumber } from '@finans/components';
 *
 *   formatCurrency(123456.78)  // "123 456,78 kr"
 *   formatNumber(123456.78)    // "123 456,78"
 *   parseNumber("123 456,78")  // 123456.78
 */

import numeral from 'numeral';

/**
 * Format a number as Norwegian currency
 *
 * @param value - The number to format
 * @returns Formatted string with thousands separator, decimal separator, and currency symbol
 *
 * @example
 * formatCurrency(123456.78)  // "123 456,78 kr"
 * formatCurrency(1234)       // "1 234,00 kr"
 * formatCurrency(0.5)        // "0,50 kr"
 */
export function formatCurrency(value: number): string {
  return numeral(value).format('0,0.00') + ' kr';
}

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
  const format = decimals > 0 ? `0,0.${'0'.repeat(decimals)}` : '0,0';
  return numeral(value).format(format);
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

/**
 * Format a percentage with Norwegian number formatting
 *
 * @param value - The decimal value (e.g., 0.075 for 7.5%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 *
 * @example
 * formatPercentage(0.075)     // "7,50 %"
 * formatPercentage(0.075, 1)  // "7,5 %"
 * formatPercentage(0.5, 0)    // "50 %"
 */
export function formatPercentage(value: number, decimals = 2): string {
  const percentage = value * 100;
  return formatNumber(percentage, decimals) + ' %';
}
