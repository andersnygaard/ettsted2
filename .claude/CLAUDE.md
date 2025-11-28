# Finans - Portfolio & Wealth Tracking Application

> Portfolio and wealth tracking application for monthly monitoring of investments and net worth. Built with React, TypeScript, and Azure.

## Project Overview

**Architecture**: pnpm monorepo with 3 workspaces (frontend, backend, components)

**Purpose**: Help users track their investment portfolios across multiple asset classes, visualize wealth growth, and plan for financial independence (F.I.R.E.). This is NOT a budgeting or expense tracking app - it focuses on long-term portfolio monitoring and future projections.

**Target Users**: Monthly portfolio trackers, long-term investors, F.I.R.E. enthusiasts

---

## Tech Stack

### Frontend (`/frontend`)
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: BeerCSS + Material UI
- **Visualizations**: D3.js
- **State Management**:
  - Zustand (client state)
  - TanStack Query (server state / API data)
  - React Context (auth state)
- **HTTP Client**: Axios
- **Forms**: React Hook Form with Zod/Yup validation
- **Linting**: ESLint + Prettier

### Backend (`/backend`)
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Platform**: Azure App Service
- **Authentication**: EasyAuth (Google + Facebook OAuth)

### Components (`/components`)
- **Type**: Shared React component library
- **Documentation**: Storybook
- **Styling**: BeerCSS + Material UI
- **Distribution**: Workspace co-hosting (bundled into frontend)

### Testing (`/e2e`)
- **Framework**: Playwright
- **Pattern**: Page Object Model
- **Focus**: Critical user flows (login, portfolio tracking, calculations)

---

## Database & Data Layer

### Technology
- **Database**: Azure CosmosDB (NoSQL)
- **Local Development**: CosmosDB Emulator (run via `emulator.bat` using npx)
- **Data Access**: CosmosDB SDK for Node.js (@azure/cosmos)

### Container Strategy

**Container: `users`**
- **Partition Key**: `/id` (userId)
- **Documents**: User profiles
```typescript
{
  id: string              // userId (from EasyAuth token)
  username: string        // Unique, chosen at first login
  email?: string          // Optional, user toggles during onboarding
  createdAt: Date
  preferences: {
    // Future: theme, locale, etc.
  }
}
```

**Container: `portfolios`**
- **Partition Key**: `/userId`
- **Documents**: Monthly snapshots with account balances
```typescript
{
  id: string              // snapshotId
  userId: string
  date: string            // "01.01.2024" (dd.MM.yyyy format)
  accounts: [
    {
      id: string
      name: string        // "Nordnet ASK", "Bouvet ASK", etc.
      assetClass: string  // "aksjer", "fond", "krypto", "bankkonto", or custom
      value: number       // Total value in NOK (kroner, decimal)
      notes?: string
    }
  ]
  totalNetWorth: number   // Calculated sum
  createdAt: Date
  updatedAt: Date
}
```

### Design Rationale
- **Co-location**: All user data in same partition (userId) enables fast, low-cost queries
- **Account-based tracking**: Users track account totals, not individual holdings within accounts
- **Flexible asset classes**: Predefined types (aksjer, fond, krypto, bankkonto) + custom user-defined types
- **Optimistic updates**: No immutable history - users can edit any past snapshot

### Migration Strategy
- **No migrations initially**: CosmosDB is schemaless
- **Future**: Version documents if schema changes needed (`_version` field)

---

## Repository Structure

```
/frontend          - React application
/backend           - Express API server
/components        - Shared component library
/e2e               - Playwright E2E tests
/docs              - Project documentation
package.json       - Root workspace configuration
pnpm-workspace.yaml - pnpm workspace config
.claude/           - Claude Code configuration
```

---

## API Design

### REST Conventions
- **Base path**: `/api/v1`
- **HTTP methods**: Standard REST (GET, POST, PATCH, DELETE)
- **Status codes**:
  - 200: Success
  - 201: Created
  - 400: Validation error
  - 401: Unauthorized
  - 404: Not found
  - 409: Conflict (e.g., username already exists)
  - 500: Server error

