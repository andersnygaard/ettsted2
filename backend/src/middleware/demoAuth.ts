/**
 * Demo Authentication Middleware
 *
 * Checks for demo user cookie and injects demo user into request.
 * Must be applied BEFORE validateAuth middleware.
 */

import { Request, Response, NextFunction } from 'express';
import { DEMO_USER_ID } from '../services/demoService';
import { logger } from '../utils/logger';

export const DEMO_COOKIE_NAME = 'finans-demo-session';

/**
 * Middleware that checks for demo session cookie.
 * If present, injects demo user into request and skips EasyAuth validation.
 *
 * @example
 * // Apply before validateAuth
 * router.use(checkDemoSession);
 * router.use(validateAuth);
 */
export function checkDemoSession(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const demoCookie = req.cookies?.[DEMO_COOKIE_NAME];

  if (demoCookie === 'true') {
    logger.debug('Demo session detected, injecting demo user', {
      path: req.path,
      method: req.method,
    });

    req.user = {
      userId: DEMO_USER_ID,
      email: 'demo@finans.no',
      provider: 'demo',
    };

    // Mark request as demo for other middleware/controllers
    req.isDemo = true;
  }

  next();
}

/**
 * Middleware that skips validateAuth if demo user is already set.
 * Wrap validateAuth with this to allow demo sessions through.
 */
export function validateAuthWithDemo(
  validateAuth: (req: Request, res: Response, next: NextFunction) => void
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // If demo user already set, skip auth validation
    if (req.isDemo && req.user) {
      return next();
    }

    // Otherwise, run normal auth validation
    validateAuth(req, res, next);
  };
}
