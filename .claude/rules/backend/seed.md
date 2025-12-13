---
paths:
  - backend/**/*
---

# Seed Rules

## Stack
TypeScript, @azure/cosmos SDK, JSON fixtures

## Structure
- `/seed/seed.ts` - CLI seed script (`pnpm db:seed`)
- `/seed/reset.ts` - Programmatic reset (used by dev API + Playwright)
- `/seed/fixtures/` - JSON fixture files
  - `users.json`, `snapshots.json` - Main dev fixtures
  - `/demo/` - Demo login profiles (standard, empty, debt-heavy, fire-achieved)
  - `/demo/index.ts` - Profile loader with type parsing

## Demo Profiles
Four scenarios for testing different states:
- `standard` - Normal user with 12 months history
- `empty` - New user, no snapshots
- `debt-heavy` - High debt, low savings
- `fire-achieved` - F.I.R.E. goal reached

Load via: `loadDemoProfile('standard')` → `{ user: User, snapshots: MonthlySnapshot[] }`

## Patterns
- **Idempotent**: seed.ts uses upserts, safe to run multiple times
- **clearUserData()**: Delete user + all their snapshots before reseeding
- **Timestamps**: Auto-add `createdAt`/`updatedAt` if missing from fixtures
- **Type parsing**: JSON dates → Date objects via `parseUser()`, `parseSnapshots()`

## JSON Fixture Format
```json
// users.json / demo/*/user.json
{
  "id": "dev-user-123",
  "nickname": "Anders",
  "email": "dev@example.com",
  "profile": { "monthlySalary": 65000, "monthlySavings": 15000, ... },
  "accounts": [{ "id": "acc-nordnet", "name": "Nordnet", "category": "sparing", ... }]
}

// snapshots.json / demo/*/snapshots.json
{
  "id": "snap-2024-01",
  "userId": "dev-user-123",
  "date": "01.01.2024",
  "accounts": [{ "id": "acc-nordnet", "name": "Nordnet", "value": 500000, ... }],
  "totalNetWorth": 1500000
}
```

## Decisions
- Separate fixtures from demo profiles (different use cases)
- Demo profiles are runtime-loaded (for demo login endpoint)
- Main fixtures are dev-only (for local db:seed)
- RawUser/RawSnapshot interfaces handle JSON → TypeScript conversion

## Gotchas
- Dates in JSON are strings - must parse to Date objects for TypeScript types
- Demo profiles reuse same userId across profiles (overwrite on login)
- Don't mix up `fixtures/users.json` (dev) with `fixtures/demo/*/user.json` (demo login)
- `pnpm db:seed` requires CosmosDB emulator running
- SSL disabled for local emulator (self-signed cert)
