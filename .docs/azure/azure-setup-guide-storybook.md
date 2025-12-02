# Storybook Deployment - Azure Setup Guide

**URL**: https://finans-components.azurewebsites.net
**Purpose**: Static site for component documentation
**Authentication**: None (public documentation)
**Last Updated**: December 2025

---

## Prerequisites

- Azure CLI installed and logged in (`az login`)
- Access to `finans-rg` resource group
- Storybook builds successfully: `pnpm --filter components build-storybook`

Verify Azure login:
```bash
az account show --query "{Name:name, SubscriptionId:id}" -o table
```

---

## Step 1: Create App Service

### Option A: Azure CLI

```bash
# Create App Service (uses existing plan if available)
az webapp create \
  --name finans-components \
  --resource-group finans-rg \
  --plan finans-plan \
  --runtime "NODE:20-lts"
```

If no plan exists, create one first:
```bash
az appservice plan create \
  --name finans-plan \
  --resource-group finans-rg \
  --location norwayeast \
  --sku F1 \
  --is-linux
```

### Option B: Azure Portal

1. Go to [portal.azure.com](https://portal.azure.com)
2. Navigate to `finans-rg` resource group
3. Click **+ Create** > **Web App**
4. Configure:

| Setting | Value |
|---------|-------|
| Name | `finans-components` |
| Publish | Code |
| Runtime stack | Node 20 LTS |
| Operating System | Linux |
| Region | Norway East |
| App Service Plan | `finans-plan` (Free F1) |

5. Click **Review + Create** > **Create**

---

## Step 2: Configure Static Site Serving

Storybook outputs static files to `storybook-static/`. Azure App Service needs a web server to serve them.

### Option A: Startup Command (Simple)

```bash
az webapp config set \
  --name finans-components \
  --resource-group finans-rg \
  --startup-file "npx serve storybook-static -s -l 8080"
```

**Portal method:**
1. Go to App Service > **Configuration** > **General settings**
2. Set **Startup Command**: `npx serve storybook-static -s -l 8080`
3. Click **Save**

### Option B: ecosystem.config.js (Recommended for CI/CD)

Create `components/ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "storybook",
      script: "npx",
      args: "serve storybook-static -s -l 8080",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
```

This file must be deployed alongside the `storybook-static/` folder.

**Why `-s` flag?** Routes all requests to `index.html` for SPA-style navigation.

---

## Step 3: Get Publish Profile

For GitHub Actions deployment:

### CLI Method

```bash
az webapp deployment list-publishing-profiles \
  --name finans-components \
  --resource-group finans-rg \
  --xml
```

Copy the entire XML output.

### Portal Method

1. Go to App Service `finans-components`
2. Click **Download publish profile** (top toolbar)
3. Open downloaded file, copy contents

---

## Step 4: Add GitHub Secret

1. Go to GitHub repo > **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Name: `AZURE_STORYBOOK_PUBLISH_PROFILE`
4. Value: Paste the XML content from Step 3
5. Click **Add secret**

---

## Step 5: GitHub Actions Workflow

Add Storybook deployment to `.github/workflows/deploy.yml`:

```yaml
name: Deploy Storybook

on:
  push:
    branches: [main]
    paths:
      - 'components/**'
      - '.github/workflows/deploy.yml'

jobs:
  deploy-storybook:
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

      - name: Build Storybook
        run: pnpm --filter components build-storybook

      - name: Copy ecosystem.config.js
        run: cp components/ecosystem.config.js components/storybook-static/

      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: finans-components
          publish-profile: ${{ secrets.AZURE_STORYBOOK_PUBLISH_PROFILE }}
          package: components/storybook-static
```

---

## Step 6: Manual Deployment (Alternative)

For quick testing without CI/CD:

### Build Storybook

```bash
pnpm --filter components build-storybook
```

### Deploy via Azure CLI

```bash
# Zip the output
cd components
zip -r storybook.zip storybook-static ecosystem.config.js

# Deploy
az webapp deploy \
  --name finans-components \
  --resource-group finans-rg \
  --src-path storybook.zip \
  --type zip
```

### Deploy via VS Code

1. Install Azure App Service extension
2. Right-click `components/storybook-static` folder
3. Select **Deploy to Web App...**
4. Choose `finans-components`

---

## Step 7: Verify Deployment

### Check URL

Open: https://finans-components.azurewebsites.net

You should see the Storybook welcome page.

### Check Logs (if issues)

```bash
az webapp log tail \
  --name finans-components \
  --resource-group finans-rg
```

---

## Troubleshooting

### "Application Error" on Load

**Cause:** Startup command not configured or wrong path.

**Fix:**
```bash
az webapp config set \
  --name finans-components \
  --resource-group finans-rg \
  --startup-file "npx serve storybook-static -s -l 8080"
```

### Blank Page / 404s

**Cause:** Files not deployed to correct location.

**Check deployed files:**
```bash
az webapp ssh --name finans-components --resource-group finans-rg
# Then: ls -la /home/site/wwwroot/
```

Expected structure:
```
/home/site/wwwroot/
  storybook-static/
    index.html
    ...
  ecosystem.config.js (if used)
```

### "serve: command not found"

**Cause:** `npx` not resolving `serve` package.

**Fix:** Add `serve` as dependency in `components/package.json`:
```json
{
  "devDependencies": {
    "serve": "^14.2.0"
  }
}
```

Or use global install in startup:
```bash
az webapp config set \
  --name finans-components \
  --resource-group finans-rg \
  --startup-file "npm install -g serve && serve storybook-static -s -l 8080"
```

### Port Binding Issues

Azure App Service expects port 8080. Ensure startup command uses `-l 8080`.

### Cold Start Delays

Free tier (F1) has cold start delays of 30-60 seconds. This is normal. Upgrade to B1 for always-on.

---

## Cost

| Tier | Monthly Cost | Notes |
|------|-------------|-------|
| Free (F1) | $0 | 60 CPU min/day, cold starts |
| Basic (B1) | ~$13 | Always-on, custom domain |

For documentation site, Free tier is usually sufficient.

---

## Cleanup

Delete only Storybook app (keeps resource group):
```bash
az webapp delete \
  --name finans-components \
  --resource-group finans-rg
```

---

## Sources

- [Azure App Service Node.js](https://learn.microsoft.com/en-us/azure/app-service/quickstart-nodejs)
- [Deploy Static Sites to Azure](https://dev.to/azure/this-is-how-to-easily-deploy-a-static-site-to-azure-31on)
- [azure/webapps-deploy Action](https://github.com/Azure/webapps-deploy)
