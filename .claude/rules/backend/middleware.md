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
5. Rate limiters (applied per-route)
6. Routes
7. Error handler (last)

## Rate Limiters
| Name | Limit | Window | Key |
|------|-------|--------|-----|
| generalLimiter | 100 req | 1 min | IP |
| calculatorLimiter | 10 req | 1 min | userId |
| llmLimiter | 20 req | 1 min | IP |
| demoLoginLimiter | 5 req | 15 min | IP |

## Decisions
- Trust proxy enabled (Azure App Service behind reverse proxy)
- Helmet CSP: explicit directives for fonts, images, scripts
- CORS: rejects no-Origin requests in production

## Gotchas
- Calculator rate limiter uses `req.user?.userId` as key (per-user)
- Demo login rate limiter is aggressive (5 req/15min)
- CORS allows no-origin in development/test only
- Rate limit headers included in response (X-RateLimit-*)
