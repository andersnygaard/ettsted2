/**
 * Type definitions extending Express Request interface
 * Adds user property populated by EasyAuth middleware
 */

import 'express';

declare global {
  namespace Express {
    interface Request {
      /**
       * User object populated by validateAuth middleware
       * Contains authenticated user information from JWT or Azure EasyAuth headers
       */
      user?: {
        /** Unique user identifier (sub claim from JWT) */
        userId: string;
        /** User email address */
        email?: string;
        /** User display name */
        name?: string;
        /** Authentication provider (OAuth or demo) */
        provider: 'google' | 'facebook' | 'demo' | 'unknown';
      };
    }
  }
}

export {};
