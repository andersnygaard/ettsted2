# GitHub Secrets Setup

## AZURE_CREDENTIALS

**Location**: GitHub → Settings → Secrets and variables → Actions → New repository secret

**Name**: `AZURE_CREDENTIALS`

**Value**: JSON from Azure service principal (see below how to create)

```json
{
  "clientId": "<from service principal>",
  "clientSecret": "<from service principal>",
  "subscriptionId": "<your subscription id>",
  "tenantId": "<your tenant id>",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

## Creating the Service Principal

```bash
# Get subscription ID
az account show --query id -o tsv

# Create service principal (Git Bash on Windows)
MSYS_NO_PATHCONV=1 az ad sp create-for-rbac \
  --name "finans-github-deploy" \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/finans-rg \
  --sdk-auth
```

Copy the full JSON output as the secret value.

## What it deploys

| Workflow | App Service |
|----------|-------------|
| deploy-backend.yml | finans-backend |
| deploy-frontend.yml | finans-frontend |
| deploy-storybook.yml | finans-components |

One secret, all three services.