### Response Format
**Success:**
```json
{
  "data": { ... },
  "success": true
}
```

**Error:**
```json
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": { ... }
  },
  "success": false
}
```

### API Endpoints

**Users:**
- `GET /api/v1/users/me` - Get current user
- `POST /api/v1/users/me/setup` - First-time username setup
- `PATCH /api/v1/users/me` - Update user settings

**Portfolio:**
- `GET /api/v1/snapshots` - Get all snapshots for user
- `POST /api/v1/snapshots` - Create new monthly snapshot
- `PATCH /api/v1/snapshots/:id` - Edit existing snapshot
- `DELETE /api/v1/snapshots/:id` - Delete snapshot
- `GET /api/v1/snapshots/:id/accounts` - Get accounts for a snapshot
- `POST /api/v1/snapshots/:id/accounts` - Add account to snapshot
- `PATCH /api/v1/accounts/:id` - Update account
- `DELETE /api/v1/accounts/:id` - Delete account

**Calculators:**
- `POST /api/v1/calculators/compound` - Run compound interest calculator
- `POST /api/v1/calculators/monte-carlo` - Run Monte Carlo simulation

**LLM Data Import:**
- `POST /api/v1/import/chat` - Process user message with LLM for data extraction
- `POST /api/v1/import/batch` - Batch insert snapshots (used by LLM)

### Versioning Strategy
- **Current**: `/api/v1`
- **Future**: Create `/api/v2` when breaking changes needed
- **Deprecation**: Keep old version for 6 months minimum

---

## Security

### Authentication
- **Provider**: Azure EasyAuth (Google + Facebook OAuth)
- **Backend validation**: User extracted from `x-ms-client-principal` header
- **Token**: EasyAuth handles token refresh automatically

### Input Validation
**Two-layer validation approach:**

1. **Input Validator**: Field-level validation
   - Null/undefined checks
   - Type validation
   - Format validation (dates, numbers)
   - String length limits
   - Regex patterns

2. **Business Validator**: Business logic validation
   - Uniqueness checks (username)
   - Conflict detection
   - Authorization checks (user owns resource)
   - Data integrity rules

**Implementation:**
- **Frontend**: React Hook Form + Zod schemas (UX feedback)
- **Backend**: Custom validation middleware (security)
- **Never trust client-side validation**

### CORS Configuration
- **Local development**: `http://localhost:5173` (Vite)
- **Production**: `https://finans-frontend.azurewebsites.net`
- **Credentials**: Allowed (for EasyAuth cookies)

### Rate Limiting
- **General endpoints**: 100 requests/minute per user
- **Calculator endpoints**: 10 requests/minute per user (expensive operations)
- **LLM endpoints**: 20 requests/minute per user
- **Implementation**: express-rate-limit middleware

### Secrets Management
- **Development**: `.env` files (gitignored)
- **Production**: Azure Key Vault
- **Never commit secrets to git**

### Data Protection
- **Encryption at rest**: Azure CosmosDB built-in encryption
- **Encryption in transit**: HTTPS only
- **PII handling**: Minimal storage, email optional
- **User data ownership**: Users can export/delete their data

### Security Best Practices
- Input sanitization (prevent XSS)
- Parameterized queries (prevent NoSQL injection)
- HTTP security headers (Helmet.js)
- CSRF protection (SameSite cookies)

---

## Development Setup

### Prerequisites
- **Node.js**: 18.x or 20.x
- **Package Manager**: pnpm

### Installation
```bash
pnpm install
```

### Running Workspaces

```bash
# Frontend dev server
pnpm --filter frontend dev

# Backend dev server
pnpm --filter backend dev

# Storybook
pnpm --filter components storybook

# All in parallel
pnpm dev
```

### Environment Variables

