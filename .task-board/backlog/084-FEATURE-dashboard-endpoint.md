# FEATURE: Dashboard API Endpoint

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, api, aggregation
**Estimated Effort**: Simple - 45 min

## Context & Motivation

Create aggregated endpoint for dashboard page data.

## Desired Outcome

Single endpoint returning all dashboard metrics.

## Acceptance Criteria

- [ ] Add `GET /api/v1/dashboard` endpoint
- [ ] Return: netWorth, monthlyChange%, sumSparing, sumGjeld, pensjon, sparerate, nextMilestone
- [ ] Fetch latest snapshot and previous for comparison
- [ ] Use calculationService for all computed values
- [ ] Handle empty data gracefully

## Technical Approach

```typescript
// Add to routes or create /backend/src/routes/dashboardRoutes.ts

import { Router } from 'express';
import { getUserById } from '../services/userService';
import { getSnapshots, getLatestSnapshot } from '../services/snapshotService';
import * as calc from '../services/calculationService';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  const user = await getUserById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const snapshots = await getSnapshots(req.userId, { limit: 2 });
  const latest = snapshots[0];
  const previous = snapshots[1];

  if (!latest) {
    return res.json({
      data: {
        netWorth: 0,
        monthlyChange: 0,
        sumSparing: 0,
        sumGjeld: 0,
        pensjon: 0,
        sparerate: calc.calculateSparerate(user.profile),
        nextMilestone: 100000,
        currentProgress: 0,
      },
    });
  }

  const sumSparing = calc.calculateSumByCategory(latest.balances, user.accounts, 'sparing');
  const sumGjeld = calc.calculateSumByCategory(latest.balances, user.accounts, 'gjeld');
  const pensjon = calc.calculateSumByCategory(latest.balances, user.accounts, 'pensjon');
  const netWorth = sumSparing - sumGjeld;

  const prevNetWorth = previous
    ? calc.calculateNetWorth(previous.balances, user.accounts)
    : netWorth;

  const milestones = [100000, 250000, 500000, 750000, 1000000, 2000000, 5000000];
  const nextMilestone = milestones.find(m => m > sumSparing) || sumSparing * 2;

  res.json({
    data: {
      netWorth,
      monthlyChange: calc.calculateMonthlyChange(netWorth, prevNetWorth),
      sumSparing,
      sumGjeld,
      pensjon,
      sparerate: calc.calculateSparerate(user.profile),
      nextMilestone,
      currentProgress: sumSparing,
    },
  });
});

export default router;
```

## Dependencies

- 077, 079, 080 (services)

---

**Next Steps**: Create sparing summary endpoint (085)
