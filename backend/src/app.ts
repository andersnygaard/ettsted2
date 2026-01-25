/**
 * Express Application Factory
 *
 * Creates and configures the Express application without starting the server.
 * This separation allows for testing with supertest without port conflicts.
 */

import './types/express';
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { rateLimiter } from './middleware/rateLimiter';
import routes from './routes';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
  const app = express();

  // Trust proxy - required for rate limiting to work correctly behind Azure proxy
  app.set('trust proxy', true);

  // Build CSP connectSrc directive with allowed origins
  const connectSrc = ["'self'", ...config.allowedOrigins];

  // Security middleware (Helmet - sets various HTTP headers)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc,
        },
      },
    })
  );

  // CORS middleware - required because frontend and backend are different origins
  // (finans.ettsted.no vs finans-backend.azurewebsites.net)
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow no-origin requests in development/test (for supertest, Postman, curl, etc.)
        if ((config.nodeEnv === 'development' || config.nodeEnv === 'test') && !origin) {
          return callback(null, true);
        }

        // Reject no-origin requests in production
        if (!origin) {
          logger.warn('CORS blocked request without Origin header');
          return callback(new Error('CORS: Origin header required'));
        }

        // Check if origin is in allowed list
        if (config.allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          logger.warn('CORS blocked request from origin', { origin });
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-MS-CLIENT-PRINCIPAL',
        'X-MS-CLIENT-PRINCIPAL-ID',
        'X-MS-CLIENT-PRINCIPAL-NAME',
        'X-MS-CLIENT-PRINCIPAL-IDP',
      ],
    })
  );

  // Body parser middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie parser middleware
  app.use(cookieParser());

  // Request logging middleware
  app.use(requestLogger);

  // Rate limiting middleware (general)
  app.use(rateLimiter);

  // Mount API routes under /api/v1
  app.use('/api/v1', routes);

  // Error handling middleware (must be last!)
  app.use(errorHandler);

  return app;
}
