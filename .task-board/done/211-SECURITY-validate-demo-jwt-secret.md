# Task 211: Validate Demo JWT Secret in Production

**Priority**: Critical
**Category**: Security
**Effort**: Low (15 min)
**Impact**: Security +3 points

## Problem

`DEMO_JWT_SECRET` falls back to hardcoded `'demo-secret-key-for-development'` if env var not set.

## Files

- `backend/src/config/environment.ts`

## Implementation

Add startup validation:
```typescript
if (process.env.NODE_ENV === 'production' && !process.env.DEMO_JWT_SECRET) {
  throw new Error('DEMO_JWT_SECRET must be set in production');
}
```

## Acceptance Criteria

- [x] App fails fast if DEMO_JWT_SECRET missing in production
- [x] Development mode works with default
- [x] Backend builds and lints

## Implementation Summary

**File Modified**: `backend/src/config/environment.ts`

**Changes**:
1. Added `demoJwtSecret: string` to `EnvironmentConfig` interface (line 29-30)
2. Added configuration export for `demoJwtSecret` with fallback for development (line 90-91)
3. Added production-only validation that throws error if `DEMO_JWT_SECRET` env var is missing (lines 117-119)

**Build Results**: ✓ Passed
**Lint Results**: ✓ Passed (no errors)

**How it works**:
- In development (NODE_ENV !== 'production'): Falls back to hardcoded 'demo-secret-key-for-development'
- In production (NODE_ENV === 'production'): Requires explicit DEMO_JWT_SECRET env var, throws on startup if missing
- Fast-fail principle: Error thrown during config initialization, before app starts
