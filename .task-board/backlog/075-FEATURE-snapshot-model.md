# FEATURE: MonthlySnapshot and AccountBalance Interfaces

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, models, data-model
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Create TypeScript interfaces for MonthlySnapshot and AccountBalance as defined in the data model plan.

## Desired Outcome

Type-safe snapshot model with normalized account balances.

## Acceptance Criteria

- [ ] Create `/backend/src/models/Snapshot.ts`
- [ ] Define `AccountBalance` interface with fields: accountId, balance
- [ ] Define `MonthlySnapshot` interface with fields: id, userId, date, createdAt, updatedAt, balances
- [ ] Export all types

## Technical Approach

```typescript
// /backend/src/models/Snapshot.ts

export interface AccountBalance {
  accountId: string;  // FK → AccountConfig.id
  balance: number;    // Saldo in NOK
}

export interface MonthlySnapshot {
  id: string;
  userId: string;
  date: Date;         // Full UTC date (first day of month)
  createdAt: Date;
  updatedAt: Date;
  balances: AccountBalance[];
}
```

## Dependencies

- 074-FEATURE-account-model (AccountConfig for FK reference)

---

**Next Steps**: Create validation schemas (076)