**Backend** ([.env](backend/.env))
```bash
# CosmosDB
COSMOS_DB_ENDPOINT=https://localhost:8081  # Emulator locally
COSMOS_DB_KEY=<emulator-key>              # From Key Vault in prod

# Authentication (EasyAuth configuration)
FACEBOOK_APP_ID=<facebook-app-id>
FACEBOOK_APP_SECRET=<facebook-app-secret>
GOOGLE_CLIENT_ID=<google-client-id>
GOOGLE_CLIENT_SECRET=<google-client-secret>

# OpenAI
OPENAI_API_KEY=<openai-api-key>

# Langfuse (LLM observability)
LANGFUSE_PUBLIC_KEY=<langfuse-public-key>
LANGFUSE_SECRET_KEY=<langfuse-secret-key>
LANGFUSE_HOST=http://localhost:3001      # Local Langfuse instance

# CORS
ALLOWED_ORIGINS=http://localhost:5173,https://finans-frontend.azurewebsites.net

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_CALCULATOR=10
RATE_LIMIT_LLM=20

# Environment
NODE_ENV=development
PORT=3000
```

**Frontend** ([.env](frontend/.env))
```bash
# API
VITE_API_URL=http://localhost:3000/api/v1

# Environment
VITE_APP_ENV=development
```

---

## Coding Standards

### File Naming
- **Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`, `PortfolioChart.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `formatCurrency.ts`, `calculateReturns.ts`)
- **Types**: `camelCase.types.ts` or `PascalCase.types.ts`

### Component Organization (Vertical Slicing)

Organize by feature, not by type:

```
/frontend/src/
  /features/
    /auth/
      - LoginPage.tsx
      - AuthContext.tsx
      - useAuth.ts
    /portfolio/
      - PortfolioPage.tsx
      - PortfolioTable.tsx
      - usePortfolio.ts
    /calculators/
      - CompoundCalculator.tsx
      - MonteCarloSimulation.tsx
    /dashboard/
      - DashboardPage.tsx
      - NetWorthChart.tsx
  /shared/
    /components/    - Shared UI components
    /hooks/         - Shared custom hooks
    /utils/         - Utility functions
```

### Import Order (ESLint Enforced)

1. External packages (alphabetical)
2. Internal packages/aliases (alphabetical)
3. Relative imports (alphabetical)

Example:
```typescript
// External
import { useState } from 'react'
import axios from 'axios'

// Internal
import { Button } from '@finans/components'
import { useAuth } from '@/features/auth'

// Relative
import { calculateNetWorth } from './utils'
import type { Portfolio } from './types'
```

### TypeScript
- **Strict mode**: Enabled
- **No `any` types**: Without justification
- **Interfaces**: Preferred for object shapes
- **Type inference**: Use where possible

### React Patterns
- **Components**: Functional components only
- **Hooks**: Custom hooks for reusable logic
- **Props**: Destructure in function signature
- **Return types**: Explicit for complex components

### State Management

**Use cases**:
- **Zustand**: UI state, user preferences, local data (cart-like state)
- **TanStack Query**: All API data, server state (portfolio data, calculations)
- **React Context**: Auth state (EasyAuth user info, permissions)
- **Local state (`useState`)**: Component-specific UI state (form inputs, toggles)

Example:
```typescript
// Zustand for UI preferences
const usePreferences = create((set) => ({
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode }))
}))

// TanStack Query for API data
const { data: portfolio } = useQuery({
  queryKey: ['portfolio'],
  queryFn: fetchPortfolio
})

// Context for auth
const { user } = useAuth()
```

### API Client Pattern
- **Axios instance**: With interceptors for auth and error handling
- **TanStack Query**: For all queries and mutations
- **Error handling**: Centralized via Axios interceptor
- **Type safety**: Request/response types for all endpoints

### Error Handling
- **React Error Boundaries**: For component errors
- **Axios Interceptor**: Global API error handler
- **User-friendly messages**: Translate errors for users
- **Logging**: Console logging for debugging

### Form Handling
- **React Hook Form**: For all forms
- **Validation**: Zod or Yup schemas
- **Accessibility**: Use BeerCSS/Material UI form components

