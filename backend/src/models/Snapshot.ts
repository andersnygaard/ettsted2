/**
 * Monthly Snapshot Models
 *
 * Represents monthly account balance snapshots stored in CosmosDB snapshots container.
 * Partition key: /userId
 *
 * Snapshots capture the state of all accounts at a specific point in time (typically
 * the first day of each month). Account balances reference accounts by ID from the User document.
 */

/**
 * Account balance in a monthly snapshot
 *
 * Embedded in MonthlySnapshot.balances array
 */
export interface AccountBalance {
  /**
   * Foreign key to AccountConfig.id in User document
   */
  accountId: string;

  /**
   * Account balance value in Norwegian Kroner (NOK)
   */
  balance: number;
}

/**
 * Monthly snapshot of account balances
 *
 * Stored in CosmosDB 'snapshots' container with partition key '/userId'
 * Each snapshot captures a point-in-time view of all account balances
 */
export interface MonthlySnapshot {
  /**
   * Unique snapshot identifier
   */
  id: string;

  /**
   * User identifier (partition key)
   * Links to User.id
   */
  userId: string;

  /**
   * Snapshot date in UTC (typically first day of month)
   * Used for chronological ordering and reporting
   */
  date: Date;

  /**
   * Timestamp when snapshot was created
   */
  createdAt: Date;

  /**
   * Timestamp when snapshot was last updated
   * Updated when user edits snapshot balances
   */
  updatedAt: Date;

  /**
   * Array of account balances for this snapshot
   *
   * Each balance references an account by ID from User.accounts
   * Balance array contains only accounts that had values in this snapshot
   */
  balances: AccountBalance[];
}
