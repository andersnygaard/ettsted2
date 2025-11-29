/**
 * Portfolio Document Models
 *
 * Represents monthly portfolio snapshots stored in CosmosDB portfolios container.
 * Partition key: /userId
 */

/**
 * Account within a monthly snapshot
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
  createdAt: Date;

  /**
   * Timestamp when snapshot was last updated
   */
  updatedAt: Date;
}
