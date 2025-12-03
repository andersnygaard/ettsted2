import './types/express';
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from 'http';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { generalRateLimiter } from './middleware/rateLimiter';
import { initializeDatabase } from './config/cosmosdb';
import routes from './routes';

/**
 * Create and configure Express application
 */
function createApp(): Application {
  const app = express();

  // Security middleware (Helmet - sets various HTTP headers)
  app.use(helmet());

  // CORS middleware - only in development (production uses Azure EasyAuth same-origin)
  if (config.nodeEnv === 'development') {
    app.use(cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
          return callback(null, true);
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
        'X-MS-CLIENT-PRINCIPAL-IDP'
      ],
    }));
  }

  // Body parser middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie parser middleware
  app.use(cookieParser());

  // Request logging middleware
  app.use(requestLogger);

  // Rate limiting middleware (general)
  app.use(generalRateLimiter);

  // Mount API routes under /api/v1
  app.use('/api/v1', routes);

  // Error handling middleware (must be last!)
  app.use(errorHandler);

  return app;
}

/**
 * Graceful shutdown handler
 */
function gracefulShutdown(server: Server): void {
  logger.info('Received shutdown signal, starting graceful shutdown...');

  // Stop accepting new connections
  server.close(() => {
    logger.info('Server closed, all connections finished');

    // Close database connections (future)
    // await cosmosClient.dispose();

    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Graceful shutdown timeout, forcing shutdown');
    process.exit(1);
  }, 10000);
}

/**
 * Start the Express server
 */
async function startServer(): Promise<void> {
  try {
    // Initialize database before starting server
    logger.info('Starting server initialization...');
    await initializeDatabase();
    logger.info('Database initialization complete');

    const app = createApp();

    // Start server
    const server = app.listen(config.port, () => {
      logger.info('Server started successfully', {
        port: config.port,
        environment: config.nodeEnv,
        allowedOrigins: config.allowedOrigins
      });
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown(server));
    process.on('SIGINT', () => gracefulShutdown(server));

    // Handle uncaught exceptions and unhandled rejections
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception', { error: error.message, stack: error.stack });
      gracefulShutdown(server);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled rejection', { reason, promise });
      gracefulShutdown(server);
    });

  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

// Start the server
startServer();

export { createApp };
