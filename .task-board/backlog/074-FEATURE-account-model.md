# FEATURE: AccountConfig and LoanDetails Interfaces

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, models, data-model
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Create TypeScript interfaces for AccountConfig and LoanDetails as defined in the data model plan.

## Desired Outcome

Type-safe account configuration model with optional loan details for gjeld accounts.

## Acceptance Criteria

- [ ] Create `/backend/src/models/Account.ts`
- [ ] Define `LoanDetails` interface with fields: interestRate, remainingYears, originalAmount (optional)
- [ ] Define `AccountConfig` interface with fields: id, name, category, isActive, sortOrder, createdAt, loanDetails (optional)
- [ ] Export all types

## Technical Approach

```typescript
// /backend/src/models/Account.ts

import { Category } from './User';

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
  createdAt: Date;
  loanDetails?: LoanDetails;
}

// Default accounts created on signup
export const DEFAULT_ACCOUNTS: Omit<AccountConfig, 'id' | 'createdAt'>[] = [
  { name: 'Bank', category: 'sparing', isActive: true, sortOrder: 0 },
  { name: 'Fond', category: 'sparing', isActive: true, sortOrder: 1 },
  { name: 'Huslån', category: 'gjeld', isActive: true, sortOrder: 0 },
  { name: 'Studielån', category: 'gjeld', isActive: true, sortOrder: 1 },
  { name: 'Arbeidsgiver', category: 'pensjon', isActive: true, sortOrder: 0 },
  { name: 'Folketrygden', category: 'pensjon', isActive: true, sortOrder: 1 },
];
```

## Dependencies

- 073-FEATURE-user-model (Category type)

---

**Next Steps**: Create MonthlySnapshot model (075)
