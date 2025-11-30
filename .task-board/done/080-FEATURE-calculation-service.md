# FEATURE: Calculation Service

**Status**: Backlog
**Created**: 2025-11-30
**Updated**: 2025-11-30
**Priority**: Low
**Labels**: backend, services, utilities
**Estimated Effort**: Simple - 45 min

## Context & Motivation

Create calculation service for financial metrics. Currently calculations happen client-side in frontend hooks. This service provides backend-side calculation utilities for:
1. Future aggregated API endpoints
2. Backend business logic that needs calculations
3. Consistent calculation logic between frontend/backend

**Note**: Frontend hooks currently work well with client-side calculations. This is for future backend needs.

## Desired Outcome

Pure functions for financial calculations that can be used by services and routes.

## Acceptance Criteria

- [x] Create `/backend/src/services/calculationService.ts`
- [x] Implement `calculateSumByCategory(balances, accounts, category)`
- [x] Implement `calculateNetWorth(balances, accounts)` - sparing - gjeld
- [x] Implement `calculateDekning(balances, accounts)` - sparing / gjeld * 100
- [x] Implement `calculateSparerate(profile)` - savings rate percentage
- [x] Implement `calculateFireNumber(profile)` - FIRE target
- [x] Implement `calculateMonthsFree(sumSparing, annualExpenses)`
- [x] Implement `calculateMonthlyChange(current, previous)`
- [x] All functions are pure (no side effects)
- [x] Add JSDoc comments with formulas

## Technical Approach

```typescript
// /backend/src/services/calculationService.ts

import { AccountBalance } from '../models/Snapshot';
import { AccountConfig } from '../models/Account';
import { UserProfile, Category } from '../models/User';

/**
 * Calculate sum of balances for accounts in a specific category
 *
 * @param balances - Account balances from snapshot
 * @param accounts - Account configurations
 * @param category - Category to filter by (sparing, gjeld, pensjon)
 */
export function calculateSumByCategory(
  balances: AccountBalance[],
  accounts: AccountConfig[],
  category: Category
): number {
  const categoryAccountIds = new Set(
    accounts
      .filter(a => a.category === category && a.isActive)
      .map(a => a.id)
  );

  return balances
    .filter(b => categoryAccountIds.has(b.accountId))
    .reduce((sum, b) => sum + b.balance, 0);
}

/**
 * Calculate net worth (sum sparing - sum gjeld)
 */
export function calculateNetWorth(
  balances: AccountBalance[],
  accounts: AccountConfig[]
): number {
  const sparing = calculateSumByCategory(balances, accounts, 'sparing');
  const gjeld = calculateSumByCategory(balances, accounts, 'gjeld');
  return sparing - gjeld;
}

/**
 * Calculate dekning (coverage) percentage
 * How much of debt is covered by savings
 *
 * Formula: (sum sparing / sum gjeld) * 100
 * Returns 100 if no debt
 */
export function calculateDekning(
  balances: AccountBalance[],
  accounts: AccountConfig[]
): number {
  const sparing = calculateSumByCategory(balances, accounts, 'sparing');
  const gjeld = calculateSumByCategory(balances, accounts, 'gjeld');

  if (gjeld === 0) return 100;
  return (sparing / gjeld) * 100;
}

/**
 * Calculate savings rate percentage
 *
 * Formula: ((annual income - annual expenses) / annual income) * 100
 */
export function calculateSparerate(profile: UserProfile): number {
  const annualIncome = profile.monthlySalary * 12;
  if (annualIncome === 0) return 0;
  return ((annualIncome - profile.annualExpenses) / annualIncome) * 100;
}

/**
 * Calculate F.I.R.E. number (target wealth for financial independence)
 *
 * Uses custom fireNumber if set, otherwise 25x annual expenses (4% rule)
 */
export function calculateFireNumber(profile: UserProfile): number {
  return profile.fireNumber ?? profile.annualExpenses * 25;
}

/**
 * Calculate months of expenses covered by savings
 */
export function calculateMonthsFree(sumSparing: number, annualExpenses: number): number {
  if (annualExpenses === 0) return Infinity;
  const monthlyExpenses = annualExpenses / 12;
  return Math.floor(sumSparing / monthlyExpenses);
}

/**
 * Calculate percentage change between two values
 */
export function calculateMonthlyChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}
```

## Dependencies

- Models: User, Account, Snapshot

## Usage

```typescript
// In a route or service
import * as calc from './services/calculationService';

const netWorth = calc.calculateNetWorth(snapshot.balances, user.accounts);
const dekning = calc.calculateDekning(snapshot.balances, user.accounts);
```

---

## Progress Log

### 2025-11-30 - Implementation Complete
- Created `/backend/src/services/calculationService.ts` with all 7 calculation functions
- All functions implemented as pure, side-effect-free functions
- Comprehensive JSDoc comments added with formulas and examples
- Edge case handling implemented (division by zero, zero previous values, etc.)
- Proper TypeScript types applied throughout
- All acceptance criteria met

**Next Steps**: Use in aggregated endpoints when needed
