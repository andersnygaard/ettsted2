/**
 * Account Model and Defaults
 *
 * Provides AccountConfig and LoanDetails types with default accounts
 * for new user onboarding
 */

import type { AccountConfig, LoanDetails } from './User';

// Re-export types for convenience
export type { AccountConfig, LoanDetails };
export type { Category } from './User';

/**
 * Default accounts created during user signup
 * These provide a starting template for new users
 *
 * @remarks
 * - Each category includes 2 default accounts
 * - Omits 'id' and 'createdAt' which are added during signup
 * - sortOrder determines display order within category
 */
export const DEFAULT_ACCOUNTS: Omit<AccountConfig, 'id' | 'createdAt'>[] = [
  // Sparing (Savings & Investments)
  { name: 'Bank', category: 'sparing', isActive: true, sortOrder: 0 },
  { name: 'Fond', category: 'sparing', isActive: true, sortOrder: 1 },

  // Gjeld (Debt)
  { name: 'Huslån', category: 'gjeld', isActive: true, sortOrder: 0 },
  { name: 'Studielån', category: 'gjeld', isActive: true, sortOrder: 1 },

  // Pensjon (Pension)
  { name: 'Arbeidsgiver', category: 'pensjon', isActive: true, sortOrder: 0 },
  { name: 'Folketrygden', category: 'pensjon', isActive: true, sortOrder: 1 },
];
