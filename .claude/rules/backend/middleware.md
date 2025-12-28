---
paths:
  - backend/**/*
---

# Middleware Rules

## Stack
Express, Helmet, CORS, express-rate-limit

## Structure
- `/middleware/auth.ts` - EasyAuth validation
- `/middleware/validate.ts` - Zod validation
- `/middleware/errorHandler.ts` - Global error handler
- `/middleware/rateLimiter.ts` - Rate limit instances
- `/middleware/requestLogger.ts` - Request logging

## Stack Order (app.ts)
1. Helmet (security headers)
2. CORS
3. Body parser (JSON)
4. Request logger
5. Rate limiter (global)
6. Routes
7. Error handler (last)

## Rate Limiter
Single global rate limiter:
- 1000 requests per hour per IP
- Only active in production (`skip: () => !isProduction`)
- Standard RateLimit-* headers

## Decisions
- Trust proxy enabled (Azure App Service behind reverse proxy)
- Helmet CSP: explicit directives for fonts, images, scripts
- CORS: rejects no-Origin requests in production
- Rate limiting disabled in development/test for easier testing

## Gotchas
- CORS allows no-origin in development/test only
- Rate limit headers included in response (RateLimit-*)
