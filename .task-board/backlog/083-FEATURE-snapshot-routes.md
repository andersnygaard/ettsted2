# FEATURE: Snapshot API Routes

**Status**: Backlog
**Created**: 2025-11-30
**Priority**: High
**Labels**: backend, api, routes
**Estimated Effort**: Simple - 45 min

## Context & Motivation

Create API routes for monthly snapshot management.

## Desired Outcome

REST endpoints for CRUD operations on snapshots.

## Acceptance Criteria

- [ ] Create `/backend/src/routes/snapshotRoutes.ts`
- [ ] `GET /api/v1/snapshots` - Get all snapshots (paginated)
- [ ] `GET /api/v1/snapshots/:date` - Get snapshot for specific month
- [ ] `POST /api/v1/snapshots` - Create new monthly snapshot
- [ ] `PATCH /api/v1/snapshots/:id` - Update existing snapshot
- [ ] `DELETE /api/v1/snapshots/:id` - Delete snapshot
- [ ] Validate input with Zod schemas

## Technical Approach

```typescript
// /backend/src/routes/snapshotRoutes.ts

import { Router } from 'express';
import * as snapshotService from '../services/snapshotService';
import { accountBalanceSchema } from '../validation/schemas';
import { authMiddleware } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

const createSnapshotSchema = z.object({
  date: z.string().transform(s => new Date(s)),
  balances: z.array(accountBalanceSchema),
});

router.get('/', authMiddleware, async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  const snapshots = await snapshotService.getSnapshots(req.userId, { limit, offset });
  res.json({ data: snapshots });
});

router.get('/:date', authMiddleware, async (req, res) => {
  const date = new Date(req.params.date);
  const snapshot = await snapshotService.getSnapshotByDate(req.userId, date);

  if (!snapshot) {
    return res.status(404).json({ error: 'Snapshot not found' });
  }

  res.json({ data: snapshot });
});

router.post('/', authMiddleware, async (req, res) => {
  const { date, balances } = createSnapshotSchema.parse(req.body);
  const snapshot = await snapshotService.createSnapshot(req.userId, date, balances);
  res.status(201).json({ data: snapshot });
});

router.patch('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { balances } = z.object({ balances: z.array(accountBalanceSchema) }).parse(req.body);
  const snapshot = await snapshotService.updateSnapshot(id, req.userId, balances);
  res.json({ data: snapshot });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  await snapshotService.deleteSnapshot(id, req.userId);
  res.status(204).send();
});

export default router;
```

## Dependencies

- 079-FEATURE-snapshot-service

---

**Next Steps**: Create dashboard endpoint (084)
