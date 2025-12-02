# Backend Deployment - Azure Setup Guide

**URL**: https://finans-backend.azurewebsites.net
**Purpose**: Express API server with CosmosDB
**Authentication**: Receives EasyAuth headers from frontend
**Last Updated**: December 2025

---

## Prerequisites

- Azure CLI installed and logged in (`az login`)
- Access to `finans-rg` resource group
- Backend builds successfully: `pnpm --filter backend build`

Verify Azure login:
```bash
az account show --query "{Name:name, SubscriptionId:id}" -o table
```

---

## Step 1: Create CosmosDB Account

### 1.1 Create Account (Serverless)

```bash
az cosmosdb create \
  --name finans-cosmos \
  --resource-group finans-rg \
  --locations regionName=norwayeast \
  --capabilities EnableServerless \
  --default-consistency-level Session
```

**Why Serverless?** Pay-per-request pricing, no minimum RU/s. Ideal for development and variable workloads.

### 1.2 Create Database

```bash
az cosmosdb sql database create \
  --account-name finans-cosmos \
  --resource-group finans-rg \
  --name finans-db
```

### 1.3 Create Containers

**Users container** (partition key: `/id`):

```bash
az cosmosdb sql container create \
  --account-name finans-cosmos \
  --resource-group finans-rg \
  --database-name finans-db \
  --name users \
  --partition-key-path /id
```

**Portfolios container** (partition key: `/userId`):

```bash
az cosmosdb sql container create \
  --account-name finans-cosmos \
  --resource-group finans-rg \
  --database-name finans-db \
  --name portfolios \
  --partition-key-path /userId
```

### 1.4 Get Connection Details

```bash
# Get endpoint
COSMOS_ENDPOINT=$(az cosmosdb show \
  --name finans-cosmos \
  --resource-group finans-rg \
  --query documentEndpoint \
  -o tsv)
echo "Endpoint: $COSMOS_ENDPOINT"

# Get primary key
COSMOS_KEY=$(az cosmosdb keys list \
  --name finans-cosmos \
  --resource-group finans-rg \
  --query primaryMasterKey \
  -o tsv)
echo "Key: $COSMOS_KEY"
```

---

## Step 2: Create App Service

### CLI Method

```bash
az webapp create \
  --name finans-backend \
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
| Name | `finans-backend` |
| Runtime stack | Node 20 LTS |
| Operating System | Linux |
| Region | Norway East |
| App Service Plan | `finans-plan` |

---

## Step 3: Configure App Settings

### CLI Method

```bash
az webapp config appsettings set \
  --name finans-backend \
  --resource-group finans-rg \
  --settings \
    COSMOS_DB_ENDPOINT="https://finans-cosmos.documents.azure.com:443/" \
    COSMOS_DB_KEY="<your-primary-key>" \
    COSMOS_DB_DATABASE="finans-db" \
    NODE_ENV="production" \
    PORT="8080" \
    ALLOWED_ORIGINS="https://finans-frontend.azurewebsites.net"
```

### Portal Method

1. Go to App Service > **Configuration** > **Application settings**
2. Add each setting:
   - `COSMOS_DB_ENDPOINT`
   - `COSMOS_DB_KEY`
   - `COSMOS_DB_DATABASE`
   - `NODE_ENV`
   - `PORT`
   - `ALLOWED_ORIGINS`
3. Click **Save**

### Optional Settings

For LLM features and observability:

```bash
az webapp config appsettings set \
  --name finans-backend \
  --resource-group finans-rg \
  --settings \
    OPENAI_API_KEY="<your-openai-key>" \
    LANGFUSE_PUBLIC_KEY="<langfuse-public>" \
    LANGFUSE_SECRET_KEY="<langfuse-secret>" \
    LANGFUSE_HOST="https://finans-langfuse.azurewebsites.net"
```

---

## Step 4: Configure Startup

Set the startup command for Express:

```bash
az webapp config set \
  --name finans-backend \
  --resource-group finans-rg \
  --startup-file "node dist/index.js"
```

Or use `package.json` start script (auto-detected):

```json
{
  "scripts": {
    "start": "node dist/index.js"
  }
}
```

---

## Step 5: Get Publish Profile

```bash
az webapp deployment list-publishing-profiles \
  --name finans-backend \
  --resource-group finans-rg \
  --xml
