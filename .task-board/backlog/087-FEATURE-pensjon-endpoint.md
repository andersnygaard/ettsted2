# FEATURE: Pensjon Summary API Endpoint

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, api, aggregation
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Create aggregated endpoint for pensjon page.

## Desired Outcome

Single endpoint returning pensjon metrics with breakdown.

## Acceptance Criteria

- [ ] Add `GET /api/v1/pensjon/summary` endpoint
- [ ] Return: sumPensjon, breakdown (arbeidsgiver, folketrygden with amounts and percentages)
- [ ] Return OTP percentage
- [ ] Return history array for stacked chart

## Technical Approach

```typescript
// /backend/src/routes/pensjonRoutes.ts

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
    return res.json({
      data: { sumPensjon: 0, breakdown: [], otpPercent: 0, history: [] },
    });
  }

  const pensjonAccounts = user.accounts.filter(a => a.category === 'pensjon' && a.isActive);
  const sumPensjon = calc.calculateSumByCategory(latest.balances, user.accounts, 'pensjon');

  // Build breakdown
  const breakdown = pensjonAccounts.map(account => {
    const balance = latest.balances.find(b => b.accountId === account.id)?.balance || 0;
    return {
      id: account.id,
      name: account.name,
      amount: balance,
      percent: sumPensjon > 0 ? (balance / sumPensjon) * 100 : 0,
    };
  });

  // OTP = Arbeidsgiver as percent of total
  const arbeidsgiver = breakdown.find(b => b.name.toLowerCase().includes('arbeidsgiver'));
  const otpPercent = arbeidsgiver?.percent || 0;

  // History for stacked chart
  const history = snapshots.reverse().map(s => {
    const data: Record<string, any> = { date: s.date };
    pensjonAccounts.forEach(account => {
      const balance = s.balances.find(b => b.accountId === account.id)?.balance || 0;
      data[account.name] = balance;
    });
    return data;
  });

  res.json({
    data: {
      sumPensjon,
      breakdown,
      otpPercent,
      history,
    },
  });
});

export default router;
```

## Dependencies

- 077, 079, 080 (services)

---

**Next Steps**: Create frontend types (088)
