---
name: node-backend
description: Build Express endpoints following project patterns. Use when adding new API routes, creating services, refactoring controllers, or working with CosmosDB. Ensures consistent architecture, error handling, and validation.
---

# Node.js Backend Patterns

Patterns for building and maintaining the Finans Express backend with CosmosDB.

## When to Use This Skill

- Adding new API endpoints
- Creating or modifying services
- Refactoring controllers
- Working with CosmosDB queries
- Implementing validation
- Debugging backend issues

## Architecture Overview

```
Controller (HTTP layer)
    “ calls
Service (Business logic + data access)
    “ uses
CosmosDB (via @azure/cosmos SDK)
```

**Key principles:**
- No DI container - use direct imports
- Services combine business logic and data access (no separate repository layer)
- Controllers delegate to services, never access DB directly
- Feature-based organization

## Creating New Endpoints

### Step 1: Define Route

**File:** `src/routes/{feature}Routes.ts`

```typescript
import { Router } from 'express';
import { validateBody, validateParams } from '../middleware/validate';
import { validateAuth } from '../middleware/auth';
import { createResourceSchema, resourceIdSchema } from '../validators/schemas';
import { createResource, getResource } from '../controllers/resourceController';

const router = Router();

// Public route (no auth)
router.get('/public/:id', validateParams(resourceIdSchema), getResource);

// Protected route (requires auth)
router.post('/', validateAuth, validateBody(createResourceSchema), createResource);

export default router;
```

**Middleware order:** `validateParams/Query` ’ `validateAuth` ’ `validateBody` ’ `businessValidators` ’ `controller`

### Step 2: Create Zod Schema

**File:** `src/validators/schemas.ts`

```typescript
import { z } from 'zod';

export const createResourceSchema = z.object({
  name: z.string().min(1).max(100),
  value: z.number().positive(),
  category: z.enum(['a', 'b', 'c']),
});

export const resourceIdSchema = z.object({
  id: z.string().min(1),
});

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
```

### Step 3: Create Controller

**File:** `src/controllers/{feature}Controller.ts`

```typescript
import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { NotFoundError, ConflictError } from '../errors';
import { createResource as createResourceService, getResourceById } from '../services/resourceService';
import { logger } from '../utils/logger';

/**
 * Get resource by ID
 * GET /api/v1/resources/:id
 */
export const getResource = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const resource = await getResourceById(id);
  if (!resource) {
    throw new NotFoundError('Resource not found');
  }

  res.json({ data: resource, success: true });
});

/**
 * Create new resource
 * POST /api/v1/resources
 */
export const createResource = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const input = req.body;

  logger.debug('Creating resource', { userId, name: input.name });

  const resource = await createResourceService(userId, input);

  logger.info('Resource created', { userId, resourceId: resource.id });
  res.status(201).json({ data: resource, success: true });
});
```

**Controller rules:**
- Always use `asyncHandler` wrapper
- Throw error classes - never catch/format manually
- Access user via `req.user!.userId`
- Return `{ data, success: true }` for success
- Log at debug (input), info (success), error (failures)

### Step 4: Create Service

**File:** `src/services/{feature}Service.ts`

```typescript
import { getResourcesContainer } from '../config/cosmosdb';
import { Resource } from '../models/Resource';
import { logger } from '../utils/logger';
import { handleCosmosError, isNotFoundError, buildParameterizedQuery } from '../utils/cosmosHelpers';

/**
 * Get resource by ID (point read - fast)
 */
export async function getResourceById(id: string): Promise<Resource | null> {
  try {
    const container = getResourcesContainer();
    const { resource } = await container.item(id, id).read<Resource>();
    return resource || null;
  } catch (error) {
    if (isNotFoundError(error)) return null;
    logger.error('Failed to get resource', { id, error });
    throw handleCosmosError(error);
  }
}

/**
 * Create new resource
 */
export async function createResource(userId: string, input: CreateResourceInput): Promise<Resource> {
  try {
    const container = getResourcesContainer();

    const resource: Resource = {
      id: generateId(),
      userId,
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const { resource: created } = await container.items.create(resource);
    logger.info('Resource created', { id: created!.id, userId });
    return created as Resource;
  } catch (error) {
    logger.error('Failed to create resource', { userId, error });
    throw handleCosmosError(error);
  }
}

/**
 * Query resources by user (partition-scoped - fast)
 */
export async function getResourcesByUser(userId: string): Promise<Resource[]> {
  try {
    const container = getResourcesContainer();
    const querySpec = buildParameterizedQuery(
      'SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC',
      { userId }
    );

    const { resources } = await container.items
      .query<Resource>(querySpec, { partitionKey: userId })
      .fetchAll();

    return resources;
  } catch (error) {
    logger.error('Failed to query resources', { userId, error });
    throw handleCosmosError(error);
  }
}
```

### Step 5: Define Model

**File:** `src/models/{Feature}.ts`

```typescript
export interface Resource {
  id: string;
  userId: string;
  name: string;
  value: number;
  category: 'a' | 'b' | 'c';
  createdAt: Date;
  updatedAt: Date;
}
```

Use interfaces, not classes. Keep models pure data structures.

## Error Handling

### Error Classes

**File:** `src/errors/AppError.ts`

| Class | Status | Code | Use Case |
|-------|--------|------|----------|
| `ValidationError` | 400 | VALIDATION_ERROR | Invalid input |
| `ForbiddenError` | 403 | FORBIDDEN | Not authorized |
| `NotFoundError` | 404 | NOT_FOUND | Resource doesn't exist |
| `ConflictError` | 409 | CONFLICT | Duplicate, state conflict |
| `InternalServerError` | 500 | INTERNAL_SERVER_ERROR | Unexpected failures |

