# Testing EasyAuth Middleware

This guide provides step-by-step instructions to manually test the EasyAuth authentication middleware.

## Prerequisites

1. Install dependencies (from project root):
   ```bash
   pnpm install
   ```

2. Ensure backend `.env` file is configured:
   ```bash
   NODE_ENV=development
   PORT=3000
   ```

3. Start the backend server:
   ```bash
   pnpm --filter backend dev
   ```

## Test Cases

### Test 1: Development Mode Bypass (No Header)

**Description**: In development mode, requests without auth header should work with mock user.

**Setup**: Ensure `NODE_ENV=development` in `.env`

**Request**:
```bash
curl http://localhost:3000/api/v1/test/me
```

**Expected Response** (200 OK):
```json
{
  "data": {
    "message": "Authentication successful",
    "user": {
      "userId": "dev-user-123",
      "email": "dev@finans.no",
      "provider": "google"
    }
  },
  "success": true
}
```

**Verification**:
- ✅ Status code is 200
- ✅ Response contains mock user data
- ✅ userId is "dev-user-123"
- ✅ Server logs show "Development mode: Using mock user"

---

### Test 2: Valid EasyAuth Header

**Description**: Valid Base64-encoded EasyAuth header should authenticate successfully.

**Setup**: Create a valid header (Base64-encoded JSON)

**Create Test Header**:
```javascript
// Node.js command to generate test header
const claims = {
  userId: "google|123456789",
  userDetails: "test@example.com",
  identityProvider: "google",
  auth_typ: "aad"
};
const header = Buffer.from(JSON.stringify(claims)).toString('base64');
console.log(header);
```

**Request**:
```bash
curl http://localhost:3000/api/v1/test/me \
  -H "x-ms-client-principal: eyJ1c2VySWQiOiJnb29nbGV8MTIzNDU2Nzg5IiwidXNlckRldGFpbHMiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWRlbnRpdHlQcm92aWRlciI6Imdvb2dsZSIsImF1dGhfdHlwIjoiYWFkIn0="
```

**Expected Response** (200 OK):
```json
{
  "data": {
    "message": "Authentication successful",
    "user": {
      "userId": "google|123456789",
      "email": "test@example.com",
      "provider": "google"
    }
  },
  "success": true
}
```

**Verification**:
- ✅ Status code is 200
- ✅ userId matches header claims
- ✅ email matches header claims
- ✅ provider is "google"
- ✅ Server logs show "User authenticated successfully"

---

### Test 3: Missing Header (Production Mode)

**Description**: In production mode, missing auth header should return 401.

**Setup**: Set `NODE_ENV=production` in `.env` or override:

**Request**:
```bash
NODE_ENV=production curl http://localhost:3000/api/v1/test/me
```

Or temporarily modify the middleware to skip development bypass.

**Expected Response** (401 Unauthorized):
```json
{
  "error": {
    "message": "Authentication required",
    "code": "UNAUTHORIZED"
  },
  "success": false
}
```

**Verification**:
- ✅ Status code is 401
- ✅ Error message is clear
- ✅ Server logs show "Authentication failed: Missing x-ms-client-principal header"

---

### Test 4: Invalid/Malformed Header

**Description**: Invalid Base64 or malformed JSON should return 401.

**Test 4a: Invalid Base64**

**Request**:
```bash
curl http://localhost:3000/api/v1/test/me \
  -H "x-ms-client-principal: not-valid-base64!!!"
```

**Expected Response** (401 Unauthorized):
```json
{
  "error": {
    "message": "Invalid authentication token",
    "code": "INVALID_TOKEN"
  },
  "success": false
}
```

**Test 4b: Valid Base64 but Invalid JSON**

**Request**:
```bash
curl http://localhost:3000/api/v1/test/me \
  -H "x-ms-client-principal: $(echo -n 'not json' | base64)"
```

**Expected Response** (401 Unauthorized):
```json
{
  "error": {
    "message": "Invalid authentication token",
    "code": "INVALID_TOKEN"
  },
  "success": false
}
```

