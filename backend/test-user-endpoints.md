# User API Endpoints Testing Guide

This document provides test cases for the User Management API endpoints.

## Prerequisites

1. Backend server running: `pnpm --filter backend dev`
2. CosmosDB Emulator running: `.\emulator.bat`
3. Development mode enabled (for mock authentication)

## Base URL
```
http://localhost:3000/api/v1
```

## Test Cases

### 1. GET /users/me - Get Current User (Not Found)

**Test**: First-time user (doesn't exist yet)

**Request**:
```bash
curl -X GET http://localhost:3000/api/v1/users/me
```

**Expected Response** (404):
```json
{
  "error": {
    "message": "User not found. Please complete setup.",
    "code": "NOT_FOUND"
  },
  "success": false
}
```

---

### 2. POST /users/me/setup - Setup User (Success)

**Test**: Create new user with username

**Request**:
```bash
curl -X POST http://localhost:3000/api/v1/users/me/setup \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser123", "email": "test@finans.no"}'
```

**Expected Response** (201):
```json
{
  "data": {
    "id": "dev-user-123",
    "username": "testuser123",
    "email": "test@finans.no",
    "createdAt": "2025-11-29T08:00:00.000Z"
  },
  "success": true
}
```

---

### 3. POST /users/me/setup - Invalid Username (Validation Error)

**Test**: Username with invalid characters

**Request**:
```bash
curl -X POST http://localhost:3000/api/v1/users/me/setup \
  -H "Content-Type: application/json" \
  -d '{"username": "test@user!", "email": "test@finans.no"}'
```

**Expected Response** (400):
```json
{
  "error": {
    "message": "Username must be 3-20 characters (alphanumeric and underscores only)",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "username",
      "value": "test@user!",
      "pattern": "3-20 characters, a-z, A-Z, 0-9, _"
    }
  },
  "success": false
}
```

---

### 4. POST /users/me/setup - Username Too Short

**Test**: Username less than 3 characters

**Request**:
```bash
curl -X POST http://localhost:3000/api/v1/users/me/setup \
  -H "Content-Type: application/json" \
  -d '{"username": "ab"}'
```

**Expected Response** (400):
```json
{
  "error": {
    "message": "Username must be 3-20 characters (alphanumeric and underscores only)",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "username",
      "value": "ab",
      "pattern": "3-20 characters, a-z, A-Z, 0-9, _"
    }
  },
  "success": false
}
```

---

### 5. POST /users/me/setup - Missing Username

**Test**: Request without username field

**Request**:
```bash
curl -X POST http://localhost:3000/api/v1/users/me/setup \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response** (400):
```json
{
  "error": {
    "message": "Username is required",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "username"
    }
  },
  "success": false
}
```

---

### 6. POST /users/me/setup - Username Already Taken (Conflict)

**Test**: Try to create user with username that already exists

**Request**:
```bash
# First create a user
curl -X POST http://localhost:3000/api/v1/users/me/setup \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe"}'

# Then try to setup again (should fail)
curl -X POST http://localhost:3000/api/v1/users/me/setup \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe"}'
```

**Expected Response** (409):
```json
{
  "error": {
    "message": "User already set up",
    "code": "CONFLICT",
    "details": {
      "username": "johndoe"
    }
  },
  "success": false
}
```

---

### 7. GET /users/me - Get Current User (Success)

**Test**: Get user profile after setup

**Request**:
```bash
curl -X GET http://localhost:3000/api/v1/users/me
```

**Expected Response** (200):
```json
{
  "data": {
    "id": "dev-user-123",
    "username": "testuser123",
    "email": "test@finans.no",
    "createdAt": "2025-11-29T08:00:00.000Z"
  },
  "success": true
}
```

---

### 8. PATCH /users/me - Update User Email

**Test**: Update user email

**Request**:
```bash
curl -X PATCH http://localhost:3000/api/v1/users/me \
  -H "Content-Type: application/json" \
  -d '{"email": "newemail@finans.no"}'
```

**Expected Response** (200):
```json
{
  "data": {
    "id": "dev-user-123",
    "username": "testuser123",
    "email": "newemail@finans.no",
    "createdAt": "2025-11-29T08:00:00.000Z"
  },
  "success": true
}
```

---

### 9. PATCH /users/me - Update User Preferences

**Test**: Update user preferences

**Request**:
```bash
curl -X PATCH http://localhost:3000/api/v1/users/me \
  -H "Content-Type: application/json" \
  -d '{"preferences": {"theme": "dark", "locale": "nb"}}'
```

**Expected Response** (200):
```json
{
  "data": {
    "id": "dev-user-123",
    "username": "testuser123",
    "email": "test@finans.no",
    "createdAt": "2025-11-29T08:00:00.000Z",
    "preferences": {
      "theme": "dark",
      "locale": "nb"
    }
  },
  "success": true
}
```

---

### 10. PATCH /users/me - Invalid Email Format

**Test**: Update with invalid email

**Request**:
```bash
curl -X PATCH http://localhost:3000/api/v1/users/me \
  -H "Content-Type: application/json" \
  -d '{"email": "not-an-email"}'
```

**Expected Response** (400):
```json
{
  "error": {
    "message": "Invalid email format",
    "code": "VALIDATION_ERROR",
    "details": {
      "field": "email",
      "value": "not-an-email"
    }
  },
  "success": false
}
```

---

### 11. PATCH /users/me - Attempt to Update Blocked Field (username)

**Test**: Try to update username (should be blocked)

**Request**:
```bash
curl -X PATCH http://localhost:3000/api/v1/users/me \
  -H "Content-Type: application/json" \
  -d '{"username": "newusername"}'
```

**Expected Response** (400):
```json
{
  "error": {
    "message": "Cannot update id, username, or createdAt",
    "code": "VALIDATION_ERROR",
    "details": {
      "blockedFields": ["id", "username", "createdAt"],
      "attempted": ["username"]
    }
  },
  "success": false
}
```

---

### 12. PATCH /users/me - Empty Update Request

**Test**: Update with no fields

**Request**:
```bash
curl -X PATCH http://localhost:3000/api/v1/users/me \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response** (400):
```json
{
  "error": {
    "message": "At least one field to update is required",
    "code": "VALIDATION_ERROR",
    "details": {
      "fields": []
    }
  },
  "success": false
}
```

---

## Testing Workflow

1. **Clean start**: Delete user from CosmosDB (if exists)
2. **Test GET /users/me**: Should return 404 (user not found)
3. **Test POST /users/me/setup**: Create user successfully (201)
4. **Test GET /users/me**: Should return user (200)
5. **Test PATCH /users/me**: Update email/preferences (200)
6. **Test validation errors**: Invalid inputs (400, 409)

## Notes

- Development mode uses mock user: `dev-user-123`
- Production requires valid EasyAuth header
- All endpoints require authentication (validateAuth middleware)
- Winston logger outputs structured logs for debugging
