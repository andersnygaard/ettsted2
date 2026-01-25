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
 * Client principal structure sent by frontend
 * (extracted from /.auth/me response)
 */
interface ClientPrincipal {
  userId: string;
  userDetails?: string;
  identityProvider?: string;
  userRoles?: string[];
}

/**
 * Decode x-ms-client-principal header (base64-encoded JSON).
 * Frontend builds this from /.auth/me data for Facebook (which lacks id_token).
 */
function decodeClientPrincipal(encoded: string): ClientPrincipal | null {
  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    const principal = JSON.parse(decoded);
    if (principal.userId) {
      return principal;
    }
    return null;
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
 *
 * For local development, use demo token via /auth/demo-login endpoint
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

  // Try x-ms-client-principal header (base64-encoded JSON from frontend)
  // This is used for Facebook auth where id_token is not available
  const clientPrincipalHeader = req.headers['x-ms-client-principal'] as string | undefined;

  if (clientPrincipalHeader) {
    const principal = decodeClientPrincipal(clientPrincipalHeader);

    if (principal?.userId) {
      req.user = {
        userId: principal.userId,
        email: principal.userDetails,
        provider: (principal.identityProvider as 'google' | 'facebook') || 'unknown'
      };

      logger.debug('User authenticated via x-ms-client-principal header', {
        userId: req.user.userId,
        provider: req.user.provider,
        path: req.path
      });

      return next();
    }
  }

  // Fallback to individual EasyAuth headers (set by Azure App Service proxy)
  const principalId = req.headers['x-ms-client-principal-id'] as string | undefined;
  const principalName = req.headers['x-ms-client-principal-name'] as string | undefined;
  const principalIdp = req.headers['x-ms-client-principal-idp'] as string | undefined;

  if (principalId) {
    req.user = {
      userId: principalId,
      email: principalName,
      provider: (principalIdp as 'google' | 'facebook') || 'unknown'
    };

    logger.debug('User authenticated via EasyAuth individual headers', {
      userId: req.user.userId,
      provider: req.user.provider,
      path: req.path
    });

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