### Usage in Controllers

```typescript
import { NotFoundError, ConflictError, ValidationError } from '../errors';

// Resource not found
if (!resource) throw new NotFoundError('Resource not found');

// Duplicate
if (existing) throw new ConflictError('Resource already exists');

// Business rule violation
if (value < 0) throw new ValidationError('Value must be positive');
```

### Global Error Handler

All thrown errors are caught by `errorHandler` middleware and formatted as:

```json
{
  "error": {
    "message": "Resource not found",
    "code": "NOT_FOUND",
    "details": {}
  },
  "success": false
}
```

**Never manually catch/format errors in controllers.** Let errors propagate to the global handler.

## Validation

### Two-Layer Validation

**Layer 1: Input Validation (Zod)**
- Validates request shape
- Runs before controller
- Returns 400 with field errors

```typescript
// middleware/validate.ts
router.post('/', validateBody(createResourceSchema), controller);
```

**Layer 2: Business Validation**
- Checks DB constraints (uniqueness, references)
- Custom middleware functions
- Returns 409 Conflict, 404 Not Found, etc.

```typescript
// validators/businessValidators.ts
export const validateResourceExists = asyncHandler(async (req, res, next) => {
  const resource = await getResourceById(req.params.id);
  if (!resource) throw new NotFoundError('Resource not found');
  req.resource = resource; // Attach for controller
  next();
});

// Route with business validation
router.patch('/:id', validateParams(idSchema), validateAuth, validateResourceExists, updateResource);
```

## CosmosDB Patterns

### Container Access

```typescript
import { getResourcesContainer } from '../config/cosmosdb';

const container = getResourcesContainer();
```

### Point Read (Fast)

When you have both id and partition key:

```typescript
const { resource } = await container.item(id, partitionKey).read<Resource>();
```

### Partition-Scoped Query (Fast)

Query within a single partition:

```typescript
const querySpec = buildParameterizedQuery(
  'SELECT * FROM c WHERE c.status = @status',
  { status: 'active' }
);

const { resources } = await container.items
  .query<Resource>(querySpec, { partitionKey: userId })
  .fetchAll();
```

### Cross-Partition Query (Slow - Avoid)

Queries without partition key are expensive:

```typescript
// WARNING: Cross-partition query - use sparingly
const { resources } = await container.items
  .query<Resource>(querySpec)
  .fetchAll();
```

### Error Handling

Always wrap CosmosDB operations:

```typescript
import { handleCosmosError, isNotFoundError } from '../utils/cosmosHelpers';

try {
  // CosmosDB operation
} catch (error) {
  if (isNotFoundError(error)) return null;
  throw handleCosmosError(error); // Converts to AppError
}
```

## Authentication

### Middleware

```typescript
import { validateAuth } from '../middleware/auth';

router.get('/protected', validateAuth, controller);
```

### Accessing User

After `validateAuth`, user is available on request:

```typescript
export const controller = asyncHandler(async (req, res) => {
  const userId = req.user!.userId;
  const email = req.user?.email;
  const provider = req.user?.provider; // 'google' | 'facebook' | 'demo'
});
```

### Auth Flow

1. **Production**: EasyAuth validates OAuth, sets `x-ms-client-principal-*` headers
2. **Development**: JWT token or auto-inject dev user
3. **Demo**: HMAC-signed demo tokens

## Response Format

### Success

```typescript
res.json({ data: resource, success: true });
res.status(201).json({ data: created, success: true });
res.status(204).send(); // No content
```

### Error (Automatic)

Thrown errors are formatted by global handler:

```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [{ "field": "name", "message": "Required" }]
  },
  "success": false
}
```

## Logging

### Logger Usage

```typescript
import { logger } from '../utils/logger';

logger.debug('Processing request', { userId, action: 'create' });
logger.info('Resource created', { resourceId: id });
logger.warn('Deprecated endpoint called', { path: req.path });
logger.error('Operation failed', { userId, error: err.message });
```

### Context Injection

`requestId` and `userId` are automatically injected via AsyncLocalStorage. No need to pass them manually.

### Log Levels

- **debug**: Detailed info for debugging (not logged in production)
- **info**: Normal operations, success events
- **warn**: Recoverable issues, deprecation notices
- **error**: Failures, exceptions

## Checklist for New Endpoints

- [ ] Route defined in `routes/{feature}Routes.ts`
- [ ] Route registered in `routes/index.ts`
- [ ] Zod schema in `validators/schemas.ts`
- [ ] Controller uses `asyncHandler`
- [ ] Controller throws errors (no manual catch)
- [ ] Service uses `handleCosmosError`
- [ ] Model interface in `models/`
- [ ] Appropriate middleware (auth, validation)
- [ ] Logging at key points
- [ ] Tests written

## File Reference

| Purpose | Location |
|---------|----------|
| Routes | `src/routes/{feature}Routes.ts` |
| Controllers | `src/controllers/{feature}Controller.ts` |
| Services | `src/services/{feature}Service.ts` |
| Models | `src/models/{Feature}.ts` |
| Zod Schemas | `src/validators/schemas.ts` |
| Business Validators | `src/validators/businessValidators.ts` |
| Error Classes | `src/errors/AppError.ts` |
| CosmosDB Config | `src/config/cosmosdb.ts` |
| CosmosDB Helpers | `src/utils/cosmosHelpers.ts` |
| Auth Middleware | `src/middleware/auth.ts` |
| Validation Middleware | `src/middleware/validate.ts` |
| Error Handler | `src/middleware/errorHandler.ts` |
| Logger | `src/utils/logger.ts` |
