/**
 * Portfolio and Snapshot Types
 *
 * Mirrors backend types for type safety across the frontend
 */

/**
 * Account within a monthly snapshot (denormalized - full account data embedded)
 */
export interface Account {
  /**
   * Unique account identifier within the snapshot
   */
  id: string;

  /**
   * User-defined account name (e.g., "Nordnet ASK", "Bouvet ASK")
   */
  name: string;

  /**
   * Asset class type
   * Predefined: "aksjer", "fond", "krypto", "bankkonto"
   * Or custom user-defined string
   */
  assetClass: string;

  /**
   * Total account value in NOK (kroner)
   * Stored as decimal with 2 decimal places precision
   */
  value: number;

  /**
   * Optional notes about the account
   */
  notes?: string;

  /**
   * Whether this is a public pension account (Folketrygden)
   * Only relevant for pensjon accounts
   */
  isPublicPension?: boolean;
}

/**
 * Monthly portfolio snapshot
 */
export interface MonthlySnapshot {
  /**
   * Unique snapshot identifier
   */
  id: string;

  /**
   * User who owns this snapshot
   * Partition key for efficient queries
   */
  userId: string;

  /**
   * Snapshot date in dd.MM.yyyy format (e.g., "01.01.2024")
   * Typically the 1st of the month
   */
  date: string;

  /**
   * Array of accounts in this snapshot
   */
  accounts: Account[];

  /**
   * Calculated total net worth (sum of all account values)
   * Should match sum(accounts[].value)
   */
  totalNetWorth: number;

  /**
   * Timestamp when snapshot was created
   */
  createdAt: string;

  /**
   * Timestamp when snapshot was last updated
   */
  updatedAt: string;
}

/**
 * Asset class categories for aggregation
 */
export type AssetCategory = 'sparing' | 'gjeld' | 'pensjon';

/**
 * Mapping of categories to asset class strings
 */
export const ASSET_CLASS_CATEGORIES: Record<AssetCategory, string[]> = {
  sparing: ['aksjer', 'fond', 'krypto', 'bankkonto'],
  gjeld: ['gjeld', 'lån', 'loan', 'debt'],
  pensjon: ['pensjon', 'pension']
};

/**
 * Determine which category an account belongs to based on assetClass
 */
export function getAccountCategory(assetClass: string): AssetCategory {
  const classLower = assetClass.toLowerCase();

  if (ASSET_CLASS_CATEGORIES.gjeld.includes(classLower)) return 'gjeld';
  if (ASSET_CLASS_CATEGORIES.pensjon.includes(classLower)) return 'pensjon';
  return 'sparing'; // Default
}