```

Save as GitHub secret: `AZURE_BACKEND_PUBLISH_PROFILE`

---

## Step 6: GitHub Actions Workflow

Add to `.github/workflows/deploy.yml`:

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - '.github/workflows/deploy.yml'

jobs:
  deploy-backend:
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

      - name: Build Backend
        run: pnpm --filter backend build

      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: finans-backend
          publish-profile: ${{ secrets.AZURE_BACKEND_PUBLISH_PROFILE }}
          package: backend/dist
```

---

## Step 7: Verify Deployment

### Health Check

```bash
curl https://finans-backend.azurewebsites.net/api/v1/health
```

Expected response:
```json
{"status": "ok", "database": "connected"}
```

### Check Logs

```bash
az webapp log tail \
  --name finans-backend \
  --resource-group finans-rg
```

### Test CosmosDB Connection

Look for log messages like:
```
Connected to CosmosDB: finans-db
```

---

## Troubleshooting

### "COSMOS_DB_KEY is undefined"

**Cause:** App settings not configured.

**Check current settings:**
```bash
az webapp config appsettings list \
  --name finans-backend \
  --resource-group finans-rg \
  --output table
```

### "Connection refused" to CosmosDB

**Cause:** Firewall blocking access.

**Fix:** Enable Azure services access:
```bash
az cosmosdb update \
  --name finans-cosmos \
  --resource-group finans-rg \
  --enable-public-network true
```

Or add App Service outbound IPs to firewall.

### CORS Errors

**Cause:** `ALLOWED_ORIGINS` not set correctly.

**Fix:**
```bash
az webapp config appsettings set \
  --name finans-backend \
  --resource-group finans-rg \
  --settings ALLOWED_ORIGINS="https://finans-frontend.azurewebsites.net"
```

### "Cannot find module 'dist/index.js'"

**Cause:** Build output not deployed.

**Check deployed files:**
```bash
az webapp ssh --name finans-backend --resource-group finans-rg
# Then: ls -la /home/site/wwwroot/
```

Expected structure:
```
/home/site/wwwroot/
  dist/
    index.js
    ...
  package.json
  node_modules/
```

### 502 Bad Gateway

**Cause:** App crashed on startup.

**Check logs:**
```bash
az webapp log tail --name finans-backend --resource-group finans-rg
```

Common causes:
- Missing environment variables
- Port not 8080
- Uncaught exception in startup

---

## Security Notes

### CosmosDB Key Protection

For production, use Azure Key Vault instead of direct key storage:

```bash
# Create Key Vault
az keyvault create \
  --name finans-vault \
  --resource-group finans-rg \
  --location norwayeast

# Store CosmosDB key
az keyvault secret set \
  --vault-name finans-vault \
  --name cosmos-key \
  --value "<your-cosmos-key>"

# Configure App Service to use Key Vault reference
az webapp config appsettings set \
  --name finans-backend \
  --resource-group finans-rg \
  --settings COSMOS_DB_KEY="@Microsoft.KeyVault(VaultName=finans-vault;SecretName=cosmos-key)"
```

### Rate Limiting

Configure in app settings:
```bash
az webapp config appsettings set \
  --name finans-backend \
  --resource-group finans-rg \
  --settings \
    RATE_LIMIT_REQUESTS="100" \
    RATE_LIMIT_CALCULATOR="10" \
    RATE_LIMIT_LLM="20"
```

---

## Cost

| Resource | Tier | Monthly Cost |
|----------|------|-------------|
| App Service | Free (F1) | $0 |
| App Service | Basic (B1) | ~$13 |
| CosmosDB Serverless | Pay-per-request | ~$0.25/million RUs |

For low-traffic development: ~$0-5/month

---

## Cleanup

Delete backend app only:
```bash
az webapp delete --name finans-backend --resource-group finans-rg
```

Delete CosmosDB (data loss!):
```bash
az cosmosdb delete --name finans-cosmos --resource-group finans-rg --yes
```

---

## Sources

- [Azure CosmosDB CLI Reference](https://learn.microsoft.com/en-us/cli/azure/cosmosdb)
- [Create CosmosDB Container](https://learn.microsoft.com/en-us/azure/cosmos-db/nosql/how-to-create-container)
- [App Service Node.js Configuration](https://learn.microsoft.com/en-us/azure/app-service/configure-language-nodejs)
