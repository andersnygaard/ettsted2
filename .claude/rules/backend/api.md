# API Rules

## Stack
Express, express-async-errors

## Structure
- `/routes/index.ts` - Route aggregation, public vs protected split
- `/routes/*Routes.ts` - Domain-specific routes
- `/controllers/*Controller.ts` - Request handlers

## Patterns
- Base path: `/api/v1`
- Response format: `{ data: {...}, success: true }` or `{ error: {...}, success: false }`
- Controllers use `asyncHandler` wrapper for async errors
- Route naming: Norwegian with æøå → aoa (e.g., `/portefolje`, `/okonomi`)

## Route Groups
- **Public**: `/auth/demo-login`, `/auth/demo-profiles`, `/health`
- **Protected** (after validateAuth):
  - `/users/me`, `/users/me/setup`
  - `/accounts` (CRUD)
  - `/snapshots` (CRUD)
  - `/oversikt`, `/sparing`, `/gjeld`, `/pensjon` (aggregated views)
  - `/kalkulatorer/{rentes-rente|fire|lan|monte-carlo}`
  - `/import/chat`

## Decisions
- Calculators are protected (need user context for rate limiting)
- Aggregated endpoints compute values server-side (don't expose raw data)

## Gotchas
- Status codes: 200 OK, 201 Created, 400 Validation, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Rate Limit, 500 Server Error
- Always return `success: boolean` in response
- Error details only in development environment
