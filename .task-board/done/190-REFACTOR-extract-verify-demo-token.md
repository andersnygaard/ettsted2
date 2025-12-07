# 190 - Extract Duplicate verifyDemoToken Function

**Type**: REFACTOR
**Priority**: High
**Effort**: Small (1 hour)
**Labels**: backend, dry, code-quality

---

## Context

The due diligence audit (2025-12-07) found the `verifyDemoToken()` function duplicated in two files with identical logic. Bug fixes would need to be made in two places.

## Problem

`verifyDemoToken()` exists in both:
- `backend/src/middleware/auth.ts` (lines 47-78)
- `backend/src/routes/authRoutes.ts` (lines 56-94)

Both implementations are nearly identical, performing JWT verification with HMAC-SHA256.

## Locations

- [auth.ts:47-78](../backend/src/middleware/auth.ts#L47-L78)
- [authRoutes.ts:56-94](../backend/src/routes/authRoutes.ts#L56-L94)

## Acceptance Criteria

- [ ] Create shared utility for token verification
- [ ] Remove duplicate implementations
- [ ] Both auth.ts and authRoutes.ts import from shared utility
- [ ] Token verification behavior unchanged
- [ ] TypeScript compiles without errors
- [ ] All tests pass

## Technical Approach

1. Create `backend/src/utils/tokenUtils.ts`:
   ```typescript
   import crypto from 'crypto';

   const DEMO_JWT_SECRET = process.env.DEMO_JWT_SECRET || 'demo-secret-key';

   export interface DemoTokenPayload {
     userId: string;
     email: string;
     nickname: string;
     provider: string;
     exp: number;
   }

   export function verifyDemoToken(token: string): DemoTokenPayload | null {
     // Extract implementation from auth.ts
   }
   ```

2. Update auth.ts to import and use shared function

3. Update authRoutes.ts to import and use shared function

4. Delete duplicate implementations

## Related

- Due diligence report: [.docs/DUE-DILIGENCE-REPORT.md](../.docs/DUE-DILIGENCE-REPORT.md)
