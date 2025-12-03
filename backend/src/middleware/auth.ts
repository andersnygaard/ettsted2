/**
 * Azure EasyAuth Authentication Middleware
 *
 * Uses Azure EasyAuth headers set automatically when a valid token is sent:
 * - x-ms-client-principal-id: User ID from OAuth provider
 * - x-ms-client-principal-name: Email address
 * - x-ms-client-principal-idp: Identity provider (google/facebook)
 *
 * No custom token validation - Azure EasyAuth handles all validation.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Validates authentication via Azure EasyAuth headers
 *
 * Simply checks if x-ms-client-principal-id header exists.
 * Azure EasyAuth sets this header only for valid, authenticated requests.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns 401 if not authenticated, otherwise calls next()
 */
export async function validateAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const principalId = req.headers['x-ms-client-principal-id'] as string | undefined;
  const principalName = req.headers['x-ms-client-principal-name'] as string | undefined;
  const principalIdp = req.headers['x-ms-client-principal-idp'] as string | undefined;

  // Development bypass - inject mock user if no auth headers
  if (process.env.NODE_ENV === 'development' && !principalId) {
    logger.debug('Development mode: Using mock user (no auth headers)');
    req.user = {
      userId: 'dev-user-123',
      email: 'dev@finans.no',
      provider: 'google'
    };
    return next();
  }

  // Check for EasyAuth header
  if (!principalId) {
    logger.warn('Authentication failed: No x-ms-client-principal-id header', {
      path: req.path,
      method: req.method
    });
    res.status(401).json({
      error: {
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      },
      success: false
    });
    return;
  }

  // Extract user from EasyAuth headers
  req.user = {
    userId: principalId,
    email: principalName,
    provider: (principalIdp as 'google' | 'facebook') || 'google'
  };

  logger.debug('User authenticated via EasyAuth', {
    userId: req.user.userId,
    provider: req.user.provider,
    path: req.path
  });

  return next();
}
