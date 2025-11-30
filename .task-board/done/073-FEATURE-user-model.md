# FEATURE: User and UserProfile Interfaces

**Status**: Complete
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, models, data-model
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Create TypeScript interfaces for User and UserProfile as defined in the data model plan.

## Desired Outcome

Type-safe User model with embedded profile.

## Acceptance Criteria

- [x] Create `/backend/src/models/User.ts`
- [x] Define `User` interface with fields: id, nickname, email, createdAt, updatedAt, profile, accounts
- [x] Define `UserProfile` interface with fields: monthlySalary, annualExpenses, birthYear, plannedRetirementAge, fireNumber (optional)
- [x] Define `Category` type: 'sparing' | 'gjeld' | 'pensjon'
- [x] Export all types

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

## Resolution

**Completed**: 2025-11-30

**Files created**:
- `backend/src/models/User.ts` - Complete User model with:
  - `Category` type ('sparing' | 'gjeld' | 'pensjon')
  - `UserProfile` interface with financial planning settings
  - `LoanDetails` interface for debt accounts
  - `AccountConfig` interface (embedded in User)
  - `User` interface with all fields + JSDoc documentation

**Bonus**: Also included `AccountConfig` and `LoanDetails` in same file since they're embedded in User document (matches CLAUDE.md data model).

**Build verification**: TypeScript compilation passed ✓

**Next Steps**: Task 074 (Account Model) may be simplified since AccountConfig is already defined here.
