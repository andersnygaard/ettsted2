/**
 * EasyAuth Authentication Middleware
 *
 * Validates Azure EasyAuth headers and extracts user information.
 * Protected routes require valid authentication or return 401 Unauthorized.
 *
 * Supports two authentication methods:
 * 1. Authorization: Bearer <token> - OAuth access_token validated against provider
 * 2. X-MS-CLIENT-PRINCIPAL - Base64-encoded user claims (backward compat)
 */

import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
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
 * Google tokeninfo response for id_token validation
 * When validating id_token, Google returns the JWT claims
 */
interface GoogleTokenInfo {
  // Standard JWT claims
  iss: string;           // Issuer (https://accounts.google.com)
  sub: string;           // Subject (Google user ID)
  aud: string;           // Audience (your client ID)
  exp: string;           // Expiration timestamp
  iat: string;           // Issued at timestamp
  // User claims
  email: string;
  email_verified: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  // Error field (only if invalid)
  error_description?: string;
}

/**
 * Facebook user response
 */
interface FacebookUserInfo {
  id: string;
  email?: string;
  error?: { message: string };
}

/**
 * Cache for validated tokens to reduce OAuth provider calls
 */
const tokenCache = new Map<string, { user: Express.User; expiry: number }>();
const TOKEN_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Validates Google OAuth id_token (JWT)
 * Uses Google's tokeninfo endpoint to validate the JWT signature and claims
 */
async function validateGoogleToken(token: string): Promise<Express.User | null> {
  try {
    // Google's tokeninfo endpoint validates id_tokens
    // Use id_token param for JWT tokens (not access_token)
    logger.info('Calling Google tokeninfo API...');
    const response = await axios.get<GoogleTokenInfo>(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`,
      { timeout: 5000 }
    );

    if (response.data.error_description) {
      logger.warn('Google id_token validation failed', { error: response.data.error_description });
      return null;
    }

    if (!response.data.email || !response.data.sub) {
      logger.warn('Google id_token missing required fields', {
        hasEmail: !!response.data.email,
        hasSub: !!response.data.sub
      });
      return null;
    }

    // Verify issuer is Google
    if (response.data.iss !== 'https://accounts.google.com') {
      logger.warn('Google id_token has invalid issuer', { iss: response.data.iss });
      return null;
    }

    logger.info('Google token validated successfully', { sub: response.data.sub });
    return {
      userId: response.data.sub,
      email: response.data.email,
      provider: 'google'
    };
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number; data?: unknown } };
    logger.warn('Google id_token validation error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: axiosError.response?.status,
      data: axiosError.response?.data
    });
    return null;
  }
}

/**
 * Validates Facebook OAuth access_token
 */
async function validateFacebookToken(token: string): Promise<Express.User | null> {
  try {
    const response = await axios.get<FacebookUserInfo>(
      `https://graph.facebook.com/me?access_token=${encodeURIComponent(token)}&fields=id,email`,
      { timeout: 5000 }
    );

    if (response.data.error) {
      logger.debug('Facebook token validation failed', { error: response.data.error.message });
      return null;
    }

    if (!response.data.id) {
      logger.debug('Facebook token missing required fields');
      return null;
    }

    return {
      userId: response.data.id,
      email: response.data.email,
      provider: 'facebook'
    };
  } catch (error) {
    logger.debug('Facebook token validation error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return null;
  }
}

/**
 * Validates Bearer token (id_token JWT) against OAuth providers
 * Tries Google first (JWT id_token), then Facebook (access_token)
 */
async function validateBearerToken(token: string): Promise<Express.User | null> {
  // Check cache first
  const cached = tokenCache.get(token);
  if (cached && cached.expiry > Date.now()) {
    logger.debug('Using cached token validation');
    return cached.user;
  }

  // Try Google first - expects id_token (JWT starting with eyJ)
  if (token.startsWith('eyJ')) {
    const user = await validateGoogleToken(token);
    if (user) {
      tokenCache.set(token, { user, expiry: Date.now() + TOKEN_CACHE_TTL });
      return user;
    }
  }

  // Try Facebook - uses access_token directly
  const user = await validateFacebookToken(token);
  if (user) {
    tokenCache.set(token, { user, expiry: Date.now() + TOKEN_CACHE_TTL });
    return user;
  }

  return null;
}

/**
 * Validates authentication via Bearer token or EasyAuth header
 *
 * Priority:
 * 1. Authorization: Bearer <token> - validated against OAuth provider
 * 2. X-MS-CLIENT-PRINCIPAL - decoded and validated locally
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
export async function validateAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'] as string | undefined;
  const principalHeader = req.headers['x-ms-client-principal'] as string | undefined;

  // Log received auth headers for debugging
  logger.info('Auth headers received', {
    path: req.path,
    hasBearer: !!authHeader?.startsWith('Bearer '),
    hasPrincipal: !!principalHeader,
    bearerPrefix: authHeader ? authHeader.substring(0, 30) + '...' : 'none'
  });

  // Development bypass - inject mock user if no auth headers
  if (process.env.NODE_ENV === 'development' && !authHeader && !principalHeader) {
    logger.debug('Development mode: Using mock user (no auth headers)');
    req.user = {
      userId: 'dev-user-123',
      email: 'dev@finans.no',
      provider: 'google'
    };
    return next();
  }

  // Try Bearer token first (preferred method)
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);

    if (!token) {
      logger.warn('Authentication failed: Empty Bearer token', {
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

    logger.info('Validating Bearer token against OAuth provider...');
    const user = await validateBearerToken(token);
    if (user) {
      req.user = user;
      logger.info('User authenticated via Bearer token', {
        userId: user.userId,
        provider: user.provider,
        path: req.path
      });
      return next();
    }

    // Bearer token was provided but invalid - log details
    logger.warn('Authentication failed: Bearer token validation failed', {
      path: req.path,
      method: req.method,
      tokenIsJWT: token.startsWith('eyJ'),
      tokenLength: token.length
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

  // Fall back to X-MS-CLIENT-PRINCIPAL (backward compatibility)
  if (principalHeader) {
    try {
      const decoded = Buffer.from(principalHeader, 'base64').toString('utf-8');
      const claims: EasyAuthClaims = JSON.parse(decoded);

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

      req.user = {
        userId: claims.userId,
        email: claims.userDetails,
        provider: claims.identityProvider as 'google' | 'facebook'
      };

      logger.debug('User authenticated via X-MS-CLIENT-PRINCIPAL', {
        userId: req.user.userId,
        provider: req.user.provider,
        path: req.path
      });

      return next();
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

  // No authentication provided
  logger.warn('Authentication failed: No authentication provided', {
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
}
