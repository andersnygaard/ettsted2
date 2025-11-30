# FEATURE: User and UserProfile Interfaces

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, models, data-model
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Create TypeScript interfaces for User and UserProfile as defined in the data model plan.

## Desired Outcome

Type-safe User model with embedded profile.

## Acceptance Criteria

- [ ] Create `/backend/src/models/User.ts`
- [ ] Define `User` interface with fields: id, nickname, email, createdAt, updatedAt, profile, accounts
- [ ] Define `UserProfile` interface with fields: monthlySalary, annualExpenses, birthYear, plannedRetirementAge, fireNumber (optional)
- [ ] Define `Category` type: 'sparing' | 'gjeld' | 'pensjon'
- [ ] Export all types

## Technical Approach

```typescript
// /backend/src/models/User.ts

export type Category = 'sparing' | 'gjeld' | 'pensjon';

export interface UserProfile {
  monthlySalary: number;
  annualExpenses: number;
  birthYear: number;
  plannedRetirementAge: number;
  fireNumber?: number;
}

export interface User {
  id: string;
  nickname: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  profile: UserProfile;
  accounts: AccountConfig[]; // Import from Account.ts
}
```

## Dependencies

- None (first model to create)

---

**Next Steps**: Create AccountConfig model (074)
