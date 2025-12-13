# FEATURE: MonthlySnapshot and AccountBalance Interfaces

**Status**: Done
**Created**: 2025-11-30
**Completed**: 2025-11-30
**Priority**: High
**Labels**: backend, models, data-model
**Estimated Effort**: Simple - 30 min

## Context & Motivation

Create TypeScript interfaces for MonthlySnapshot and AccountBalance as defined in the data model plan.

## Desired Outcome

Type-safe snapshot model with normalized account balances.

## Acceptance Criteria

- [x] Create `/backend/src/models/Snapshot.ts`
- [x] Define `AccountBalance` interface with fields: accountId, balance
- [x] Define `MonthlySnapshot` interface with fields: id, userId, date, createdAt, updatedAt, balances
- [x] Export all types

## Resolution

Successfully created `/backend/src/models/Snapshot.ts` with:

- `AccountBalance` interface: accountId (FK to AccountConfig.id), balance (NOK)
- `MonthlySnapshot` interface: id, userId, date, createdAt, updatedAt, balances[]
- Comprehensive JSDoc documentation following User.ts pattern
- Documented CosmosDB container strategy (snapshots container, partition key /userId)

**Files created**:
- `/backend/src/models/Snapshot.ts`

---

**Next Steps**: Create validation schemas (076)