### Language
**IMPORTANT**: All code, comments, and documentation MUST be in English.

- This applies even if prompts/requests are in Norwegian or other languages
- Variable names, function names, comments, documentation: English only
- Ensures international accessibility and consistency

---

## Observability

### Logging
- **Library**: Winston
- **Log levels**: error, warn, info, debug
- **Structured logging**: JSON format
- **Local**: Console output with colors
- **Production**: Azure App Service logs

**Log structure:**
```typescript
{
  timestamp: ISO8601,
  level: "info",
  message: "User created",
  context: {
    userId: "...",
    action: "user.created"
  }
}
```

### Error Tracking
- **Current**: No external error tracking
- **Future**: Consider Azure Application Insights or Sentry

### Performance Monitoring
- **Current**: Winston logging of slow operations
- **Future**: Application Insights for detailed metrics

---

## Norwegian Language & Formatting

### Language
- **UI Language**: Norwegian (Bokmål)
- **Implementation**: Hardcoded Norwegian text initially
- **Future**: react-i18next if internationalization needed

### Number Formatting
- **Library**: numeral.js
- **Format**: `123 456,78 kr`
  - Thousands separator: space
  - Decimal separator: comma
  - Currency symbol: kr (suffix)

**Example:**
```typescript
import numeral from 'numeral'

// Register Norwegian locale
numeral.register('locale', 'nb', {
  delimiters: {
    thousands: ' ',
    decimal: ','
  },
  currency: {
    symbol: 'kr'
  }
})

numeral.locale('nb')
numeral(123456.78).format('0,0.00') + ' kr'  // "123 456,78 kr"
```

### Date Formatting
- **Display format**: `dd.MM.yyyy` (01.01.2024)
- **Storage format**: ISO 8601 UTC
- **Library**: date-fns with `nb` locale
- **Timezone**: Europe/Oslo (for display)

### Currency
- **Default currency**: NOK (Norwegian Kroner)
- **Storage**: Decimal numbers (kroner, not øre)
- **Precision**: 2 decimal places
- **No multi-currency support** (future consideration)

---

## Authentication (EasyAuth)

### Integration
- **Provider**: Azure App Service EasyAuth
- **Methods**: Google OAuth + Facebook OAuth
- **Frontend**: Check auth state via React Context
- **Backend**: Validate headers from EasyAuth

### User Flow
1. User clicks login button
2. Redirects to EasyAuth (`/.auth/login/google` or `/.auth/login/facebook`)
3. EasyAuth handles OAuth flow
4. Redirects back to app
5. Frontend reads user from `/.auth/me` endpoint
6. Context provides user state to all components

### Implementation
```typescript
// Frontend: useAuth hook
const { user, isLoading } = useAuth()

// Backend: Validate user from headers
const user = req.headers['x-ms-client-principal']
```

---

## Component Library (`/components`)

### Purpose
- Shared, reusable components used by frontend
- **NOT published to npm** - stays in monorepo workspace
- Components bundled into frontend build automatically

### Development
- Develop components in Storybook
- Document props and usage in stories
- Export from main `index.ts` file

### Usage in Frontend
```typescript
import { Button, Card, DataTable } from '@finans/components'
```

### Deployment Strategy
- Components are **NOT deployed separately**
- When frontend builds, pnpm bundles components automatically
- Frontend deployment includes all component code
- Storybook builds separately for documentation (deployed to `finans-components`)

---

## LLM Integration for Data Import

### Purpose
Enable users to paste portfolio data (from Excel, text, etc.) into a chat interface and have an LLM extract and insert it into the database.

### Technology Stack
- **LLM Provider**: OpenAI API (user has credits)
- **Model**: GPT-4 or GPT-3.5-turbo
- **Observability**: Langfuse (deployed as separate Azure App Service)
- **Pattern**: Function calling / tool use

### Langfuse Setup
**Deployment:**
- **Local**: Separate folder in project (e.g., `/langfuse`)
- **Production**: Azure App Service (`finans-langfuse`)
- **Database**: PostgreSQL (Azure Database for PostgreSQL)

