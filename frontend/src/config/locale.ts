/**
 * Norwegian locale configuration for numeral.js
 *
 * Registers Norwegian (Bokmål) locale with:
 * - Space as thousands separator
 * - Comma as decimal separator
 * - "kr" as currency symbol
 *
 * This file should be imported early in the application lifecycle
 * (e.g., in main.tsx) to ensure the locale is set before any
 * formatting operations occur.
 */

import numeral from 'numeral';

// Register Norwegian (Bokmål) locale
numeral.register('locale', 'nb', {
  delimiters: {
    thousands: ' ',  // Space for thousands separator (e.g., 123 456)
    decimal: ','     // Comma for decimal separator (e.g., 123,45)
  },
  currency: {
    symbol: 'kr'     // Norwegian kroner symbol
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't'
  },
  ordinal: function () {
    return '.';      // Norwegian ordinal suffix (e.g., 1., 2., 3.)
  }
});

// Set Norwegian as the active locale
numeral.locale('nb');

/**
 * Initialize Norwegian locale
 *
 * Call this function early in your application to ensure
 * numeral.js uses Norwegian formatting by default.
 */
export function initializeLocale(): void {
  numeral.locale('nb');
}
