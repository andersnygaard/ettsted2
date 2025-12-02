/**
 * Type definitions extending Express Request interface
 * Adds user property populated by EasyAuth middleware
 */

declare namespace Express {
  export interface Request {
    /**
     * User object populated by validateAuth middleware
     * Contains authenticated user information from Azure EasyAuth
     */
    user?: {
      /** Unique user identifier from OAuth provider (e.g., "google|123456789") */
      userId: string;
      /** User email address from OAuth provider */
      email?: string;
      /** OAuth provider used for authentication */
      provider: 'google' | 'facebook' | 'demo';
    };
    /**
     * Flag indicating if this is a demo session
     * Set by checkDemoSession middleware
     */
    isDemo?: boolean;
  }
}
