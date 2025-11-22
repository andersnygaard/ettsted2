# Finans App - Azure Deployment with EasyAuth (Google + Facebook)

## Prerequisites

- Azure CLI installed and logged in (`az login`)
- Azure subscription with Contributor access
- Google Cloud Console account
- Facebook Developer account

Verify login:
```bash
az account show --query "{Name:name, SubscriptionId:id}" -o table
```

---

## Step 1: Create Resource Group

```bash
az group create --name finans-rg --location norwayeast
```

---

## Step 2: Create App Service Plan

```bash
az appservice plan create --name finans-plan --resource-group finans-rg --location norwayeast --sku B1 --is-linux
```

---

## Step 3: Create Web App

```bash
az webapp create --name finans --resource-group finans-rg --plan finans-plan --runtime "NODE|20-lts"
```

Get app URL (needed for OAuth):
```bash
az webapp show --name finans --resource-group finans-rg --query defaultHostName -o tsv
```
Result: `finans.azurewebsites.net`

---

## Step 4: Configure Google OAuth

1. Navigate to **Google Cloud Console** → **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted for consent screen:
   - **User Type**: External → **Create**
   - **App name**: finans
   - **User support email**: {YOUR_EMAIL}
   - **Developer contact email**: {YOUR_EMAIL}
   - Click **Save and Continue** through remaining steps → **Back to Dashboard**
4. **Credentials** → **Create Credentials** → **OAuth client ID**:
   - **Application type**: Web application
   - **Name**: finans-azure
   - **Authorized redirect URIs**: Click **Add URI** → `https://finans.azurewebsites.net/.auth/login/google/callback`
   - Click **Create**
5. Copy and save:
   - **Client ID** → {GOOGLE_CLIENT_ID}
   - **Client Secret** → {GOOGLE_CLIENT_SECRET}

---

## Step 5: Configure Facebook Login

1. Navigate to **developers.facebook.com** → **My Apps** → **Create App**
2. Select **Consumer** → **Next**
3. Fill in:
   - **App name**: finans
   - **App contact email**: {YOUR_EMAIL}
   - Click **Create App**
4. On dashboard, find **Facebook Login** → Click **Set up**
5. Select **Web**
6. **Site URL**: `https://finans.azurewebsites.net` → **Save** → **Continue**
7. Navigate to **Facebook Login** → **Settings** (left sidebar):
   - **Valid OAuth Redirect URIs**: `https://finans.azurewebsites.net/.auth/login/facebook/callback`
   - Click **Save Changes**
8. Navigate to **Settings** → **Basic** (left sidebar):
   - Copy **App ID** → {FACEBOOK_APP_ID}
   - Click **Show** next to App Secret → {FACEBOOK_APP_SECRET}
   - **Privacy Policy URL**: `https://finans.azurewebsites.net/privacy`
   - Click **Save Changes**
9. Toggle **App Mode** to **Live** (top of page)

---

## Step 6: Enable EasyAuth

### 6.1 Enable Authentication

```bash
az webapp auth update --name finans --resource-group finans-rg --enabled true --action RedirectToLoginPage --token-store true
```

### 6.2 Add Google Provider

```bash
az webapp auth google update --name finans --resource-group finans-rg --client-id {GOOGLE_CLIENT_ID} --client-secret {GOOGLE_CLIENT_SECRET} --yes
```

### 6.3 Add Facebook Provider

```bash
az webapp auth facebook update --name finans --resource-group finans-rg --app-id {FACEBOOK_APP_ID} --app-secret {FACEBOOK_APP_SECRET} --yes
```

### 6.4 Set Default Provider (Optional)

```bash
az webapp auth update --name finans --resource-group finans-rg --redirect-provider Google
```

### Alternative: Portal Configuration

1. Navigate to **Azure Portal** → **App Services** → **finans** → **Authentication**
2. Click **Add identity provider**
3. For Google:
   - **Identity provider**: Google
   - **Client ID**: {GOOGLE_CLIENT_ID}
   - **Client secret**: {GOOGLE_CLIENT_SECRET}
   - Click **Add**
4. Click **Add identity provider** again
5. For Facebook:
   - **Identity provider**: Facebook
   - **App ID**: {FACEBOOK_APP_ID}
   - **App secret**: {FACEBOOK_APP_SECRET}
   - Click **Add**
6. Click **Edit** (pencil icon) on Authentication settings:
   - **Restrict access**: Require authentication
   - **Unauthenticated requests**: HTTP 302 Found redirect
   - Click **Save**

---

## Step 7: Deploy Application

### 7.1 Configure Deployment Settings

```bash
az webapp config appsettings set --name finans --resource-group finans-rg --settings WEBSITE_RUN_FROM_PACKAGE=1 SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

### 7.2 Build Application

```bash
npm run build
```

### 7.3 Create Deployment Package (Windows)

```cmd
cd dist && tar -acf ../deploy.zip * && cd ..
```

### 7.4 Deploy via CLI

```bash
az webapp deploy --name finans --resource-group finans-rg --src-path deploy.zip --type zip
```

### Alternative: Deploy via package.bat/deploy.bat

Create `package.bat`:
```batch
@echo off
call npm run build
cd dist
tar -acf ../deploy.zip *
cd ..
echo Package created: deploy.zip
```

Create `deploy.bat`:
```batch
@echo off
call az webapp deploy --name finans --resource-group finans-rg --src-path deploy.zip --type zip
echo Deployment complete: https://finans.azurewebsites.net
```

---

## Step 8: Testing

### 8.1 Verify App Status

```bash
az webapp show --name finans --resource-group finans-rg --query state -o tsv
```

### 8.2 Test Authentication URLs

Open browser:
- **Main app**: `https://finans.azurewebsites.net`
- **Google login**: `https://finans.azurewebsites.net/.auth/login/google`
- **Facebook login**: `https://finans.azurewebsites.net/.auth/login/facebook`
- **User info**: `https://finans.azurewebsites.net/.auth/me`
- **Logout**: `https://finans.azurewebsites.net/.auth/logout`

### 8.3 Verify Auth Configuration

```bash
az webapp auth show --name finans --resource-group finans-rg
```

### 8.4 View Logs

```bash
az webapp log tail --name finans --resource-group finans-rg
```

---

## Collect Configuration Values

| Placeholder | How to Retrieve |
|-------------|-----------------|
| {GOOGLE_CLIENT_ID} | Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client |
| {GOOGLE_CLIENT_SECRET} | Same location, click client name to view |
| {FACEBOOK_APP_ID} | developers.facebook.com → Your App → Settings → Basic |
| {FACEBOOK_APP_SECRET} | Same location, click Show |

---

## Troubleshooting

### "Reply URL does not match"
- Verify redirect URI matches exactly: `https://finans.azurewebsites.net/.auth/login/{provider}/callback`

### "/.auth/me returns null"
- User not logged in or token expired
- Check `AppServiceAuthSession` cookie exists

### Facebook App Not Working
- Ensure app is in **Live** mode (not Development)
- Privacy Policy URL must be accessible

### View Detailed Logs
```bash
az webapp log download --name finans --resource-group finans-rg --log-file logs.zip
```

---

## Cleanup (Optional)

Delete all resources:
```bash
az group delete --name finans-rg --yes --no-wait
```
