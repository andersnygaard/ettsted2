# FEATURE: Frontend TypeScript Types

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: frontend, types, data-model
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Mirror backend types in frontend for type safety.

## Desired Outcome

Shared types for API responses and data structures.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/types/models.ts`
- [ ] Define Category, UserProfile, User types
- [ ] Define LoanDetails, AccountConfig types
- [ ] Define AccountBalance, MonthlySnapshot types
- [ ] Define API response types for each endpoint

## Technical Approach

```typescript
// /frontend/src/shared/types/models.ts

export type Category = 'sparing' | 'gjeld' | 'pensjon';

export interface UserProfile {
  monthlySalary: number;
  annualExpenses: number;
  birthYear: number;
  plannedRetirementAge: number;
  fireNumber?: number;
}

export interface LoanDetails {
  interestRate: number;
  remainingYears: number;
  originalAmount?: number;
}

export interface AccountConfig {
  id: string;
  name: string;
  category: Category;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  loanDetails?: LoanDetails;
}

export interface User {
  id: string;
  nickname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile;
  accounts: AccountConfig[];
}

export interface AccountBalance {
  accountId: string;
  balance: number;
}

export interface MonthlySnapshot {
  id: string;
  userId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  balances: AccountBalance[];
}

// API Response types
export interface DashboardData {
  netWorth: number;
  monthlyChange: number;
  sumSparing: number;
  sumGjeld: number;
  pensjon: number;
  sparerate: number;
  nextMilestone: number;
  currentProgress: number;
}

export interface SparingData {
  sumSparing: number;
  yearlyChange: number;
  sparerate: number;
  monthsFree: number;
  fireNumber: number;
  fireProgress: number;
  minRetireAge: number;
  annualWithdrawal: number;
  history: { date: string; value: number }[];
}

export interface GjeldData {
  sumGjeld: number;
  monthlyChange: number;
  dekning: number;
  remaining: number;
  loans: { id: string; name: string; balance: number; interestRate: number; remainingYears: number }[];
  history: { date: string; value: number }[];
}

export interface PensjonData {
  sumPensjon: number;
  breakdown: { id: string; name: string; amount: number; percent: number }[];
  otpPercent: number;
  history: Record<string, any>[];
}
```

## Dependencies

- None (frontend-only)

---

**Next Steps**: Create API services (089)
