import rateLimit from 'express-rate-limit';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

/**
 * Rate limiter middleware configurations
 *
 * Protects API endpoints from abuse by limiting the number of requests
 * per IP address within a time window.
 */

/**
 * General rate limiter for all API endpoints
 * Default: 100 requests per minute per IP
 */
export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: config.rateLimitGeneral, // configurable via env var
  message: {
    error: {
      message: 'Too many requests from this IP, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    success: false
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      limit: config.rateLimitGeneral
    });

    res.status(429).json({
      error: {
        message: 'Too many requests from this IP, please try again later',
        code: 'RATE_LIMIT_EXCEEDED'
      },
      success: false
    });
  }
});

/**
 * Calculator rate limiter for expensive computational endpoints
 * Default: 10 requests per minute per user
 *
 * Uses user-based key (from authenticated request) to rate limit per-user.
 * Falls back to IP-based limiting if user not authenticated (should not happen
 * since calculator routes now require authentication).
 */
export const calculatorRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: config.rateLimitCalculator,
  keyGenerator: (req) => req.user?.userId || req.ip || 'unknown',
  message: {
    error: {
      message: 'Calculator endpoint rate limit exceeded, please try again later',
      code: 'CALCULATOR_RATE_LIMIT_EXCEEDED'
    },
    success: false
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Calculator rate limit exceeded', {
      userId: req.user?.userId,
      ip: req.ip,
      path: req.path,
      limit: config.rateLimitCalculator
    });

    res.status(429).json({
      error: {
        message: 'Calculator endpoint rate limit exceeded, please try again later',
        code: 'CALCULATOR_RATE_LIMIT_EXCEEDED'
      },
      success: false
    });
  }
});

/**
 * LLM rate limiter for AI-powered data import endpoints
 * Default: 20 requests per minute per IP
 */
export const llmRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: config.rateLimitLLM,
  message: {
    error: {
      message: 'LLM endpoint rate limit exceeded, please try again later',
      code: 'LLM_RATE_LIMIT_EXCEEDED'
    },
    success: false
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('LLM rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      limit: config.rateLimitLLM
    });

    res.status(429).json({
      error: {
        message: 'LLM endpoint rate limit exceeded, please try again later',
        code: 'LLM_RATE_LIMIT_EXCEEDED'
      },
      success: false
    });
  }
});

/**
 * Demo login rate limiter for public demo endpoint
 * Aggressive: 5 requests per 15 minutes per IP
 * Prevents abuse of demo account seeding which seeds to database
 */
export const demoLoginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: {
      message: 'For mange demo-forespørsler. Prøv igjen senere.',
      code: 'DEMO_LOGIN_RATE_LIMIT_EXCEEDED'
    },
    success: false
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Demo login rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      limit: 5
    });

    res.status(429).json({
      error: {
        message: 'For mange demo-forespørsler. Prøv igjen senere.',
        code: 'DEMO_LOGIN_RATE_LIMIT_EXCEEDED'
      },
      success: false
    });
  }
});
