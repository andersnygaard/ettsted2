/**
 * Demo Token Utilities
 *
 * Shared utilities for creating and verifying demo JWT tokens.
 * Demo tokens use HMAC-SHA256 for signing.
 */

import crypto from 'crypto';
import { logger } from './logger';

const DEMO_SECRET = process.env.DEMO_JWT_SECRET || 'demo-secret-key-for-development';

export interface DemoTokenPayload {
  sub: string;
  email?: string;
  name?: string;
  iss?: string;
  exp?: number;
  iat?: number;
}

/**
 * Verify demo token signature and expiration.
 * Returns the decoded payload if valid, null otherwise.
 */
export function verifyDemoToken(token: string): DemoTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signature] = parts;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', DEMO_SECRET)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      logger.debug('Demo token signature mismatch');
      return null;
    }

    // Decode and parse payload
    const payload: DemoTokenPayload = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf-8')
    );

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      logger.debug('Demo token expired');
      return null;
    }

    // Check issuer (must be finans-demo)
    if (payload.iss && payload.iss !== 'finans-demo') {
      logger.debug('Demo token has wrong issuer');
      return null;
    }

    return payload;
  } catch (error) {
    logger.error('Failed to verify demo token', { error });
    return null;
  }
}
