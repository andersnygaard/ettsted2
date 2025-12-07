/**
 * Azure EasyAuth Authentication Middleware
 *
 * Primary: Decode JWT from Authorization header (Bearer token)
 * Fallback: Azure EasyAuth headers (x-ms-client-principal-*)
 *
 * Azure EasyAuth validates the token BEFORE it reaches our code.
 * We only decode the payload - no signature validation needed.
 *
 * Demo tokens (iss: finans-demo) are validated with HMAC signature.
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { verifyDemoToken } from '../utils/tokenUtils';

interface JwtPayload {
  sub: string;
  email?: string;
  name?: string;
  iss?: string;
  exp?: number;
}

/**
 * Decode JWT payload without validation.
 * Azure EasyAuth has already validated the token.
 */
function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = Buffer.from(parts[1], 'base64').toString('utf-8');
    return JSON.parse(payload);
  } catch {
    return null;
  }
}


/**
 * Determine provider from JWT issuer
 */
function getProviderFromIssuer(iss?: string): 'google' | 'facebook' | 'demo' | 'unknown' {
  if (!iss) return 'unknown';
  if (iss === 'finans-demo') return 'demo';
  if (iss.includes('google')) return 'google';
  if (iss.includes('facebook')) return 'facebook';
  return 'unknown';
}

/**
 * Validates authentication via JWT token or Azure EasyAuth headers
 *
 * Priority:
 * 1. JWT from Authorization header (Bearer token)
 * 2. Azure EasyAuth headers (x-ms-client-principal-*)
 * 3. Development mock user (NODE_ENV=development only)
 */
export async function validateAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Try JWT from Authorization header first
  const authHeader = req.headers['authorization'] as string | undefined;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);

    // First decode to check the issuer
    const decodedPayload = decodeJwtPayload(token);

    if (decodedPayload?.iss === 'finans-demo') {
      // Demo token: verify signature
      const verifiedPayload = verifyDemoToken(token);

      if (verifiedPayload?.sub) {
        req.user = {
          userId: verifiedPayload.sub,
          email: verifiedPayload.email,
          name: verifiedPayload.name,
          provider: 'demo'
        };

        logger.debug('User authenticated via demo token', {
          userId: req.user.userId,
          provider: req.user.provider,
          path: req.path
        });

        return next();
      }
    } else if (decodedPayload?.sub) {
      // OAuth token: trust EasyAuth validation
      req.user = {
        userId: decodedPayload.sub,
        email: decodedPayload.email,
        name: decodedPayload.name,
        provider: getProviderFromIssuer(decodedPayload.iss)
      };

      logger.debug('User authenticated via JWT', {
        userId: req.user.userId,
        provider: req.user.provider,
        path: req.path
      });

      return next();
    }
  }

  // Fallback to EasyAuth headers
  const principalId = req.headers['x-ms-client-principal-id'] as string | undefined;
  const principalName = req.headers['x-ms-client-principal-name'] as string | undefined;
  const principalIdp = req.headers['x-ms-client-principal-idp'] as string | undefined;

  if (principalId) {
    req.user = {
      userId: principalId,
      email: principalName,
      provider: (principalIdp as 'google' | 'facebook') || 'unknown'
    };

    logger.debug('User authenticated via EasyAuth headers', {
      userId: req.user.userId,
      provider: req.user.provider,
      path: req.path
    });

    return next();
  }

  // Development bypass - inject mock user if no auth
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Development mode: Using mock user');
    req.user = {
      userId: 'dev-user-123',
      email: 'dev@finans.no',
      name: 'Dev User',
      provider: 'google'
    };
    return next();
  }

  // No authentication found
  logger.warn('Authentication failed: No valid token or headers', {
    path: req.path,
    method: req.method,
    hasAuthHeader: !!authHeader
  });

  res.status(401).json({
    error: {
      message: 'Authentication required',
      code: 'UNAUTHORIZED'
    },
    success: false
  });
}
