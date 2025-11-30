/**
 * User and Account Models
 *
 * Represents user profiles stored in CosmosDB users container.
 * Partition key: /id (userId from EasyAuth)
 */

/**
 * Asset category for account classification
 */
export type Category = 'sparing' | 'gjeld' | 'pensjon';

/**
 * User profile with financial planning settings
 *
 * Embedded in User document
 */
export interface UserProfile {
  /**
   * Monthly income used for savings rate calculations
   */
  monthlySalary: number;

  /**
   * Annual expenses used for F.I.R.E. calculations
   */
  annualExpenses: number;

  /**
   * Birth year for pension projections
   */
  birthYear: number;

  /**
   * Target retirement age for planning
   */
  plannedRetirementAge: number;

  /**
   * Optional custom F.I.R.E. target (defaults to 25x annual expenses if not provided)
   */
  fireNumber?: number;
}

/**
 * Loan details for debt accounts
 *
 * Only present on AccountConfig with category 'gjeld'
 */
export interface LoanDetails {
  /**
   * Annual interest rate as percentage (e.g., 2.5)
   */
  interestRate: number;

  /**
   * Years remaining on the loan
   */
  remainingYears: number;

  /**
   * Optional original loan amount for reference
   */
  originalAmount?: number;
}

/**
 * Account configuration (stored in User document)
 *
 * Represents a user's account (investment account, loan, pension, etc.)
 * Balances are stored separately in snapshots container
 */
export interface AccountConfig {
  /**
   * Unique account identifier
   */
  id: string;

  /**
   * User-defined account name (e.g., "Nordnet ASK", "Huslån")
   */
  name: string;

  /**
   * Account category for grouping
   */
  category: Category;

  /**
   * Whether account is active and visible in UI
   */
  isActive: boolean;

  /**
   * Display order within category (lower numbers appear first)
   */
  sortOrder: number;

  /**
   * Timestamp when account was created
   */
  createdAt: Date;

  /**
   * Optional loan details (only for gjeld accounts)
   */
  loanDetails?: LoanDetails;
}

/**
 * User entity with embedded profile and accounts
 *
 * Stored in CosmosDB 'users' container with partition key '/id'
 * All user data is co-located in the same document for efficient queries
 */
export interface User {
  /**
   * Unique user identifier (from EasyAuth token)
   * Also used as partition key
   */
  id: string;

  /**
   * Display name chosen by user during onboarding
   */
  nickname: string;

  /**
   * User email address
   */
  email: string;

  /**
   * Timestamp when user was created
   */
  createdAt: Date;

  /**
   * Timestamp when user was last updated
   */
  updatedAt: Date;

  /**
   * User's financial planning profile (embedded)
   */
  profile: UserProfile;

  /**
   * User's account configurations (embedded)
   *
   * Account balances are stored separately in snapshots container,
   * referencing accounts by id
   */
  accounts: AccountConfig[];
}
