/**
 * Default Accounts for Onboarding
 *
 * Pre-populated accounts that users can customize during onboarding.
 * User can edit names, delete accounts (except last in category), and add new ones.
 */

import { OnboardingAccount, Category } from './types';

/**
 * Generate a temporary ID for account tracking in UI
 */
export function generateTempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a default account with a temp ID
 */
function createDefaultAccount(
  name: string,
  category: Category,
  isActive: boolean = true,
  loanDetails?: { interestRate: number; remainingYears: number }
): OnboardingAccount {
  return {
    tempId: generateTempId(),
    name,
    category,
    value: 0,
    isActive,
    ...(loanDetails ? { loanDetails } : {})
  };
}

/**
 * Default sparing (savings) accounts
 */
export const DEFAULT_SPARING_ACCOUNTS: OnboardingAccount[] = [
  createDefaultAccount('Aksjer', 'sparing', true),
  createDefaultAccount('Fond', 'sparing', true),
  createDefaultAccount('Bankkonto', 'sparing', true),
  createDefaultAccount('Krypto', 'sparing', false),
];

/**
 * Default gjeld (debt) accounts
 */
export const DEFAULT_GJELD_ACCOUNTS: OnboardingAccount[] = [
  createDefaultAccount('Boliglån', 'gjeld', true, { interestRate: 5.5, remainingYears: 25 }),
  createDefaultAccount('Studielån', 'gjeld', true, { interestRate: 5.5, remainingYears: 15 }),
];

/**
 * Default pensjon (pension) accounts
 */
export const DEFAULT_PENSJON_ACCOUNTS: OnboardingAccount[] = [
  createDefaultAccount('Arbeidsgiver (OTP)', 'pensjon', true),
  createDefaultAccount('Folketrygden (NAV)', 'pensjon', true),
  createDefaultAccount('IPS', 'pensjon', false),
];

/**
 * Get all default accounts grouped by category
 */
export function getDefaultAccounts(): {
  sparing: OnboardingAccount[];
  gjeld: OnboardingAccount[];
  pensjon: OnboardingAccount[];
} {
  // Create fresh copies with new temp IDs each time
  return {
    sparing: [
      createDefaultAccount('Aksjer', 'sparing', true),
      createDefaultAccount('Fond', 'sparing', true),
      createDefaultAccount('Bankkonto', 'sparing', true),
      createDefaultAccount('Krypto', 'sparing', false),
    ],
    gjeld: [
      createDefaultAccount('Boliglån', 'gjeld', true, { interestRate: 5.5, remainingYears: 25 }),
      createDefaultAccount('Studielån', 'gjeld', true, { interestRate: 5.5, remainingYears: 15 }),
    ],
    pensjon: [
      createDefaultAccount('Arbeidsgiver (OTP)', 'pensjon', true),
      createDefaultAccount('Folketrygden (NAV)', 'pensjon', true),
      createDefaultAccount('IPS', 'pensjon', false),
    ],
  };
}

/**
 * Create a new empty account for a category
 */
export function createNewAccount(category: Category): OnboardingAccount {
  const baseName = category === 'sparing' ? 'Ny konto' : category === 'gjeld' ? 'Nytt lån' : 'Ny pensjon';
  return createDefaultAccount(
    baseName,
    category,
    true,
    category === 'gjeld' ? { interestRate: 5.5, remainingYears: 20 } : undefined
  );
}

/**
 * Get initial profile values with reasonable defaults
 */
export function getDefaultProfile() {
  const currentYear = new Date().getFullYear();
  return {
    monthlySalary: 0,
    annualExpenses: 0,
    birthYear: currentYear - 30,
    plannedRetirementAge: 67,
    fireNumber: undefined,
  };
}

/**
 * Get initial user info
 */
export function getDefaultUserInfo() {
  return {
    nickname: '',
  };
}