**Integration:**
```typescript
import { Langfuse } from 'langfuse'

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_HOST
})
```

### LLM Chat Interface
**User flow:**
1. User navigates to "Import Data" page
2. User pastes data from Excel (or types it)
3. Frontend sends message to `/api/v1/import/chat`
4. Backend calls OpenAI with function definitions
5. LLM extracts structured data (dates, accounts, values)
6. LLM calls tool to batch insert snapshots
7. Backend validates and inserts to CosmosDB
8. Frontend shows success + imported snapshots

**OpenAI Function Definitions:**
```typescript
const tools = [
  {
    type: "function",
    function: {
      name: "batch_insert_snapshots",
      description: "Insert multiple monthly snapshots with account balances",
      parameters: {
        type: "object",
        properties: {
          snapshots: {
            type: "array",
            items: {
              type: "object",
              properties: {
                date: { type: "string", description: "Date in dd.MM.yyyy format" },
                accounts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      value: { type: "number", description: "Value in NOK" },
                      assetClass: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
]
```

### Error Handling
- LLM fails to parse data → Ask user for clarification
- Invalid data format → Show validation errors
- Duplicate snapshots → Ask user to confirm overwrite

---

## Data Model Summary

### Core Entities

**User**
- `id`: Unique identifier (from EasyAuth)
- `username`: Unique, user-chosen
- `email`: Optional, user-controlled
- `createdAt`: Timestamp

**MonthlySnapshot**
- `id`: Unique identifier
- `userId`: Foreign key to User
- `date`: Snapshot date (1st of month, dd.MM.yyyy)
- `accounts`: Array of Account objects
- `totalNetWorth`: Calculated sum of all account values
- `createdAt`, `updatedAt`: Timestamps

**Account (embedded in MonthlySnapshot)**
- `id`: Unique identifier within snapshot
- `name`: User-defined (e.g., "Nordnet ASK")
- `assetClass`: Predefined or custom (e.g., "aksjer", "fond", "krypto", "bankkonto")
- `value`: Total value in NOK (decimal)
- `notes`: Optional text

### Relationships
- One User → Many MonthlySnapshots
- One MonthlySnapshot → Many Accounts (embedded)

### Asset Classes
**Predefined types:**
- `aksjer` (stocks)
- `fond` (funds)
- `krypto` (crypto)
- `bankkonto` (bank account)

**Custom types:**
- Users can enter any string as asset class
- No validation on custom types (flexible)

---

## Testing Strategy

### Playwright E2E Tests
- **Location**: `/e2e`
- **Focus**: Critical user flows
  - Login with Google/Facebook
  - Add/edit portfolio holdings
  - Run financial calculators
  - View dashboard and charts
- **Pattern**: Page Object Model
- **Timing**: Run before deployment

### Component Tests
- **Storybook**: Interaction tests
- **Visual regression**: Optional (Chromatic or Percy)

---

## Common Commands

### Development
```bash
pnpm dev                          # Run all workspaces
pnpm --filter frontend dev        # Frontend only
pnpm --filter backend dev         # Backend only
pnpm --filter components storybook # Storybook
```

### Building
```bash
pnpm build                        # Build all
pnpm --filter frontend build      # Frontend only
pnpm --filter backend build       # Backend only
pnpm --filter components build-storybook # Storybook
```

### Testing
```bash
pnpm test:e2e                     # Playwright tests
pnpm lint                         # Lint all workspaces
pnpm format                       # Format code with Prettier
```

---

## Azure Deployment

### Azure Resources

**Resource Group**: `finans`

```
finans (Resource Group)
   finans-frontend     � React app (includes bundled components)
   finans-backend      � Express API server
   finans-components   � Storybook static documentation site
```

### Deployment Strategy

**1. finans-frontend** (App Service)
- Deploys built React application
- Includes bundled components from `/components` workspace
- Vite builds everything into static files
- EasyAuth configured for Google + Facebook OAuth

