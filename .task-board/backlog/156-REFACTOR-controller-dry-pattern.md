# Refactor Controllers to DRY Pattern

## Summary
Refactor all backend controllers to use `asyncHandler` wrapper and throw error classes instead of manual try-catch with inline error formatting.

## Problem
Current controllers have repetitive error handling:
- Each function wraps logic in try-catch
- Error responses are manually formatted in every catch block
- Custom error classes exist but aren't used
- `asyncHandler` exists but isn't used

## Solution
Use existing infrastructure:
1. Wrap handlers with `asyncHandler` (from `middleware/errorHandler.ts`)
2. Throw error classes (`NotFoundError`, `ConflictError`, etc.)
3. Let global error handler format responses
4. Remove duplicate try-catch blocks

## Before/After Example

**Before:**
```typescript
export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await getUserById(req.user!.userId);
    if (!user) {
      res.status(404).json({
        error: { message: 'User not found', code: 'NOT_FOUND' },
        success: false
      });
      return;
    }
    res.status(200).json({ data: user, success: true });
  } catch (error) {
    res.status(500).json({
      error: { message: 'Failed to fetch user', code: 'INTERNAL_SERVER_ERROR' },
      success: false
    });
  }
}
```

**After:**
```typescript
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await getUserById(req.user!.userId);
  if (!user) throw new NotFoundError('User not found');
  res.json({ data: user, success: true });
});
```

## Files to Refactor

| File | Functions |
|------|-----------|
| `controllers/userController.ts` | getCurrentUser, setupUser, updateUser, deleteMe |
| `controllers/accountController.ts` | All handlers |
| `controllers/snapshotController.ts` | All handlers |
| `controllers/calculatorController.ts` | All handlers |
| `controllers/importController.ts` | All handlers |
| `controllers/onboardingController.ts` | All handlers |

## Implementation Steps

1. Add import: `import { asyncHandler } from '../middleware/errorHandler'`
2. Add import: `import { NotFoundError, ConflictError, ValidationError } from '../errors'`
3. For each function:
   - Change `async function name(req, res): Promise<void>` to `const name = asyncHandler(async (req, res) => { ... })`
   - Remove outer try-catch
   - Replace `res.status(4xx).json({ error: ... })` with `throw new XxxError('message')`
   - Keep success response as-is
4. Export functions remain the same (named exports)

## Checklist per Controller

- [ ] userController.ts
- [ ] accountController.ts
- [ ] snapshotController.ts
- [ ] calculatorController.ts
- [ ] importController.ts
- [ ] onboardingController.ts

## Testing

After refactoring each controller:
1. Run existing tests (if any)
2. Manually test endpoints return correct status codes
3. Verify error responses match expected format

## Priority
Medium - Improves maintainability, reduces code duplication

## Effort
Small-Medium - Mechanical refactor, low risk
