# Backend User API

## Summary

Add Node.js + TypeScript backend API with CosmosDB to store user data on first login. Separate Azure App Service with token validation for authentication. Implements user onboarding flow with form versioning.

## Background

Need persistent storage for user data (username, preferences) and future features (calculations, portfolios). Frontend currently has EasyAuth but no backend or database. Using user's OAuth provider ID as stable identifier across sessions.

## Technical Approach

### Architecture
- **Frontend** (finans.azurewebsites.net): EasyAuth for user login (Google/Facebook)
- **Backend** (finans-api.azurewebsites.net): Token validation, no EasyAuth
- **Database**: CosmosDB Serverless with `users` container
- **Authentication Flow**: Frontend sends access_token, backend validates with OAuth provider API
- **Local Dev**: Mock token validation

### API Endpoints
- `GET /health` - Health check (no auth)
- `GET /api/user` - Get user details (404 if not exists)
- `PUT /api/user` - Create/update user (idempotent)

### Database Schema
**Container**: `users` (partition key: `/providerId`)

```json
{
  "id": "uuid",
  "userId": "uuid",
  "providerId": "109970345377951672711",
  "providerName": "google",
  "username": "andersnygaard",
  "givenName": "Anders",
  "familyName": "Nygaard",
  "formVersion": 1,
  "createdAt": "2025-11-25T12:00:00Z",
  "updatedAt": "2025-11-25T12:00:00Z"
}
```

**Key Design**:
- `providerId` = OAuth provider's `nameidentifier` claim (stable across email changes)
- `formVersion` = tracks userdetails form version (can re-prompt if form changes)
- No username uniqueness enforcement

### User Flow
1. User logs in via EasyAuth → Frontend calls `GET /api/user`
2. **If 404**: Show onboarding form (username + EULA checkbox)
3. Submit → `PUT /api/user` with username
4. Backend extracts OAuth data from headers, combines with username, sets `formVersion=1`
5. User created in CosmosDB → Redirect to dashboard with username in menu

## Implementation Tasks

### Azure Infrastructure
- [ ] Create CosmosDB serverless account (`finans-cosmos`)
- [ ] Create database `finans-db` and container `users` with partition key `/providerId`
- [ ] Create App Service plan B1 (`finans-api-plan`)
- [ ] Create App Service (`finans-api`) with Node 20 LTS
- [ ] Configure CORS to allow `finans.azurewebsites.net`
- [ ] Set app settings (CosmosDB connection string, database/container names)
- [ ] Document commands in `docs/azure/azure-backend.md`

### Backend Implementation
- [ ] Create `backend/` directory structure
- [ ] Implement `src/index.ts` (Express app with CORS)
- [ ] Implement `src/middleware/auth.ts` (validate EasyAuth headers, extract providerId)
- [ ] Implement `src/middleware/rateLimit.ts` (100 req/15min)
- [ ] Implement `src/config/cosmos.ts` (CosmosDB client)
- [ ] Implement `src/services/userService.ts` (getUserByProviderId, createUser, updateUser)
- [ ] Implement `src/routes/users.ts` (GET/PUT /api/user endpoints)
- [ ] Implement `src/routes/health.ts` (GET /health)
- [ ] Create `package.json` with dependencies (express, @azure/cosmos, cors, uuid, rate-limit)
- [ ] Create `tsconfig.json`
- [ ] Create `package-backend.bat` (build + zip for deployment)
- [ ] Create `deploy-backend.bat` (deploy to Azure)

### Frontend Integration
- [ ] Create `src/services/api.ts` (getUser, saveUser functions)
- [ ] Create `src/features/onboarding/OnboardingPage.tsx` (username form + EULA)
- [ ] Modify `src/App.tsx` (UserContext, load user on init, onboarding route)
- [ ] Modify routing to redirect to `/onboarding` if user doesn't exist
- [ ] Modify `src/components/Layout.tsx` (display username from UserContext)
- [ ] Add `.env` with `VITE_API_URL`
- [ ] Add Vite proxy for local dev mock (optional)

### Local Development
- [ ] Mock `/.auth/me` endpoint for local frontend dev
- [ ] Mock token validation in backend auth middleware (dev mode)

## Acceptance Criteria

- [ ] Backend deployed to `finans-api.azurewebsites.net`
- [ ] Health endpoint accessible at `/health`
- [ ] New user login → Onboarding page shown
- [ ] Submit username + EULA → User created in CosmosDB with `formVersion=1`
- [ ] User redirected to dashboard with username displayed in menu
- [ ] Returning user → Direct access to dashboard (no onboarding)
- [ ] Rate limiting active (100 req/15min)
- [ ] Local development works with mock auth
- [ ] CosmosDB uses `providerId` from `nameidentifier` claim as partition key
- [ ] PUT endpoint is idempotent (can handle retries)

## Dependencies

None

## Notes

- No EasyAuth on backend - token validation only
- Username not unique - just stored as-is
- User deletion deferred to later
- Form versioning allows future re-prompting if fields added
