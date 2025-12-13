# FEATURE: Account API Routes

**Status**: Backlog
**Created**: 2025-11-30
**Updated**: 2025-11-30
**Priority**: Medium
**Labels**: backend, api, routes
**Estimated Effort**: Medium - 1 hour

## Context & Motivation

Create API routes for account configuration management. Accounts are embedded in User document but need dedicated endpoints for CRUD operations.

**Current state**: No account-specific routes. User routes exist at `/api/v1/users`.

## Desired Outcome

REST endpoints for CRUD operations on user accounts, following patterns from userRoutes.

## Acceptance Criteria

- [x] Create `/backend/src/routes/accountRoutes.ts`
- [x] Create `/backend/src/controllers/accountController.ts`
- [x] `GET /api/v1/accounts` - Get all user's accounts
- [x] `GET /api/v1/accounts/active` - Get only active accounts
- [x] `POST /api/v1/accounts` - Create new account
- [x] `PATCH /api/v1/accounts/:id` - Update account
- [x] `DELETE /api/v1/accounts/:id` - Soft delete (isActive: false)
- [x] Add Zod validation schemas for account operations
- [x] Mount routes in `/backend/src/routes/index.ts`
- [x] Add JSDoc comments

## Technical Approach

### Controller

```typescript
// /backend/src/controllers/accountController.ts

import { Request, Response, NextFunction } from 'express';
import * as accountService from '../services/accountService';
import { logger } from '../utils/logger';
import { AppError } from '../utils/errors';

/**
 * GET /api/v1/accounts
 * Get all accounts for authenticated user
 */
export async function getAllAccounts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const accounts = await accountService.getAccounts(userId);

    res.json({
      data: accounts,
      success: true
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/accounts/active
 * Get only active accounts
 */
export async function getActiveAccounts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const accounts = await accountService.getActiveAccounts(userId);

    res.json({
      data: accounts,
      success: true
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/accounts
 * Create new account
 */
export async function createAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const account = await accountService.createAccount(userId, req.body);

    res.status(201).json({
      data: account,
      success: true
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/accounts/:id
 * Update account
 */
export async function updateAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const account = await accountService.updateAccount(userId, id, req.body);

    res.json({
      data: account,
      success: true
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/accounts/:id
 * Soft delete account
 */
export async function deleteAccount(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    await accountService.deleteAccount(userId, id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
```

### Routes

```typescript
// /backend/src/routes/accountRoutes.ts

import { Router, IRouter } from 'express';
import {
  getAllAccounts,
  getActiveAccounts,
  createAccount,
  updateAccount,
  deleteAccount
} from '../controllers/accountController';
import { validateBody } from '../middleware/validate';
import { createAccountSchema, updateAccountSchema } from '../validators/schemas';

const router: IRouter = Router();

router.get('/', getAllAccounts);
router.get('/active', getActiveAccounts);
router.post('/', validateBody(createAccountSchema), createAccount);
router.patch('/:id', validateBody(updateAccountSchema), updateAccount);
router.delete('/:id', deleteAccount);

export default router;
```

### Validation Schemas

```typescript
// Add to /backend/src/validators/schemas.ts

export const createAccountSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(['sparing', 'gjeld', 'pensjon']),
  isActive: z.boolean().default(true),
  loanDetails: z.object({
    interestRate: z.number().min(0).max(100),
    remainingYears: z.number().min(0).max(50),
    originalAmount: z.number().positive().optional(),
  }).optional(),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
  loanDetails: z.object({
    interestRate: z.number().min(0).max(100),
    remainingYears: z.number().min(0).max(50),
    originalAmount: z.number().positive().optional(),
  }).optional(),
});
```

### Mount in index.ts

```typescript
// Add to /backend/src/routes/index.ts

import accountRoutes from './accountRoutes';

// Add with other protected routes
router.use('/accounts', validateAuth, accountRoutes);
```

## Dependencies

- 078-FEATURE-account-service
- Validation framework (already exists)
- Auth middleware (already exists)

---

## Progress Log

**2025-11-30 Implementation Complete**

### Files Modified
- `backend/src/validators/schemas.ts` - Added account config validation schemas (createAccountConfigSchema, updateAccountConfigSchema, accountConfigIdSchema)
- `backend/src/routes/accountRoutes.ts` - Updated schema imports to use correct names (already existed)
- `backend/src/routes/index.ts` - Added import and mount of accountRoutes with validateAuth
- `backend/src/routes/devRoutes.ts` - Fixed TypeScript type annotation issue
- `backend/package.json` - Added uuid and @types/uuid dependencies

### Files Already Existed
- `backend/src/controllers/accountController.ts` - Fully implemented with all 5 endpoints and proper JSDoc
- `backend/src/routes/accountRoutes.ts` - Properly structured with all routes and validation middleware

### Summary
All 10 acceptance criteria completed. Account API routes are fully functional with:
- Complete CRUD endpoints for account management
- Proper validation schemas with category-specific logic
- Authentication middleware on all routes
- Comprehensive JSDoc comments
- Error handling via try/catch and next(error)
- TypeScript strict mode compliance
- Build passes successfully

**Next Steps**: Consider calculation service (080) or page endpoints (084-087)
