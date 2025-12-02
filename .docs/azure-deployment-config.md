# Azure Deployment Configuration Guide

This guide covers the Azure Portal configuration steps required for deploying the Finans application.

---

## 1. GitHub Secrets

### AZURE_CREDENTIALS

Create a service principal and add to GitHub repository secrets:

```bash
az ad sp create-for-rbac --name "finans-github-actions" \
  --role contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/finans-rg \
  --json-auth
```

Add the JSON output to GitHub → Settings → Secrets and variables → Actions → New repository secret:

**Name**: `AZURE_CREDENTIALS`

**Value** (JSON format):
```json
{
  "clientId": "<service-principal-app-id>",
  "clientSecret": "<service-principal-secret>",
  "subscriptionId": "<azure-subscription-id>",
  "tenantId": "<azure-ad-tenant-id>"
}
```

---

## 2. App Service Configuration

### 2.1 Startup Commands

Configure in Azure Portal → App Service → Configuration → General settings → Startup Command:

| App Service | Startup Command |
|-------------|-----------------|
| `finans-frontend` | `npx serve dist -s -l 8080` |
| `finans-backend` | (default - uses package.json start) |
| `finans-components` | `npx serve storybook-static -s -l 8080` |

### 2.2 Backend Environment Variables

Azure Portal → `finans-backend` → Configuration → Application settings:

**Required:**
```
NODE_ENV=production
PORT=8080
COSMOS_DB_ENDPOINT=https://finans-cosmos.documents.azure.com:443/
COSMOS_DB_KEY=<primary-key-from-cosmosdb>
COSMOS_DB_DATABASE=finans-db
ALLOWED_ORIGINS=https://finans-frontend.azurewebsites.net
```

**Optional (LLM features):**
```
OPENAI_API_KEY=<key>
LANGFUSE_PUBLIC_KEY=<key>
LANGFUSE_SECRET_KEY=<key>
LANGFUSE_HOST=https://finans-langfuse.azurewebsites.net
```

### 2.3 Frontend Build Variables

Set in GitHub workflow or Azure DevOps:

```
VITE_API_URL=https://finans-backend.azurewebsites.net/api/v1
```

---

## 3. EasyAuth (Identity Providers)

### 3.1 Google OAuth

1. **Google Cloud Console** (https://console.cloud.google.com):
   - Create OAuth 2.0 Client ID
   - Authorized redirect URI: `https://finans-backend.azurewebsites.net/.auth/login/google/callback`
   - Copy Client ID and Client Secret

2. **Azure Portal** → `finans-backend` → Authentication:
   - Click "Add identity provider"
   - Select "Google"
   - Enter Client ID and Client Secret
   - Save

### 3.2 Facebook OAuth

1. **Facebook Developer Console** (https://developers.facebook.com):
   - Create new app or use existing
   - Add Facebook Login product
   - Valid OAuth Redirect URI: `https://finans-backend.azurewebsites.net/.auth/login/facebook/callback`
   - Copy App ID and App Secret

2. **Azure Portal** → `finans-backend` → Authentication:
   - Click "Add identity provider"
   - Select "Facebook"
   - Enter App ID and App Secret
   - Save

### 3.3 Authentication Settings

Azure Portal → `finans-backend` → Authentication → Settings:

| Setting | Value |
|---------|-------|
| Restrict access | Require authentication |
| Unauthenticated requests | HTTP 401 Unauthorized |
| Token store | Enabled |

---

## 4. CosmosDB Setup

### 4.1 Create Resources

```bash
# Create CosmosDB account
az cosmosdb create \
  --name finans-cosmos \
  --resource-group finans-rg \
  --kind GlobalDocumentDB \
  --locations regionName=norwayeast

# Create database
az cosmosdb sql database create \
  --account-name finans-cosmos \
  --resource-group finans-rg \
  --name finans-db

# Create users container
az cosmosdb sql container create \
  --account-name finans-cosmos \
  --resource-group finans-rg \
  --database-name finans-db \
  --name users \
  --partition-key-path /id

# Create portfolios container
az cosmosdb sql container create \
  --account-name finans-cosmos \
  --resource-group finans-rg \
  --database-name finans-db \
  --name portfolios \
  --partition-key-path /userId
```

### 4.2 Get Connection Details

Azure Portal → `finans-cosmos` → Keys:

- **URI**: Copy to `COSMOS_DB_ENDPOINT`
- **PRIMARY KEY**: Copy to `COSMOS_DB_KEY`

---

## 5. Deployment Verification Checklist

### GitHub Actions
- [ ] `AZURE_CREDENTIALS` secret configured
- [ ] All three workflows pass on push to main
- [ ] Artifacts deploy successfully

### App Services
- [ ] Frontend serves static files at `/`
- [ ] Backend responds to `/api/v1/health`
- [ ] Storybook accessible at root

### Authentication
- [ ] Google login redirects correctly
- [ ] Facebook login redirects correctly
- [ ] Backend validates tokens via EasyAuth headers

### Database
- [ ] CosmosDB containers created (users, portfolios)
- [ ] Connection string configured in backend
- [ ] Test user creation works

---

## 6. Troubleshooting

### Backend returns 401 Unauthorized
- Verify EasyAuth is configured with identity providers
- Check `x-ms-client-principal` header is being passed
- Ensure frontend is calling `/.auth/login/{provider}`

### Frontend shows blank page
- Check startup command is set
- Verify build artifacts were deployed
- Check browser console for errors

### CosmosDB connection fails
- Verify `COSMOS_DB_ENDPOINT` includes port `:443/`
- Check `COSMOS_DB_KEY` is the primary key (not secondary)
- Ensure database and containers exist

### CORS errors
- Add frontend URL to `ALLOWED_ORIGINS`
- Check protocol (https vs http)
- Verify no trailing slash in origins

---

## 7. Resource Summary

| Resource | Name | Purpose |
|----------|------|---------|
| Resource Group | `finans-rg` | Container for all resources |
| App Service | `finans-frontend` | React application |
| App Service | `finans-backend` | Express API server |
| App Service | `finans-components` | Storybook documentation |
| CosmosDB | `finans-cosmos` | NoSQL database |
| Service Principal | `finans-github-actions` | CI/CD deployment |
