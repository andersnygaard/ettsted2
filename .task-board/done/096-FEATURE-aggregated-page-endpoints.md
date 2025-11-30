# FEATURE: Aggregated Page API Endpoints (Future Optimization)

**Status**: Done
**Created**: 2025-11-30
**Priority**: Low
**Labels**: backend, api, optimization, future
**Estimated Effort**: Medium - 2 hours

## Context & Motivation

**Current state**: Frontend hooks fetch `/api/v1/snapshots` and calculate metrics client-side. This works fine for current data volumes.

**Future optimization**: Create dedicated endpoints that return pre-aggregated data for each page. Benefits:
- Reduced client payload
- Server-side calculation (consistent logic)
- Faster page loads with large datasets

**When to implement**: Consider when:
- Users have 50+ snapshots
- Page load times become noticeable
- Need server-side business logic validation

## Desired Outcome

Four aggregated endpoints, one per data page:
- `GET /api/v1/dashboard` - Dashboard metrics
- `GET /api/v1/sparing/summary` - Sparing & F.I.R.E. metrics
- `GET /api/v1/gjeld/summary` - Gjeld metrics with loans
- `GET /api/v1/pensjon/summary` - Pensjon breakdown

## Acceptance Criteria

### Dashboard Endpoint
- [x] `GET /api/v1/dashboard`
- [x] Returns: netWorth, monthlyChange%, sumSparing, sumGjeld, pensjon, sparerate, snapshotDate
- [x] Uses calculationService for computed values

### Sparing Endpoint
- [x] `GET /api/v1/sparing/summary`
- [x] Returns: sumSparing, sparerate, monthsFree, fireNumber, fireProgress, history[]
- [x] Includes chart history data

### Gjeld Endpoint
- [x] `GET /api/v1/gjeld/summary`
- [x] Returns: sumGjeld, dekning%, remaining, loans[], history[]
- [x] Includes loan details (name, value)

### Pensjon Endpoint
- [x] `GET /api/v1/pensjon/summary`
- [x] Returns: sumPensjon, breakdown[], history[]
- [x] Supports historical data for charts

## Technical Approach

Create a single `summaryRoutes.ts` or individual route files per page. All use:
- calculationService for calculations
- snapshotService for data fetching
- userService for profile data

Example structure:

```typescript
// /backend/src/routes/summaryRoutes.ts

import { Router } from 'express';
import * as userService from '../services/userService';
import * as snapshotService from '../services/snapshotService';
import * as calc from '../services/calculationService';

const router = Router();

router.get('/dashboard', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const user = await userService.getUserById(userId);
    const snapshots = await snapshotService.getSnapshots(userId, { limit: 2 });

    // ... calculations using calc service ...

    res.json({ data: dashboardData, success: true });
  } catch (error) {
    next(error);
  }
});

// Similar for /sparing/summary, /gjeld/summary, /pensjon/summary

export default router;
```

## Migration Path

1. Implement endpoints
2. Update frontend hooks to use new endpoints
3. Remove client-side calculation logic from hooks
4. Update types if response shapes differ

## Dependencies

- 080-FEATURE-calculation-service
- snapshotService (exists)
- userService (exists)

---

## Progress Log

### 2025-11-30
- Updated `calculationService.ts` to work with Portfolio.ts model (Account[] instead of AccountBalance/AccountConfig)
- Added helper function `getCategory()` to map assetClass to category ('sparing', 'gjeld', 'pensjon')
- Updated `calculateSumByCategory()`, `calculateNetWorth()`, `calculateDekning()` signatures
- Created `/backend/src/routes/summaryRoutes.ts` with 4 aggregated endpoints:
  - `GET /api/v1/dashboard` - Dashboard metrics with comparison
  - `GET /api/v1/sparing/summary` - Sparing & F.I.R.E. metrics with history
  - `GET /api/v1/gjeld/summary` - Debt metrics with loan breakdown and history
  - `GET /api/v1/pensjon/summary` - Pension metrics with breakdown and history
- Mounted summaryRoutes in `/backend/src/routes/index.ts` with validateAuth middleware
- Backend build verified: `pnpm --filter backend build` passes with no errors

**Notes**: This task consolidates archived tasks 084-087. Implementation complete.
