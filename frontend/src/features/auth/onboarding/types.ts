/**
 * Onboarding Wizard Types
 *
 * Types for the multi-step onboarding wizard.
 */

import { LoanDetails } from '../types';

/**
 * Valid account categories
 */
export type Category = 'sparing' | 'gjeld' | 'pensjon';

/**
 * Account entry during onboarding (with temporary ID)
 */
export interface OnboardingAccount {
  /** Temporary ID for UI tracking */
  tempId: string;
  /** Account name */
  name: string;
  /** Account category */
  category: Category;
  /** Current value in NOK (user enters positive, even for gjeld) */
  value: number;
  /** Whether account is active */
  isActive: boolean;
  /** Loan details (required for gjeld accounts) */
  loanDetails?: LoanDetails;
  /** Whether this is a public pension account (Folketrygden) - only for pensjon category */
  isPublicPension?: boolean;
}

/**
 * User profile data collected during onboarding
 */
export interface OnboardingProfile {
  /** Monthly income */
  monthlySalary: number;
  /** Monthly savings amount */
  monthlySavings: number;
  /** Birth year */
  birthYear: number;
  /** Planned retirement age */
  plannedRetirementAge: number;
  /** Optional custom F.I.R.E. target */
  fireNumber?: number;
}

/**
 * User info collected in step 1
 */
export interface OnboardingUserInfo {
  /** Chosen username (3-20 chars, alphanumeric + underscore) */
  nickname: string;
}

/**
 * Wizard step number
 */
export type WizardStep = 1 | 2 | 3 | 4;

/**
 * Complete wizard state
 */
export interface OnboardingState {
  /** Current step (1-4) */
  currentStep: WizardStep;

  /** Step 1: User info */
  userInfo: OnboardingUserInfo;

  /** Step 1: Profile data */
  profile: OnboardingProfile;

  /** Steps 2-4: Accounts by category */
  accounts: {
    sparing: OnboardingAccount[];
    gjeld: OnboardingAccount[];
    pensjon: OnboardingAccount[];
  };

  /** Validation errors by field path */
  errors: Record<string, string>;

  /** Whether form is being submitted */
  isSubmitting: boolean;

  /** Server error message */
  submitError: string | null;
}

/**
 * Wizard state actions
 */
export type OnboardingAction =
  | { type: 'SET_STEP'; step: WizardStep }
  | { type: 'UPDATE_USER_INFO'; payload: Partial<OnboardingUserInfo> }
  | { type: 'UPDATE_PROFILE'; payload: Partial<OnboardingProfile> }
  | { type: 'ADD_ACCOUNT'; category: Category }
  | { type: 'UPDATE_ACCOUNT'; category: Category; tempId: string; updates: Partial<OnboardingAccount> }
  | { type: 'REMOVE_ACCOUNT'; category: Category; tempId: string }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_SUBMITTING'; value: boolean }
  | { type: 'SET_SUBMIT_ERROR'; error: string | null }
  | { type: 'RESET' };

/**
 * API request body for onboarding endpoint
 * Used for both POST /users/me/onboarding and PATCH /users/me
 */
export interface OnboardingRequestBody {
  nickname: string;
  profile: {
    monthlySalary: number;
    monthlySavings: number;
    birthYear: number;
    plannedRetirementAge: number;
    fireNumber?: number;
  };
  accounts: Array<{
    id?: string | undefined;
    name: string;
    category: Category;
    value: number;
    isActive: boolean;
    loanDetails?: LoanDetails;
    isPublicPension?: boolean;
  }>;
}

/**
 * API response from onboarding endpoint
 */
export interface OnboardingResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      nickname: string;
      email: string;
      profile: OnboardingProfile;
      accounts: Array<{
        id: string;
        name: string;
        category: Category;
        isActive: boolean;
        sortOrder: number;
        createdAt: string;
        loanDetails?: LoanDetails;
        isPublicPension?: boolean;
      }>;
    };
    snapshot: {
      id: string;
      userId: string;
      date: string;
      totalNetWorth: number;
      accounts: Array<{
        id: string;
        name: string;
        assetClass: string;
        value: number;
      }>;
    };
  };
  error?: {
    message: string;
    code: string;
    details?: Array<{ field: string; message: string }>;
  };
}
