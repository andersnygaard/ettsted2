# FEATURE: CI/CD GitHub Workflows

**Status**: Backlog
**Created**: 2025-11-28
**Priority**: Medium
**Labels**: infrastructure, cicd, github, deployment
**Estimated Effort**: Medium - 2-3 days

## Context & Motivation

Automated CI/CD pipelines ensure code quality and streamline deployment to Azure. The finans project needs workflows for linting, testing, building, and deploying all three workspaces (frontend, backend, components/Storybook) to Azure App Services.

## Current State

- GitHub repository exists
- No `.github/workflows/` directory exists
- Azure App Services planned: `finans-frontend`, `finans-backend`, `finans-components`
- **No CI/CD workflows exist**

## Desired Outcome

Two GitHub Actions workflows:
1. **CI Workflow** - Runs on all pushes and PRs:
   - Install dependencies (pnpm)
   - Lint all workspaces
   - Type-check TypeScript
   - Run unit tests
   - Build all workspaces
2. **Deployment Workflow** - Runs on push to `main`:
   - Build frontend (includes bundled components)
   - Build backend
   - Build Storybook
   - Deploy to Azure App Services

## Acceptance Criteria

- [ ] `.github/workflows/ci.yml` created and working
- [ ] `.github/workflows/deploy.yml` created and working
- [ ] CI workflow runs on every push and PR
- [ ] Deployment workflow runs only on push to `main`
- [ ] All workspaces lint successfully
- [ ] All workspaces type-check successfully
- [ ] All workspaces build successfully
- [ ] Deployment succeeds to all three Azure App Services
- [ ] GitHub Actions secrets configured for Azure credentials

## Affected Components

### Infrastructure
- **Workflows**:
  - `/.github/workflows/ci.yml` (new file)
  - `/.github/workflows/deploy.yml` (new file)
- **Azure Resources** (must exist first):
  - `finans-frontend` (App Service)
  - `finans-backend` (App Service)
  - `finans-components` (App Service)

## Technical Approach

### CI Workflow

```yaml
name: CI

on:
  push:
    branches: ['**']
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm --filter frontend type-check
      - run: pnpm --filter backend type-check
      - run: pnpm build
```

### Deployment Workflow

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm --filter backend build
      - uses: azure/webapps-deploy@v2
        with:
          app-name: 'finans-backend'
          publish-profile: ${{ secrets.AZURE_BACKEND_PUBLISH_PROFILE }}
          package: './backend'

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm --filter frontend build
      - uses: azure/webapps-deploy@v2
        with:
          app-name: 'finans-frontend'
          publish-profile: ${{ secrets.AZURE_FRONTEND_PUBLISH_PROFILE }}
          package: './frontend/dist'

  deploy-storybook:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm --filter components build-storybook
      - uses: azure/webapps-deploy@v2
        with:
          app-name: 'finans-components'
          publish-profile: ${{ secrets.AZURE_COMPONENTS_PUBLISH_PROFILE }}
          package: './components/storybook-static'
```

## Dependencies

- **Azure Resources**: App Services must be created first
- **GitHub Secrets**: Publish profiles for all three App Services

## Risks & Considerations

- **Risk**: Deployment failures → **Mitigation**: Test locally, use Azure deployment logs
- **Risk**: Secrets exposure → **Mitigation**: Use GitHub secrets, never commit credentials
- **Risk**: Build failures block deployment → **Mitigation**: CI workflow catches issues before merge

## Related Plans

- All features (CI/CD catches issues early)
- Azure deployment setup (prerequisite)

---

**Next Steps**: Ready for implementation after Azure App Services created.
