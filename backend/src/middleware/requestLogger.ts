import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { randomUUID } from 'crypto';

/**
 * Request logger middleware
 *
 * Logs HTTP requests with method, path, status code, and response time.
 * Adds a unique request ID to each request for tracing.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Generate unique request ID using Node.js built-in crypto
  const requestId = randomUUID();

  // Attach request ID to request object for use in other middleware/routes
  (req as any).requestId = requestId;

  // Record start time
  const startTime = Date.now();

  // Log request start
  logger.debug('Incoming request', {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Listen for response finish event
  res.on('finish', () => {
    const duration = Date.now() - startTime;

    // Log request completion
    logger.info('Request completed', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });

  next();
};
