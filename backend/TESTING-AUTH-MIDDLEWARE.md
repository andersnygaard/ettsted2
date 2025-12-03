# Testing EasyAuth Middleware

Guide for testing the Azure EasyAuth authentication middleware.

## Overview

The middleware uses Azure EasyAuth headers (set automatically by Azure for valid tokens):
- `x-ms-client-principal-id` - User ID from OAuth provider
- `x-ms-client-principal-name` - Email address
- `x-ms-client-principal-idp` - Identity provider (google/facebook)

No custom token validation - Azure handles all validation.

## Prerequisites

1. Install dependencies:
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

### Test 1: Development Mode Bypass

**Description**: In development mode, requests without auth headers use mock user.

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

---

### Test 2: Valid EasyAuth Headers

**Description**: Valid EasyAuth headers authenticate successfully.

**Request**:
```bash
curl http://localhost:3000/api/v1/test/me \
  -H "x-ms-client-principal-id: google|123456789" \
  -H "x-ms-client-principal-name: test@example.com" \
  -H "x-ms-client-principal-idp: google"
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

---

### Test 3: Missing Header (Production Mode)

**Description**: In production mode, missing auth headers return 401.

**Request**:
```bash
NODE_ENV=production curl http://localhost:3000/api/v1/test/me
```

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

---

### Test 4: Partial Headers

**Description**: Only `x-ms-client-principal-id` is required.

**Request** (minimal):
```bash
curl http://localhost:3000/api/v1/test/me \
  -H "x-ms-client-principal-id: user123"
```

**Expected Response** (200 OK):
```json
{
  "data": {
    "message": "Authentication successful",
    "user": {
      "userId": "user123",
      "provider": "google"
    }
  },
  "success": true
}
```

---

### Test 5: Public Route (Health Check)

**Description**: Public routes work without authentication.

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

---

## Checklist

- [x] Middleware reads `x-ms-client-principal-id` header
- [x] Middleware reads `x-ms-client-principal-name` header (optional)
- [x] Middleware reads `x-ms-client-principal-idp` header (optional)
- [x] Returns 401 if `x-ms-client-principal-id` missing (production mode)
- [x] Development mode bypass with mock user
- [x] TypeScript types for Express Request.user

---

## Troubleshooting

**Issue**: Development bypass not working
**Solution**: Verify `NODE_ENV=development` in `.env` file

**Issue**: Getting 401 in production
**Solution**: Ensure Azure EasyAuth is properly configured on the App Service
