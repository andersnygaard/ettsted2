# 259 - Add Authentication to Calculator Endpoints

**Type**: SECURITY
**Priority**: Medium
**Effort**: Low (30 min)
**Labels**: security, api, due-diligence

---

## Context

The due diligence report identified calculator endpoints as publicly accessible without authentication. While calculators don't access user data, they:

1. Consume server resources (especially Monte Carlo with up to 10,000 simulations)
2. Should be protected to prevent abuse
3. Inconsistent with other API endpoints which all require auth

Currently: Rate limiting only (10 req/min per IP)
Target: Rate limiting + authentication

## Current State

[backend/src/routes/calculatorRoutes.ts](backend/src/routes/calculatorRoutes.ts):
```typescript
router.post('/monte-carlo', calculatorRateLimiter, validateBody(...), monteCarloSimulation);
```

[backend/src/routes/index.ts](backend/src/routes/index.ts):
```typescript
router.use('/kalkulatorer', calculatorRoutes);  // No validateAuth
```

## Acceptance Criteria

- [x] All calculator endpoints require authentication
- [x] Unauthenticated requests return 401
- [x] Rate limiting still applies per-user (not per-IP)
- [x] E2E calculator tests updated with auth
- [x] Frontend calculator pages work with auth

## Technical Approach

### Option A: Add at Router Level (Recommended)

Modify [backend/src/routes/index.ts](backend/src/routes/index.ts):

```typescript
// Before
router.use('/kalkulatorer', calculatorRoutes);

// After
router.use('/kalkulatorer', validateAuth, calculatorRoutes);
```

This is consistent with how other protected routes are configured.

### Option B: Individual Route Level

Add `validateAuth` to each calculator route. More granular but more verbose.

### Rate Limiter Update

Currently uses IP-based limiting. Consider switching to user-based:

```typescript
// backend/src/middleware/rateLimiter.ts
export const calculatorRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.user?.id || req.ip,  // User-based when authenticated
  // ...
});
```

## Files to Modify

- [backend/src/routes/index.ts](backend/src/routes/index.ts) - Add validateAuth
- [backend/src/middleware/rateLimiter.ts](backend/src/middleware/rateLimiter.ts) - Optional: user-based key
- [e2e/tests/calculators/*.spec.ts](e2e/tests/calculators/) - Add auth to tests

## Testing

1. Verify 401 without token:
   ```bash
   curl -X POST http://localhost:3001/api/v1/kalkulatorer/fire \
     -H "Content-Type: application/json" \
     -d '{"currentSavings": 100000, "annualExpenses": 50000}'
   # Should return 401
   ```

2. Verify success with token:
   ```bash
   curl -X POST http://localhost:3001/api/v1/kalkulatorer/fire \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{"currentSavings": 100000, "annualExpenses": 50000}'
   # Should return 200 with results
   ```

## Related Plans

- [.docs/DUE-DILIGENCE-REPORT.md](../.docs/DUE-DILIGENCE-REPORT.md) - Security Finding #4

## Risks

- Frontend must ensure auth token is sent with calculator requests
- Anonymous users can no longer use calculators (acceptable trade-off)

## Notes

This is a deliberate security decision. Calculators should be a feature for authenticated users, not a public API. The rate limiting alone is insufficient protection against determined abuse.