**Test 4c: Valid JSON but Missing Required Fields**

**Request**:
```bash
# Missing userId
CLAIMS='{"userDetails":"test@example.com","identityProvider":"google"}'
HEADER=$(echo -n $CLAIMS | base64)
curl http://localhost:3000/api/v1/test/me -H "x-ms-client-principal: $HEADER"
```

**Expected Response** (401 Unauthorized):
```json
{
  "error": {
    "message": "Invalid authentication token",
    "code": "INVALID_TOKEN"
  },
  "success": false
}
```

**Verification**:
- ✅ All malformed cases return 401
- ✅ Error code is "INVALID_TOKEN"
- ✅ Server logs show "Authentication failed: Error decoding" or "Invalid EasyAuth claims structure"

---

### Test 5: Public Route (Health Check)

**Description**: Public routes should work without authentication.

**Request**:
```bash
curl http://localhost:3000/api/v1/health
```

**Expected Response** (200 OK):
```json
{
  "data": {
    "status": "ok",
    "timestamp": "2025-11-29T08:00:00.000Z",
    "uptime": 123.456,
    "environment": "development"
  },
  "success": true
}
```

**Verification**:
- ✅ Health endpoint works without auth header
- ✅ Status code is 200

---

## TypeScript Type Checking

Verify that TypeScript recognizes the extended Request type:

**Test File**: Create a temporary test file
```typescript
// backend/src/test-types.ts
import { Request, Response } from 'express';
import { validateAuth } from './middleware/auth';

// This should compile without errors
function testHandler(req: Request, res: Response) {
  // After validateAuth middleware, req.user should be available
  if (req.user) {
    const userId: string = req.user.userId;
    const email: string | undefined = req.user.email;
    const provider: 'google' | 'facebook' = req.user.provider;

    console.log({ userId, email, provider });
  }
}
```

**Run Type Check**:
```bash
pnpm --filter backend type-check
```

**Expected**: No TypeScript errors

---

## Integration with Future Routes

When creating protected routes (users, snapshots, import), apply middleware like this:

```typescript
// Example: backend/src/routes/userRoutes.ts
import { Router } from 'express';
import { validateAuth } from '../middleware/auth';

const router = Router();

// All routes in this module will require authentication
// because validateAuth is applied at the route level in index.ts

router.get('/me', (req, res) => {
  const userId = req.user!.userId; // Safe to use non-null assertion
  // ... fetch user from database
});

export default router;
```

```typescript
// backend/src/routes/index.ts
import userRoutes from './userRoutes';
import { validateAuth } from '../middleware/auth';

// Apply auth middleware to entire route module
router.use('/users', validateAuth, userRoutes);
```

---

## Checklist

Use this checklist to verify all acceptance criteria:

- [ ] Middleware function `validateAuth` created
- [ ] Extracts and decodes `x-ms-client-principal` header
- [ ] Parses JSON to extract userId, email, identityProvider
- [ ] Attaches `req.user` object with typed interface
- [ ] Returns 401 if header missing on protected routes
- [ ] Returns 401 if header malformed or invalid
- [ ] Supports development mode bypass (mock user)
- [ ] TypeScript types extended for Express Request
- [ ] Test endpoint `/api/v1/test/me` works
- [ ] Server logs authentication events

---

## Troubleshooting

**Issue**: TypeScript doesn't recognize `req.user`
**Solution**: Ensure `typeRoots` is set in `tsconfig.json` and includes `./src/types`

**Issue**: Development bypass not working
**Solution**: Verify `NODE_ENV=development` in `.env` file

**Issue**: Header decoding fails
**Solution**: Ensure header is properly Base64-encoded. Use `btoa(JSON.stringify(claims))` in browser or `Buffer.from(...).toString('base64')` in Node.js

---

## Next Steps

After verifying all test cases:
1. Mark all acceptance criteria as complete
2. Update task progress log
3. Move task to `.task-board/done/`
4. Proceed to next task: `006-FEATURE-user-api-endpoints.md`
