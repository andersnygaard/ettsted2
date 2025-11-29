/**
 * Manual testing file for Norwegian localization utilities
 *
 * This file can be imported in a component to manually test the utilities.
 * To use: Import this file in a component and check the console output.
 */

import { formatCurrency, formatNumber, formatPercentage, parseNumber } from './numberFormat';
import { formatDate, parseDate, formatDateLong, getFirstDayOfMonth } from './dateFormat';

// Number formatting tests
console.group('Number Formatting Tests');

console.log('formatCurrency(123456.78):', formatCurrency(123456.78));
// Expected: "123 456,78 kr"

console.log('formatNumber(123456.78):', formatNumber(123456.78));
// Expected: "123 456,78"

console.log('formatNumber(123456.78, 0):', formatNumber(123456.78, 0));
// Expected: "123 457"

console.log('formatNumber(0.5, 1):', formatNumber(0.5, 1));
// Expected: "0,5"

console.log('formatPercentage(0.075):', formatPercentage(0.075));
// Expected: "7,50 %"

console.log('parseNumber("123 456,78"):', parseNumber("123 456,78"));
// Expected: 123456.78

console.log('parseNumber("1 234"):', parseNumber("1 234"));
// Expected: 1234

console.groupEnd();

// Date formatting tests
console.group('Date Formatting Tests');

const testDate = new Date('2024-01-01T12:00:00Z');
console.log('formatDate(2024-01-01):', formatDate(testDate));
// Expected: "01.01.2024"

const today = new Date();
console.log('formatDate(today):', formatDate(today));
// Expected: "29.11.2025" (or current date)

console.log('formatDateLong(2024-01-01):', formatDateLong(testDate));
// Expected: "1. januar 2024"

const parsed = parseDate("15.03.2024");
console.log('parseDate("15.03.2024"):', parsed.toISOString());
// Expected: Date object for 2024-03-15

const firstDay = getFirstDayOfMonth(new Date('2024-01-15'));
console.log('getFirstDayOfMonth(2024-01-15):', formatDate(firstDay));
// Expected: "01.01.2024"

console.groupEnd();

console.log('✅ All manual tests complete. Check console output above.');
