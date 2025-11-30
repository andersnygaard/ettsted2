# FEATURE: User API Routes

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, api, routes
**Estimated Effort**: Simple - 45 min

## Context & Motivation

Create API routes for user and profile management.

## Desired Outcome

REST endpoints for getting and updating user data.

## Acceptance Criteria

- [ ] Update `/backend/src/routes/userRoutes.ts`
- [ ] `GET /api/v1/users/me` - Get current user with profile & accounts
- [ ] `POST /api/v1/users/me/setup` - Initial setup (nickname, email, profile)
- [ ] `PATCH /api/v1/users/me/profile` - Update profile (salary, expenses, etc.)
- [ ] Use auth middleware to get userId from token
- [ ] Validate input with Zod schemas

## Technical Approach

```typescript
// /backend/src/routes/userRoutes.ts

import { Router } from 'express';
import { getUserById, createUser, updateProfile } from '../services/userService';
import { userProfileSchema } from '../validation/schemas';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const user = await getUserById(userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ data: user });
});

router.post('/me/setup', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { nickname, email, profile } = req.body;

  const validatedProfile = userProfileSchema.parse(profile);
  const user = await createUser(userId, nickname, email, validatedProfile);

  res.status(201).json({ data: user });
});

router.patch('/me/profile', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const updates = userProfileSchema.partial().parse(req.body);

  const user = await updateProfile(userId, updates);
  res.json({ data: user });
});

export default router;
```

## Dependencies

- 077-FEATURE-user-service
- 076-FEATURE-validation-schemas

---

**Next Steps**: Create account routes (082)
