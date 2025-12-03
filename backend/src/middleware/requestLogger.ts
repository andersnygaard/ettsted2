import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { logContext } from '../utils/loggerContext';
import { randomUUID } from 'crypto';

/**
 * Request logger middleware
 *
 * Logs HTTP requests with method, path, status code, and response time.
 * Uses AsyncLocalStorage to propagate request context (requestId, userId) to all logs within the request.
 *
 * Features:
 * - Generates unique requestId for request tracing
 * - Automatically injects requestId and userId into all logs within request scope
 * - No need to manually pass requestId/userId to logger calls
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Generate unique request ID using Node.js built-in crypto
  const requestId = randomUUID();

  // Attach request ID to request object for use in other middleware/routes (backward compatibility)
  (req as any).requestId = requestId;

  // Extract user ID from EasyAuth header if authenticated
  // Header format: Base64-encoded JSON with { principalId: "...", claims: [...], ...}
  let userId: string | undefined;
  const principal = req.headers['x-ms-client-principal'];
  if (principal) {
    try {
      const decoded = JSON.parse(Buffer.from(principal as string, 'base64').toString());
      userId = decoded.userId || decoded.principalId;
    } catch {
      // Ignore parsing errors
    }
  }

  // Record start time
  const startTime = Date.now();

  // Run all request handling within logContext to propagate context automatically
  logContext.run(
    {
      requestId,
      userId,
      path: req.path,
      method: req.method
    },
    () => {
      // Log request start - requestId/userId automatically included via contextFormat
      logger.debug('Incoming request', {
        query: req.query,
        ip: req.ip,
        userAgent: req.get('user-agent')
      });

      // Listen for response finish event
      res.on('finish', () => {
        const duration = Date.now() - startTime;

        // Log request completion - requestId/userId automatically included via contextFormat
        logger.info('Request completed', {
          statusCode: res.statusCode,
          duration: `${duration}ms`,
          ip: req.ip
        });
      });

      next();
    }
  );
};
