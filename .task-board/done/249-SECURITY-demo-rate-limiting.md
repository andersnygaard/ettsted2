# 249 - Add Demo Login Rate Limiting

## Type
Security

## Priority
High

## Description
Add dedicated aggressive rate limiting to the `/auth/demo-login` endpoint. Currently uses general rate limit (100/min) which is too permissive for a public demo endpoint.

## Source
Due Diligence Report - Security Concern #1

## Implementation

### File: `backend/src/routes/authRoutes.ts`

Add dedicated rate limiter:
```typescript
import rateLimit from 'express-rate-limit';

const demoRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    error: { message: 'For mange demo-forespørsler. Prøv igjen senere.' },
    success: false
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to demo-login route
router.post('/demo-login', demoRateLimiter, async (req, res) => { ... };
```

## Acceptance Criteria
- [x] Demo login limited to 5 requests per 15 minutes per IP
- [x] Returns Norwegian error message when rate limited
- [x] Standard rate limit headers included in response
- [x] E2E test verifies rate limiting works

## Implementation Notes

### Files Modified

1. **backend/src/middleware/rateLimiter.ts**
   - Added `demoLoginRateLimiter` export: aggressive rate limiter (5 req/15min)
   - Returns 429 status with Norwegian error message
   - Includes standard RateLimit-* headers
   - Logs warnings when limit exceeded

2. **backend/src/routes/authRoutes.ts**
   - Added import: `import { demoLoginRateLimiter } from '../middleware/rateLimiter'`
   - Applied middleware to route: `router.post('/demo-login', demoLoginRateLimiter, async ...)`

3. **e2e/tests/demo-rate-limiting.spec.ts** (new)
   - Test 1: Verify 5 successful requests work
   - Test 2: Verify 429 response when limit exceeded
   - Test 3: Verify rate limit headers present
   - Test 4: Verify response format and Norwegian message

### Why Centralized in rateLimiter.ts

The rate limiter was added to the existing `backend/src/middleware/rateLimiter.ts` alongside other rate limiters (general, calculator, LLM) for:
- Consistency with project patterns
- Easy maintenance and auditing
- Clear separation of concerns
- Reusability if needed elsewhere

## Effort
Low (30 min)
