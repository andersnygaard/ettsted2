import rateLimit from 'express-rate-limit';
import { config } from '../config/environment';
import { logger } from '../utils/logger';

/**
 * Simple rate limiter - 1000 requests per hour
 * Only active in production environment
 */
const isProduction = config.nodeEnv === 'production';

export const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  skip: () => !isProduction,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', { ip: req.ip, path: req.path });
    res.status(429).json({
      error: { message: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED' },
      success: false
    });
  }
});
