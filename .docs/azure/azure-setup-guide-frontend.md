# Frontend Deployment - Azure Setup Guide

**URL**: https://finans-frontend.azurewebsites.net
**Purpose**: React SPA with EasyAuth (Google + Facebook)
**Last Updated**: December 2025

---

## Prerequisites

- Azure CLI installed and logged in (`az login`)
- Access to `finans-rg` resource group
- Frontend builds successfully: `pnpm --filter frontend build`
- Google Cloud Console account
- Facebook Developer account

Verify Azure login:
```bash
az account show --query "{Name:name, SubscriptionId:id}" -o table
```

Required CLI extension:
```bash
az extension add --name authV2
```

---

## Step 1: Create App Service

### CLI Method

```bash
az webapp create \
  --name finans-frontend \
  --resource-group finans-rg \
  --plan finans-plan \
  --runtime "NODE:20-lts"
```

If no plan exists:
```bash
az appservice plan create \
  --name finans-plan \
  --resource-group finans-rg \
  --location norwayeast \
  --sku F1 \
  --is-linux
```

### Portal Method

1. Go to [portal.azure.com](https://portal.azure.com)
2. Navigate to `finans-rg` > **+ Create** > **Web App**
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `finans-frontend` |
| Runtime stack | Node 20 LTS |
| Operating System | Linux |
| Region | Norway East |
| App Service Plan | `finans-plan` |

---

## Step 2: Configure Static Site Serving

React builds to static files. Configure serving:

```bash
az webapp config set \
  --name finans-frontend \
  --resource-group finans-rg \
  --startup-file "npx serve dist -s -l 8080"
```

Or create `frontend/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "frontend",
      script: "npx",
      args: "serve dist -s -l 8080"
    }
  ]
};
```

---

## Step 3: Configure App Settings

```bash
az webapp config appsettings set \
  --name finans-frontend \
  --resource-group finans-rg \
  --settings \
    VITE_API_URL="https://finans-backend.azurewebsites.net/api/v1"
```

---

## Step 4: Configure Google OAuth

### 4.1 Create OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select/create project
3. Navigate to **APIs & Services** > **OAuth consent screen**
4. Select **External** user type
5. Fill in:
   - App name: `Finans`
   - User support email: your email
   - Developer contact: your email
6. Add scopes: `email`, `profile`, `openid`
7. Add test users (for development)

### 4.2 Create OAuth Client ID

1. Go to **APIs & Services** > **Credentials**
2. Click **+ Create Credentials** > **OAuth client ID**
3. Application type: **Web application**
4. Name: `Finans Web App`
5. Authorized JavaScript origins:
   ```
   https://finans-frontend.azurewebsites.net
   ```
6. Authorized redirect URIs:
   ```
   https://finans-frontend.azurewebsites.net/.auth/login/google/callback
   ```
7. Click **Create**
8. **IMPORTANT:** Download credentials immediately (2025 change: secrets only visible once)

Save to `backend/.env`:
```
GOOGLE_CLIENT_ID=<client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<client-secret>
```

---

## Step 5: Configure Facebook Login

### 5.1 Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Select **Set up Facebook Login**
4. App name: `Finans`
5. Click **Create App**

### 5.2 Configure OAuth Settings

1. Go to **Facebook Login** > **Settings**
2. Add Valid OAuth Redirect URI:
   ```
   https://finans-frontend.azurewebsites.net/.auth/login/facebook/callback
   ```
3. Click **Save Changes**

### 5.3 Configure App Settings

1. Go to **App Settings** > **Basic**
2. Fill in:
   - App Domains: `finans-frontend.azurewebsites.net`
   - Privacy Policy URL: (required for Live mode)
   - Site URL: `https://finans-frontend.azurewebsites.net`
3. Click **Save Changes**

### 5.4 Go Live

1. Toggle from **In development** to **Live** in top bar
2. Complete any required verification

Save to `backend/.env`:
```
FACEBOOK_APP_ID=<app-id>
FACEBOOK_APP_SECRET=<app-secret>
```

---

## Step 6: Enable EasyAuth

### 6.1 Upgrade to Auth V2

```bash
az webapp auth config-version upgrade \
  --name finans-frontend \
  --resource-group finans-rg
```

### 6.2 Enable Authentication

```bash
az webapp auth update \
  --name finans-frontend \
  --resource-group finans-rg \
  --enabled true \
  --unauthenticated-client-action AllowAnonymous \
  --token-store true
```

**Note:** `AllowAnonymous` allows landing page access. App controls auth flow.

### 6.3 Add Google Provider

```bash
az webapp auth google update \
  --name finans-frontend \
  --resource-group finans-rg \
  --client-id "<GOOGLE_CLIENT_ID>" \
  --client-secret "<GOOGLE_CLIENT_SECRET>" \
  --yes
```

### 6.4 Add Facebook Provider

```bash
az webapp auth facebook update \
  --name finans-frontend \
  --resource-group finans-rg \
  --app-id "<FACEBOOK_APP_ID>" \
  --app-secret "<FACEBOOK_APP_SECRET>" \
  --yes
```

### Alternative: Portal Method

1. Go to **App Services** > **finans-frontend** > **Authentication**
2. Click **Add identity provider**
3. Select **Google**, enter Client ID and Secret
4. Click **Add**
5. Repeat for **Facebook**

---

## Step 7: Get Publish Profile

```bash
az webapp deployment list-publishing-profiles \
  --name finans-frontend \
  --resource-group finans-rg \
  --xml
```

Save as GitHub secret: `AZURE_FRONTEND_PUBLISH_PROFILE`

---

## Step 8: GitHub Actions Workflow

Add to `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
      - 'components/**'
      - '.github/workflows/deploy.yml'

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build Frontend
        run: pnpm --filter frontend build

      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: finans-frontend
          publish-profile: ${{ secrets.AZURE_FRONTEND_PUBLISH_PROFILE }}
          package: frontend/dist
```

---

## Step 9: Verify Deployment

### Test URLs

| URL | Expected |
|-----|----------|
| https://finans-frontend.azurewebsites.net | App loads |
| https://finans-frontend.azurewebsites.net/.auth/login/google | Google login redirect |
| https://finans-frontend.azurewebsites.net/.auth/login/facebook | Facebook login redirect |
| https://finans-frontend.azurewebsites.net/.auth/me | User info (after login) |
| https://finans-frontend.azurewebsites.net/.auth/logout | Logout |

### Check Auth Status

```bash
az webapp auth show \
  --name finans-frontend \
  --resource-group finans-rg
```

---

## Troubleshooting

### "Reply URL does not match" (Google)

**Cause:** Redirect URI mismatch in Google Console.

**Fix:**
1. Go to Google Cloud Console > Credentials
2. Edit OAuth client
3. Verify redirect URI is exactly:
   ```
   https://finans-frontend.azurewebsites.net/.auth/login/google/callback
   ```
   (no trailing slash)

### "Reply URL does not match" (Facebook)

**Cause:** Redirect URI mismatch in Facebook Console.

**Fix:**
1. Go to Facebook Developers > Facebook Login > Settings
2. Verify Valid OAuth Redirect URI is exactly:
   ```
   https://finans-frontend.azurewebsites.net/.auth/login/facebook/callback
   ```

### "/.auth/me returns null"

**Causes:**
- User not logged in
- Session expired
- Cookie not set

**Check:**
- Browser has `AppServiceAuthSession` cookie
- Auth is enabled: `az webapp auth show --name finans-frontend -g finans-rg`

### Facebook App Not Working

**Causes:**
- App still in Development mode
- Missing Privacy Policy URL

**Fix:**
1. Add Privacy Policy URL in App Settings > Basic
2. Switch app to Live mode

### "Cannot use auth v2 commands"

**Fix:**
```bash
az webapp auth config-version upgrade \
  --name finans-frontend \
  --resource-group finans-rg
```

### Blank Page After Deploy

**Cause:** Static file serving not configured.

**Fix:**
```bash
az webapp config set \
  --name finans-frontend \
  --resource-group finans-rg \
  --startup-file "npx serve dist -s -l 8080"
```

---

## EasyAuth Flow Reference

### Login URLs

| Provider | URL |
|----------|-----|
| Google | `/.auth/login/google` |
| Facebook | `/.auth/login/facebook` |

### Post-Login Redirect

Add `post_login_redirect_uri` parameter:
```
/.auth/login/google?post_login_redirect_uri=/dashboard
```

### Get User Info

Frontend can fetch user info from:
```javascript
const response = await fetch('/.auth/me');
const user = await response.json();
// user.userId, user.userDetails, user.identityProvider
```

### Backend Header

EasyAuth passes user info to backend via header:
```
x-ms-client-principal: <base64-encoded-json>
```

Decode in Express:
```javascript
const principal = req.headers['x-ms-client-principal'];
const user = JSON.parse(Buffer.from(principal, 'base64').toString());
```

---

## Cost

| Tier | Monthly Cost | Notes |
|------|-------------|-------|
| Free (F1) | $0 | 60 CPU min/day, cold starts |
| Basic (B1) | ~$13 | Always-on, custom domain, SSL |

---

## Cleanup

Delete frontend app:
```bash
az webapp delete --name finans-frontend --resource-group finans-rg
```

---

## Sources

- [Azure EasyAuth Overview](https://learn.microsoft.com/en-us/azure/app-service/overview-authentication-authorization)
- [Configure Google Authentication](https://learn.microsoft.com/en-us/azure/app-service/configure-authentication-provider-google)
- [Google OAuth 2.0 Setup](https://support.google.com/cloud/answer/6158849)
- [Facebook Login Setup](https://developers.facebook.com/docs/facebook-login/)
- [az webapp auth CLI](https://learn.microsoft.com/en-us/cli/azure/webapp/auth)
