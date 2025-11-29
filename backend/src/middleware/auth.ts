/**
 * EasyAuth Authentication Middleware
 *
 * Validates Azure EasyAuth headers and extracts user information.
 * Protected routes require valid authentication or return 401 Unauthorized.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * EasyAuth user claims structure from x-ms-client-principal header
 * Header contains Base64-encoded JSON with user information
 */
interface EasyAuthClaims {
  auth_typ?: string;
  claims?: Array<{ typ: string; val: string }>;
  name_typ?: string;
  role_typ?: string;
  userId: string;
  userDetails?: string; // email address
  identityProvider: string;
}

/**
 * Validates authentication via Azure EasyAuth header
 *
 * Extracts user information from x-ms-client-principal header and attaches
 * to req.user for use in controllers.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @returns 401 if authentication missing or invalid, otherwise calls next()
 *
 * @example
 * // Apply to protected routes
 * router.use('/users', validateAuth, userRoutes);
 *
 * // Access user in controller
 * const userId = req.user!.userId;
 */
export function validateAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers['x-ms-client-principal'] as string | undefined;

  // Development bypass - inject mock user if header missing
  if (process.env.NODE_ENV === 'development' && !header) {
    logger.debug('Development mode: Using mock user (no EasyAuth header)');
    req.user = {
      userId: 'dev-user-123',
      email: 'dev@finans.no',
      provider: 'google'
    };
    return next();
  }

  // Production: header is required
  if (!header) {
    logger.warn('Authentication failed: Missing x-ms-client-principal header', {
      path: req.path,
      method: req.method,
      ip: req.ip
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

  // Decode and parse EasyAuth header
  try {
    // Decode Base64 header
    const decoded = Buffer.from(header, 'base64').toString('utf-8');
    const claims: EasyAuthClaims = JSON.parse(decoded);

    // Validate required fields
    if (!claims.userId || !claims.identityProvider) {
      logger.error('Authentication failed: Invalid EasyAuth claims structure', {
        hasUserId: !!claims.userId,
        hasProvider: !!claims.identityProvider,
        path: req.path
      });

      res.status(401).json({
        error: {
          message: 'Invalid authentication token',
          code: 'INVALID_TOKEN'
        },
        success: false
      });
      return;
    }

    // Extract user info and attach to request
    req.user = {
      userId: claims.userId,
      email: claims.userDetails,
      provider: claims.identityProvider as 'google' | 'facebook'
    };

    logger.debug('User authenticated successfully', {
      userId: req.user.userId,
      provider: req.user.provider,
      path: req.path
    });

    next();
  } catch (error) {
    logger.error('Authentication failed: Error decoding x-ms-client-principal', {
      error: error instanceof Error ? error.message : 'Unknown error',
      path: req.path,
      method: req.method
    });

    res.status(401).json({
      error: {
        message: 'Invalid authentication token',
        code: 'INVALID_TOKEN'
      },
      success: false
    });
    return;
  }
}
