import winston from 'winston';
import { getLogContext } from './loggerContext';

/**
 * Winston logger configuration for structured logging
 *
 * Development: Human-readable console output with colors
 * Production: Structured JSON format for log aggregation
 *
 * Features:
 * - Automatic request context injection (requestId, userId) via AsyncLocalStorage
 * - Sensitive data sanitization (password, token, secret, key, authorization)
 * - Child logger factory for module-scoped logging
 */

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Custom format to inject request context from AsyncLocalStorage
 * Adds requestId and userId to all log entries within a request scope
 */
const contextFormat = winston.format((info) => {
  const context = getLogContext();
  if (context) {
    info.requestId = context.requestId;
    if (context.userId) info.userId = context.userId;
  }
  return info;
});

/**
 * Custom format to sanitize sensitive fields
 * Redacts values for keys containing: password, token, secret, key, authorization
 */
const sanitizeFormat = winston.format((info) => {
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];

  const sanitize = (obj: any): any => {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map(item => sanitize(item));
    }

    const result = { ...obj };
    for (const key of Object.keys(result)) {
      if (sensitiveKeys.some(s => key.toLowerCase().includes(s))) {
        result[key] = '[REDACTED]';
      } else if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = sanitize(result[key]);
      }
    }
    return result;
  };

  return sanitize(info);
});

// Define log format with context and sanitization
const logFormat = winston.format.combine(
  contextFormat(),
  sanitizeFormat(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Console format for development (human-readable)
const consoleFormat = winston.format.combine(
  contextFormat(),
  sanitizeFormat(),
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

/**
 * Create a child logger for a specific module/service
 * Automatically includes module name in all logs
 */
export function createLogger(module: string) {
  return logger.child({ module });
}

// Log initialization
logger.info('Logger initialized', {
  level: logger.level,
  environment: process.env.NODE_ENV || 'development'
});
