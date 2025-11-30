# FEATURE: Zod Validation Schemas

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, validation, data-model
**Estimated Effort**: Simple - 45 min

## Context & Motivation

Create Zod validation schemas for all data models to ensure type safety at runtime.

## Desired Outcome

Zod schemas that can validate incoming API data.

## Acceptance Criteria

- [ ] Create `/backend/src/validation/schemas.ts`
- [ ] Create `userProfileSchema` for UserProfile validation
- [ ] Create `loanDetailsSchema` for LoanDetails validation
- [ ] Create `accountConfigSchema` for AccountConfig validation
- [ ] Create `accountBalanceSchema` for AccountBalance validation
- [ ] Create `monthlySnapshotSchema` for MonthlySnapshot validation
- [ ] Export all schemas

## Technical Approach

```typescript
// /backend/src/validation/schemas.ts

import { z } from 'zod';

export const categorySchema = z.enum(['sparing', 'gjeld', 'pensjon']);

export const userProfileSchema = z.object({
  monthlySalary: z.number().min(0),
  annualExpenses: z.number().min(0),
  birthYear: z.number().min(1900).max(2100),
  plannedRetirementAge: z.number().min(40).max(100),
  fireNumber: z.number().min(0).optional(),
});

export const loanDetailsSchema = z.object({
  interestRate: z.number().min(0).max(100),
  remainingYears: z.number().min(0).max(50),
  originalAmount: z.number().min(0).optional(),
});

export const accountConfigSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  category: categorySchema,
  isActive: z.boolean(),
  sortOrder: z.number().int().min(0),
  createdAt: z.date(),
  loanDetails: loanDetailsSchema.optional(),
});

export const accountBalanceSchema = z.object({
  accountId: z.string().uuid(),
  balance: z.number(),
});

export const monthlySnapshotSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  date: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  balances: z.array(accountBalanceSchema),
});
```

## Dependencies

- 073, 074, 075 (model interfaces)

---

**Next Steps**: Create userService (077)