**2. finans-backend** (App Service)
- Deploys Express API server
- TypeScript compiled to JavaScript
- EasyAuth validates user sessions via headers

**3. finans-components** (App Service)
- Deploys Storybook as static HTML site
- Component documentation and showcase
- No authentication needed (internal documentation)

### Build Commands
```bash
# Frontend (includes components)
cd frontend && pnpm build

# Backend
cd backend && pnpm build

# Storybook
cd components && pnpm build-storybook
```

### Workspace Dependencies
```json
// frontend/package.json
{
  "dependencies": {
    "@finans/components": "workspace:*"
  }
}
```

pnpm automatically resolves and bundles components during frontend build. **No npm publishing or private registry needed**.

---

## Development Workflow

### Git Workflow
- **Strategy**: Trunk-based development
- **Main branch**: `main` (always deployable)
- **Feature branches**: Short-lived, merge via PR
- **PR requirements**:
  - Code review required
  - CI tests must pass
  - No merge conflicts
- **Commit messages**: Conventional Commits format
  - `feat:` New features
  - `fix:` Bug fixes
  - `docs:` Documentation
  - `refactor:` Code refactoring
  - `test:` Test changes
  - `chore:` Build/config changes

### CI/CD Pipeline
**GitHub Actions workflows:**

1. **[.github/workflows/ci.yml](.github/workflows/ci.yml)** - Continuous Integration
   - Trigger: Push to any branch, PR to main
   - Steps:
     - Install dependencies (pnpm)
     - Lint (ESLint)
     - Type check (TypeScript)
     - Run unit tests
     - Build all workspaces

2. **[.github/workflows/deploy.yml](.github/workflows/deploy.yml)** - Deployment
   - Trigger: Push to `main` branch
   - Steps:
     - Build frontend (includes components)
     - Build backend
     - Build Storybook
     - Deploy to Azure App Services:
       - finans-frontend
       - finans-backend
       - finans-components (Storybook)

### Local Development
**CosmosDB Emulator:**
- **Location**: [emulator.bat](emulator.bat) in project root
- **Command**: `npx @azure/cosmos-emulator start`
- **Endpoint**: `https://localhost:8081`
- **Data persistence**: Optional (configure in script)

**Environment setup:**
```bash
# Install dependencies
pnpm install

# Start CosmosDB Emulator
./emulator.bat

# Start all workspaces
pnpm dev

# Or individual workspaces
pnpm --filter frontend dev
pnpm --filter backend dev
pnpm --filter components storybook
```

### Adding a New Feature

1. Create feature folder in `/frontend/src/features/<feature-name>/`
2. Build components (reuse shared components from `/components`)
3. Create Zustand store if needed for client state
4. Use TanStack Query for API calls
5. Add Playwright test for critical user path
6. Update Storybook if creating new shared components

### Adding a New API Endpoint

1. Add route in `/backend/src/routes/`
2. Add controller logic
3. Document in code if complex
4. **No type sharing** - frontend maintains its own types

### Adding a New Shared Component

1. Create component in `/components/src/`
2. Export from `/components/src/index.ts`
3. Create Storybook story in `/components/src/*.stories.tsx`
4. Use in frontend: `import { Component } from '@finans/components'`

---

## Business Domain

### Application Purpose

Portfolio and wealth tracking application for anyone who monitors their investments and net worth on a **monthly basis**. Focus on long-term financial planning, investment tracking, and future projections.

### Important Distinctions

 **Portfolio tracking** - Track investments across all asset classes
 **Net worth monitoring** - High-level financial overview
 **Future planning** - Projections and scenario modeling

L **NOT a budgeting app** - No detailed budget categories or spending plans
L **NOT an expense tracker** - No transaction-level or receipt tracking

### Target Users

Anyone who wants to track their portfolio monthly, including:
- Long-term investors monitoring their wealth growth
- F.I.R.E. enthusiasts planning financial independence
- People managing diverse portfolios (stocks, crypto, real estate)
- Anyone wanting a complete financial picture without daily expense tracking

