# FEATURE: Calculation Service

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, services, data-model
**Estimated Effort**: Medium - 1.5 hours

## Context & Motivation

Create calculation service to compute derived values from stored data.

## Desired Outcome

Service layer for all financial calculations (not stored, computed on demand).

## Acceptance Criteria

- [ ] Create `/backend/src/services/calculationService.ts`
- [ ] Implement `calculateSumByCategory(balances, accounts, category)` - sum for category
- [ ] Implement `calculateNetWorth(balances, accounts)` - sparing - gjeld
- [ ] Implement `calculateDekning(balances, accounts)` - sparing / gjeld * 100
- [ ] Implement `calculateSparerate(profile)` - ((lønn*12) - utgifter) / (lønn*12) * 100
- [ ] Implement `calculateFireNumber(profile)` - fireNumber or utgifter * 25
- [ ] Implement `calculateMonthsFree(sumSparing, annualExpenses)` - months of expenses covered
- [ ] Implement `calculateMonthlyChange(current, previous)` - percentage change

## Technical Approach

```typescript
// /backend/src/services/calculationService.ts

import { AccountBalance } from '../models/Snapshot';
import { AccountConfig } from '../models/Account';
import { UserProfile, Category } from '../models/User';

export function calculateSumByCategory(
  balances: AccountBalance[],
  accounts: AccountConfig[],
  category: Category
): number {
  const categoryAccountIds = accounts
    .filter(a => a.category === category && a.isActive)
    .map(a => a.id);

  return balances
    .filter(b => categoryAccountIds.includes(b.accountId))
    .reduce((sum, b) => sum + b.balance, 0);
}

export function calculateNetWorth(
  balances: AccountBalance[],
  accounts: AccountConfig[]
): number {
  const sparing = calculateSumByCategory(balances, accounts, 'sparing');
  const gjeld = calculateSumByCategory(balances, accounts, 'gjeld');
  return sparing - gjeld;
}

export function calculateDekning(
  balances: AccountBalance[],
  accounts: AccountConfig[]
): number {
  const sparing = calculateSumByCategory(balances, accounts, 'sparing');
  const gjeld = calculateSumByCategory(balances, accounts, 'gjeld');
  if (gjeld === 0) return 100;
  return (sparing / gjeld) * 100;
}

export function calculateSparerate(profile: UserProfile): number {
  const annualIncome = profile.monthlySalary * 12;
  if (annualIncome === 0) return 0;
  return ((annualIncome - profile.annualExpenses) / annualIncome) * 100;
}

export function calculateFireNumber(profile: UserProfile): number {
  return profile.fireNumber ?? profile.annualExpenses * 25;
}

export function calculateMonthsFree(sumSparing: number, annualExpenses: number): number {
  if (annualExpenses === 0) return Infinity;
  const monthlyExpenses = annualExpenses / 12;
  return Math.floor(sumSparing / monthlyExpenses);
}

export function calculateMonthlyChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
```

## Dependencies

- 073, 074, 075 (models)

---

**Next Steps**: Create API routes (081-087)
