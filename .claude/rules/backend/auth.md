---
paths:
  - backend/**/*
---

# Auth Rules

## Stack
Azure EasyAuth, JWT (jsonwebtoken), HMAC-SHA256 demo tokens

## Structure
- `/middleware/auth.ts` - validateAuth middleware
- `/routes/authRoutes.ts` - Demo login, demo profiles
- `/utils/tokenUtils.ts` - Demo token generation/verification

## Patterns
- Multi-layer: Bearer JWT → EasyAuth header → Demo token
- JWT decoded WITHOUT signature validation (EasyAuth pre-validates)
- User attached to `req.user`: userId, email, name, provider
- Provider detection from JWT issuer (google, facebook, demo, unknown)

## Decisions
- No expiration check on OAuth tokens (EasyAuth handles upstream)
- Demo tokens expire in 24h, use HMAC-SHA256 signature
- Demo login PUBLIC endpoint (rate limited at 5 req/15min)

## Gotchas
- EasyAuth header is base64-encoded JSON, decode with Buffer.from()
- Demo token secret from `JWT_SECRET` env var
- Dev mode: auth middleware injects mock user if no header present
- Never proceed without valid auth on protected routes (fail-safe)
