# FEATURE: Gjeld Summary API Endpoint

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, api, aggregation
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Create aggregated endpoint for gjeld page.

## Desired Outcome

Single endpoint returning gjeld metrics and loan details.

## Acceptance Criteria

- [ ] Add `GET /api/v1/gjeld/summary` endpoint
- [ ] Return: sumGjeld, monthlyChange, dekning%, remaining
- [ ] Return loans array with details (name, balance, interestRate, remainingYears)
- [ ] Return history array for chart

## Technical Approach

```typescript
// /backend/src/routes/gjeldRoutes.ts

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
  const previous = snapshots[1];

  if (!latest) {
    return res.json({
      data: { sumGjeld: 0, monthlyChange: 0, dekning: 100, remaining: 0, loans: [], history: [] },
    });
  }

  const sumGjeld = calc.calculateSumByCategory(latest.balances, user.accounts, 'gjeld');
  const sumSparing = calc.calculateSumByCategory(latest.balances, user.accounts, 'sparing');
  const dekning = calc.calculateDekning(latest.balances, user.accounts);

  const prevGjeld = previous
    ? calc.calculateSumByCategory(previous.balances, user.accounts, 'gjeld')
    : sumGjeld;

  // Build loans array with details
  const gjeldAccounts = user.accounts.filter(a => a.category === 'gjeld' && a.isActive);
  const loans = gjeldAccounts.map(account => {
    const balance = latest.balances.find(b => b.accountId === account.id)?.balance || 0;
    return {
      id: account.id,
      name: account.name,
      balance,
      interestRate: account.loanDetails?.interestRate || 0,
      remainingYears: account.loanDetails?.remainingYears || 0,
    };
  });

  res.json({
    data: {
      sumGjeld,
      monthlyChange: sumGjeld - prevGjeld,
      dekning,
      remaining: Math.max(0, sumGjeld - sumSparing),
      loans,
      history: snapshots.reverse().map(s => ({
        date: s.date,
        value: calc.calculateSumByCategory(s.balances, user.accounts, 'gjeld'),
      })),
    },
  });
});

export default router;
```

## Dependencies

- 077, 079, 080 (services)

---

**Next Steps**: Create pensjon summary endpoint (087)
