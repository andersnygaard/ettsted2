# FEATURE: Sparing Summary API Endpoint

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, api, aggregation
**Estimated Effort**: Simple - 45 min

## Context & Motivation

Create aggregated endpoint for sparing page with F.I.R.E. metrics.

## Desired Outcome

Single endpoint returning all sparing/FIRE data.

## Acceptance Criteria

- [ ] Add `GET /api/v1/sparing/summary` endpoint
- [ ] Return: sumSparing, yearlyChange, sparerate, monthsFree, fireNumber, fireProgress, minRetireAge, annualWithdrawal
- [ ] Return history array for chart
- [ ] Use calculationService for computed values

## Technical Approach

```typescript
// /backend/src/routes/sparingRoutes.ts

import { Router } from 'express';
import { getUserById } from '../services/userService';
import { getSnapshots } from '../services/snapshotService';
import * as calc from '../services/calculationService';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/summary', authMiddleware, async (req, res) => {
  const user = await getUserById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const snapshots = await getSnapshots(req.userId, { limit: 100 });
  const latest = snapshots[0];

  if (!latest) {
    return res.json({ data: getEmptySparingData(user.profile) });
  }

  const sumSparing = calc.calculateSumByCategory(latest.balances, user.accounts, 'sparing');
  const fireNumber = calc.calculateFireNumber(user.profile);
  const sparerate = calc.calculateSparerate(user.profile);

  // Find year start snapshot for yearly change
  const yearStart = snapshots.find(s => {
    const d = new Date(s.date);
    return d.getMonth() === 0; // January
  });

  const yearStartSparing = yearStart
    ? calc.calculateSumByCategory(yearStart.balances, user.accounts, 'sparing')
    : sumSparing;

  const currentAge = new Date().getFullYear() - user.profile.birthYear;
  const yearsToFire = calculateYearsToFire(sumSparing, fireNumber, sparerate);

  res.json({
    data: {
      sumSparing,
      yearlyChange: calc.calculateMonthlyChange(sumSparing, yearStartSparing),
      sparerate,
      monthsFree: calc.calculateMonthsFree(sumSparing, user.profile.annualExpenses),
      fireNumber,
      fireProgress: (sumSparing / fireNumber) * 100,
      minRetireAge: currentAge + yearsToFire,
      annualWithdrawal: sumSparing * 0.04,
      history: snapshots.reverse().map(s => ({
        date: s.date,
        value: calc.calculateSumByCategory(s.balances, user.accounts, 'sparing'),
      })),
    },
  });
});

function calculateYearsToFire(current: number, target: number, savingsRate: number): number {
  if (savingsRate <= 0) return 99;
  // Simplified: assumes 7% annual growth
  const annualGrowth = 0.07;
  let years = 0;
  let value = current;
  const annualSavings = (savingsRate / 100) * current * 12;

  while (value < target && years < 100) {
    value = value * (1 + annualGrowth) + annualSavings;
    years++;
  }

  return years;
}

export default router;
```

## Dependencies

- 077, 079, 080 (services)

---

**Next Steps**: Create gjeld summary endpoint (086)
