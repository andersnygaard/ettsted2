import winston from 'winston';

/**
 * Winston logger configuration for structured logging
 *
 * Development: Human-readable console output with colors
 * Production: Structured JSON format for log aggregation
 */

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Console format for development (human-readable)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}]: ${message}${metaString}`;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: isDevelopment ? consoleFormat : logFormat
    })
  ],
  // Don't exit on handled exceptions
  exitOnError: false
});

// Handle uncaught exceptions and unhandled rejections
if (isProduction) {
  logger.exceptions.handle(
    new winston.transports.Console({
      format: logFormat
    })
  );

  logger.rejections.handle(
    new winston.transports.Console({
      format: logFormat
    })
  );
}

// Log initialization
logger.info('Logger initialized', {
  level: logger.level,
  environment: process.env.NODE_ENV || 'development'
});
