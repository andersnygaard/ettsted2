# Task 212: Enable Trust Proxy in Express

**Priority**: Critical
**Category**: Security
**Effort**: Low (5 min)
**Impact**: Security +2 points

## Problem

Rate limiting uses `req.ip` which doesn't work behind Azure proxy.

## Files

- `backend/src/app.ts`

## Implementation

Add after Express app creation:
```typescript
app.set('trust proxy', true);
```

## Acceptance Criteria

- [x] Trust proxy enabled
- [x] Rate limiting works per-user in Azure
- [x] Backend builds
