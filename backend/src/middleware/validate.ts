/**
 * Zod Validation Middleware
 *
 * Generic middleware for validating request data using Zod schemas.
 * Supports validation of body, params, and query.
 */

import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { logger } from '../utils/logger';

/**
 * Location in request to validate
 */
type ValidationTarget = 'body' | 'params' | 'query';

/**
 * Validates request data against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @param target - Which part of the request to validate (body, params, query)
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * router.post('/users', validate(userCreateSchema, 'body'), createUser);
 * router.get('/users/:id', validate(userIdSchema, 'params'), getUser);
 * ```
 */
export function validate(schema: z.ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Get data from specified request location
      const data = req[target];

      // Validate data against schema
      const validated = schema.parse(data);

      // Replace request data with validated (and potentially transformed) data
      req[target] = validated as typeof req[typeof target];

      logger.debug(`Validation passed for ${target}`, {
        path: req.path,
        method: req.method
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into our standard error response
        logger.warn(`Validation failed for ${target}`, {
          path: req.path,
          method: req.method,
          errors: error.errors
        });

        res.status(400).json({
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
              code: err.code
            }))
          },
          success: false
        });
        return;
      }

      // Unexpected error, pass to error handler
      next(error);
    }
  };
}

/**
 * Convenience wrapper for validating request body
 */
export const validateBody = (schema: z.ZodSchema) => validate(schema, 'body');

/**
 * Convenience wrapper for validating request params
 */
export const validateParams = (schema: z.ZodSchema) => validate(schema, 'params');

/**
 * Convenience wrapper for validating request query
 */
export const validateQuery = (schema: z.ZodSchema) => validate(schema, 'query');
