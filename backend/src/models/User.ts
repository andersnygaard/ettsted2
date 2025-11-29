/**
 * User Document Model
 *
 * Represents a user profile stored in CosmosDB users container.
 * Partition key: /id (userId from EasyAuth)
 */

export interface User {
  /**
   * Unique user identifier (from EasyAuth token)
   * Also used as partition key
   */
  id: string;

  /**
   * Unique username chosen by user during onboarding
   * Enforced via query (not unique constraint)
   */
  username: string;

  /**
   * Optional email address
   * User can toggle visibility during onboarding
   */
  email?: string;

  /**
   * Timestamp when user was created
   */
  createdAt: Date;

  /**
   * User preferences (future: theme, locale, etc.)
   */
  preferences?: {
    // Future expansion for user settings
    [key: string]: unknown;
  };
}
