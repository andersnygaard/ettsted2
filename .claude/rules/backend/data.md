# Data Rules

## Stack
CosmosDB (NoSQL), @azure/cosmos SDK, CosmosDB Emulator (local)

## Structure
- `/config/cosmosdb.ts` - Singleton client, container getters
- `/models/User.ts` - User document type
- `/models/Portfolio.ts` - MonthlySnapshot, Account types
- `/models/Account.ts` - AccountConfig type

## Patterns
- Singleton pattern: `getUsersContainer()`, `getPortfoliosContainer()`
- Containers: `users` (partition: /id), `portfolios` (partition: /userId)
- Denormalized snapshots: each stores full account data for historical accuracy
- Parameterized queries ALWAYS: `{ query: 'SELECT...@param', parameters: [...] }`
- SSL disabled for emulator (self-signed cert): `agent: new https.Agent({ rejectUnauthorized: false })`

## Decisions
- Denormalized over normalized: accounts embedded in snapshots
- Co-location by userId: all user data in same partition for fast queries
- 400 RU/s minimum throughput (scale on demand)
- Fail fast: server won't start if DB unreachable

## Gotchas
- String dates "dd.MM.yyyy" DON'T sort correctly in CosmosDB
- Always sort dates in JS: `snapshots.sort(compareDatesAsc)` from dateUtils.ts
- 404 errors return null (not throw)
- 409 errors throw ConflictError (duplicate)
- Zod strips unknown fields - add to schema or they're dropped