### Core Features

**1. Financial Tools Collection**
- Compounding calculator
- Monte Carlo simulations for retirement scenarios
- Additional calculators (to be defined)

**2. Portfolio Tracker**
- Multi-asset class support: stocks, funds, crypto, bonds, real estate, etc.
- Cross-asset total net worth view
- Manual entry + AI-assisted import capabilities
- Historical performance tracking

**3. Visualizations (D3.js)**
- Loan amortization and payoff projections
- Asset allocation and growth over time
- Future projections (retirement scenarios, savings goals)
- Historical performance analysis
- Net worth timeline

### User Model

- **Single-user accounts** (personal finance)
- **Authentication**: EasyAuth (Google/Facebook)
- **Privacy-focused**: Anonymized database storage
- **Data ownership**: User owns and can export their data

### Key Workflows

**1. F.I.R.E. Planning** (Primary use case)
- Track current net worth across all asset classes
- Calculate savings rate
- Project time to financial independence
- Model different retirement scenarios
- Visualize progress toward F.I.R.E. goals

**2. Portfolio Management**
- Add/update holdings (manual or AI-assisted)
- View total portfolio allocation
- Track performance over time
- Rebalancing insights

**3. Financial Calculations**
- Run compound interest scenarios
- Monte Carlo simulations for retirement planning
- Loan payoff strategies
- Future value projections

### Data Management

- **Input**: Manual entry + AI-assisted import (smart data extraction)
- **Storage**: Backend database (anonymized for privacy)
- **Privacy**: No PII unless necessary, encryption at rest
- **Export**: Users can export all their data

### Key Metrics & Concepts

- **Net Worth**: Total assets - total liabilities
- **Savings Rate**: (Income - Expenses) / Income
- **F.I.R.E. Number**: Target wealth for financial independence (typically 25x annual expenses)
- **Asset Allocation**: Distribution across stocks, bonds, crypto, real estate, etc.
- **Withdrawal Rate**: Safe withdrawal percentage (e.g., 4% rule)
- **Coast FI**: Point where existing savings will grow to FI without additional contributions

### Value Proposition

1. **Privacy First**: Anonymized data, user-controlled
2. **Easy Import**: AI-assisted data entry reduces manual work
3. **Total Overview**: Complete financial picture across all asset classes
4. **F.I.R.E. Focus**: Purpose-built for financial independence planning

### Domain Terminology

- **F.I.R.E.**: Financial Independence, Retire Early
- **Coast FI**: Financial independence through investment growth alone
- **Lean FI**: Minimal lifestyle financial independence
- **Fat FI**: Comfortable lifestyle financial independence
- **Asset Classes**: Stocks, bonds, crypto, real estate, cash, etc.
- **Drawdown**: Withdrawal phase in retirement
- **Sequence of Returns Risk**: Impact of market timing on retirement outcomes

---

## Architecture Decisions

### Why pnpm Workspaces?
- Better performance than npm workspaces
- Strict dependency resolution
- Efficient disk space usage

### Why NOT Publish Components to npm?
- Components only used by this frontend
- Simpler workflow (no versioning, no publishing)
- Faster development (changes immediately available)
- pnpm automatically bundles components into frontend build

### Why Zustand + TanStack Query?
- **Zustand**: Simple, minimal boilerplate for UI state
- **TanStack Query**: Specialized for server state with built-in caching
- **Separation of concerns**: Client state vs server state

### Why D3.js for Visualizations?
- Maximum flexibility for custom financial charts
- Handles complex data transformations
- Industry standard for data visualization

### Why Azure EasyAuth?
- Built-in OAuth support (no custom implementation)
- Integrates seamlessly with App Service
- Handles token refresh automatically

---

## Getting Help

- **Claude Code Issues**: Report at https://github.com/anthropics/claude-code/issues
- **Project Issues**: Track in `/issue-tracking/` folder
- **Documentation**: Check `/docs/` folder for additional guides
