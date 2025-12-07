/**
 * Server Entry Point
 *
 * Initializes the database and starts the Express server.
 * For testing, import createApp from './app' instead to avoid auto-starting.
 */

import { Server } from 'http';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { initializeDatabase } from './config/cosmosdb';
import { flushLangfuse } from './services/langfuseService';
import { createApp } from './app';

// Re-export for backwards compatibility
export { createApp } from './app';

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(server: Server): Promise<void> {
  logger.info('Received shutdown signal, starting graceful shutdown...');

  // Flush Langfuse traces before shutdown
  await flushLangfuse();

  // Stop accepting new connections
  server.close(() => {
    logger.info('Server closed, all connections finished');
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
        allowedOrigins: config.allowedOrigins,
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
