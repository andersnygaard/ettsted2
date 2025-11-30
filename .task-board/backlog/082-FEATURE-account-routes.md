# FEATURE: Account API Routes

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, api, routes
**Estimated Effort**: Simple - 45 min

## Context & Motivation

Create API routes for account configuration management.

## Desired Outcome

REST endpoints for CRUD operations on user accounts.

## Acceptance Criteria

- [ ] Create `/backend/src/routes/accountRoutes.ts`
- [ ] `GET /api/v1/accounts` - Get all user's accounts
- [ ] `POST /api/v1/accounts` - Create new account
- [ ] `PATCH /api/v1/accounts/:id` - Update account (name, loan details)
- [ ] `DELETE /api/v1/accounts/:id` - Soft delete (isActive: false)
- [ ] `PATCH /api/v1/accounts/reorder` - Update sort order
- [ ] Validate input with Zod schemas

## Technical Approach

```typescript
// /backend/src/routes/accountRoutes.ts

import { Router } from 'express';
import * as accountService from '../services/accountService';
import { accountConfigSchema, categorySchema } from '../validation/schemas';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const createAccountSchema = z.object({
  name: z.string().min(1).max(100),
  category: categorySchema,
  loanDetails: z.object({
    interestRate: z.number().min(0),
    remainingYears: z.number().min(0),
    originalAmount: z.number().optional(),
  }).optional(),
});

router.get('/', authMiddleware, async (req, res) => {
  const accounts = await accountService.getAccounts(req.userId);
  res.json({ data: accounts });
});

router.post('/', authMiddleware, async (req, res) => {
  const { name, category, loanDetails } = createAccountSchema.parse(req.body);
  const account = await accountService.createAccount(req.userId, name, category, loanDetails);
  res.status(201).json({ data: account });
});

router.patch('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const account = await accountService.updateAccount(req.userId, id, updates);
  res.json({ data: account });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  await accountService.deleteAccount(req.userId, id);
  res.status(204).send();
});

export default router;
```

## Dependencies

- 078-FEATURE-account-service

---

**Next Steps**: Create snapshot routes (083)
