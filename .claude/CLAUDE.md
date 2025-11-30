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

### Development Tools
- **Playwright MCP**: Browser automation via Model Context Protocol for visual inspection during development
  - Navigate to pages, capture snapshots, interact with elements
  - Use for verifying UI implementations match design drafts
  - Inspect rendered components and layouts in real browser

---

## Database & Data Layer

### Technology
- **Database**: Azure CosmosDB (NoSQL)
- **Local Development**: CosmosDB Emulator (run via `emulator.bat` using npx)
- **Data Access**: CosmosDB SDK for Node.js (@azure/cosmos)

### Container Strategy

**Container: `users`**
- **Partition Key**: `/id` (userId)
- **Documents**: User with profile and account configurations
```typescript
{
  id: string              // userId (from EasyAuth token)
  nickname: string        // Display name
  email: string           // User email
  createdAt: Date
  updatedAt: Date
  profile: {
    monthlySalary: number       // Monthly income for savings rate
    annualExpenses: number      // Yearly expenses for F.I.R.E. calc
    birthYear: number           // For pension projections
    plannedRetirementAge: number
    fireNumber?: number         // Optional custom F.I.R.E. target
  }
  accounts: [             // Account configurations (not balances)
    {
      id: string
      name: string        // "Nordnet ASK", "Huslån", etc.
      category: 'sparing' | 'gjeld' | 'pensjon'
      isActive: boolean   // Hide inactive accounts from UI
      sortOrder: number   // Display order within category
      createdAt: Date
      loanDetails?: {     // Only for gjeld accounts
        interestRate: number
        remainingYears: number
        originalAmount?: number
      }
    }
  ]
}
```

**Container: `portfolios`**
- **Partition Key**: `/userId`
- **Documents**: Monthly snapshots with denormalized account data
```typescript
{
  id: string              // snapshotId (e.g., "snap-2024-01")
  userId: string
  date: string            // "dd.MM.yyyy" format (e.g., "01.01.2024")
  accounts: [             // Denormalized account data per snapshot
    {
      id: string          // Account identifier (e.g., "acc-nordnet")
      name: string        // Display name (e.g., "Nordnet")
      assetClass: string  // "aksjer", "fond", "krypto", "bankkonto", "gjeld", "pensjon"
      value: number       // Value in NOK (negative for debt)
    }
  ]
  totalNetWorth: number   // Sum of all account values
  createdAt: Date
  updatedAt: Date
}
```

### Design Rationale
- **Denormalized snapshots**: Each snapshot stores full account data for historical accuracy
- **Category-based**: Three categories (sparing, gjeld, pensjon) for grouping
- **Co-location**: All user data in same partition (userId) for fast queries
- **Optimistic updates**: No immutable history - users can edit any snapshot
- **Inactive accounts**: Can hide old accounts without deleting historical data

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
package.json       - Root workspace configuration
pnpm-workspace.yaml - pnpm workspace config
.claude/           - Claude Code configuration
.docs/             - All documentation (reserved folder)
.task-board/       - Backlog tasks and planning board (reserved folder)
```

### Reserved Folders

**.docs/**
- **Purpose**: Central location for all project documentation
- **Content**: Technical docs, architecture decisions, guides, and reference materials
- **Management**: Keep documentation organized and accessible

**.task-board/**
- **Purpose**: Task backlog and planning board
- **Content**: Feature requests, bugs, improvements, and project planning
- **Management**: Track work items and maintain development roadmap

---

## Design System

### Design Drafts
The approved design is documented in static HTML/CSS files for reference during implementation:
- **Location**: [.docs/design-drafts/](.docs/design-drafts/)
- **Approved Design**: Nordic Minimal (draft-1-*)

### Design Aesthetic: Nordic Minimal
Scandinavian-inspired design with warm, muted tones and elegant typography. Clean, spacious layouts with subtle texture overlay.

### Color Palette
```css
:root {
  --bone: #F5F2ED;           /* Primary background */
  --warm-white: #FDFCFA;     /* Cards, elevated surfaces */
  --charcoal: #2C2C2C;       /* Primary text */
  --muted-sage: #8B9A7D;     /* Positive values, savings */
  --soft-terracotta: #C4A484; /* Accent */
  --pale-blue: #B8C5D0;      /* Secondary accent */
  --text-secondary: #6B6B6B; /* Muted text */
  --gold: #C9A962;           /* Milestone highlights */
  --positive: #5A7D5A;       /* Positive changes */
  --negative: #9D6B5A;       /* Negative changes */
  --border: rgba(44, 44, 44, 0.08);
}
```

### Typography
- **Headings**: Cormorant Garamond (serif, light weight)
- **Body**: DM Sans (sans-serif)
- **Numbers/Data**: JetBrains Mono (monospace)

### Visual Elements
- Subtle grain texture overlay on all pages (SVG noise filter)
- Fade-up animations on page load
- Hover states with subtle background shifts and lift effect
- Cards with minimal border-radius (2px)
- Consistent spacing: 48px/64px/80px sections

---

## Application Structure

### Navigation Flow
```
┌─────────┐    ┌────────────┐    ┌─────────┐    ┌───────┐    ┌──────────┐    ┌──────────────┐
│ Oversikt│ →  │ Portefølje │ →  │ Sparing │ →  │ Gjeld │ →  │ Pensjon  │ →  │ Kalkulatorer │
│ (home)  │    │ (data hub) │    │ (F.I.R.E)│   │ (debt)│    │(pension) │    │  (tools)     │
└─────────┘    └────────────┘    └─────────┘    └───────┘    └──────────┘    └──────────────┘
```

### Shared Layout Components

**Header** (all pages)
- Logo: "finans" (Cormorant Garamond, lowercase, letter-spacing)
- Navigation: 6 tabs with active state
- Avatar: User initials in circle

**Page Structure**
- Container: max-width 1200px (900px for focused pages)
- Page header: Title + subtitle
- Content sections with consistent spacing

---

## Pages & Components

### 1. Oversikt (Dashboard)
**File**: [draft-1-nordic-minimal.html](.docs/design-drafts/draft-1-nordic-minimal.html)

**Purpose**: High-level financial overview and entry point to all sections.

**Components**:
| Component | Description | Data |
|-----------|-------------|------|
| `PageHeader` | Greeting + current month | "God morgen, {name}" / "November 2024" |
| `HeroNumber` | Large centered value with change badge | Netto formue, +X.XX% denne måneden |
| `QuickStatsGrid` | 4 clickable stat cards | Sum sparing, Sum gjeld, Pensjon, Sparerate |
| `MilestoneCard` | Dark card with progress bar | Target milestone (e.g., 1M), progress %, remaining |
| `SectionLinks` | 3 navigation cards with arrows | Portefølje, Sparing & F.I.R.E., Kalkulatorer |

**User Flow**: Landing page → Quick overview → Navigate to detail pages

---

### 2. Portefølje (Portfolio)
**File**: [draft-1-portfolio.html](.docs/design-drafts/draft-1-portfolio.html)

**Purpose**: Central data entry and historical view of all accounts.

**Components**:
| Component | Description | Data |
|-----------|-------------|------|
| `Breadcrumb` | Navigation path | Oversikt → Portefølje |
| `PageHeader` | Title + action buttons | "Portefølje", Eksporter, + Ny måned |
| `TableHeader` | Title + controls | "Månedlig historikk", year filter, search |
| `SpreadsheetTable` | Main data table with collapsible groups | Monthly snapshots with account values |
| `TableFooter` | Info + toggles + pagination | "Viser X av Y måneder", column toggles, page nav |

**Table Structure**:
```
┌──────┬─────────────────────────────────────────┬───────────────┬────────────────┐
│ Dato │ SPARING (collapsible)                   │ GJELD         │ PENSJON        │
│      ├─────────┬─────────┬─────┬─────┬────┬────┼───────┬───────┼──────┬─────────┤
│      │Nordnet  │Bouvet   │Yolo │Firi │Kron│S/K │SBanken│Sum    │Arb.  │Sum      │
│      │ASK      │ASK      │     │     │    │    │       │gjeld  │giver │pensjon  │
└──────┴─────────┴─────────┴─────┴─────┴────┴────┴───────┴───────┴──────┴─────────┘
```

**Features**:
- Sticky date column (first column always visible)
- Collapsible column groups (click header to toggle)
- Gold milestone highlights (★) for threshold crossings
- Column visibility toggles in footer
- Norwegian number formatting (space as thousands separator)

**Account Categories**:
| Category | Color | Accounts |
|----------|-------|----------|
| Sparing | `#5a6d7a` | Investment accounts, savings accounts |
| Gjeld | `#8a7060` | Loans, mortgages |
| Pensjon | `#6a7a60` | Employer pension, NAV |

---

### 3. Sparing (Savings & F.I.R.E.)
**File**: [draft-1-sparing.html](.docs/design-drafts/draft-1-sparing.html)

**Purpose**: Track savings progress and F.I.R.E. journey.

**Components**:
| Component | Description | Data |
|-----------|-------------|------|
| `PageHeader` | Title + subtitle | "Sparing", "Din vei mot økonomisk frihet" |
| `HeroNumber` | Large centered value | Sum sparing, +X.XX% i {year} |
| `StatsRow` | 3 stat cards | Sparerate %, Siste måned %, Måneder fri |
| `FireSection` | F.I.R.E. progress panel | Title, progress bar, 4 key metrics |
| `ChartSection` | Line/area chart | Spareutvikling over time |

**F.I.R.E. Metrics**:
- Firetall: Target wealth for FI (e.g., 6.4M)
- Min. pensjonsalder: Earliest retirement age
- År til årslønn: Years until savings = annual salary
- Årlig uttak (4%): Annual withdrawal at 4% rule

---

### 4. Gjeld (Debt)
**File**: [draft-1-gjeld.html](.docs/design-drafts/draft-1-gjeld.html)

**Purpose**: Track debt and coverage progress.

**Components**:
| Component | Description | Data |
|-----------|-------------|------|
| `PageHeader` | Title + subtitle | "Gjeld", "Oversikt over lån og nedbetaling" |
| `HeroNumber` | Large centered value | Sum gjeld, -X kr denne måneden |
| `DekningSection` | Donut chart + info | Coverage %, remaining amount, explanation |
| `LoansList` | List of active loans | Loan name, interest rate, term, balance |
| `ChartSection` | Area chart | Gjeldsutvikling (declining trend) |

**Dekning (Coverage)**: Shows how much of debt is covered by savings. At 100%, user has zero net debt.

---

### 5. Pensjon (Pension)
**File**: [draft-1-pensjon.html](.docs/design-drafts/draft-1-pensjon.html)

**Purpose**: Track pension savings and projections.

**Components**:
| Component | Description | Data |
|-----------|-------------|------|
| `PageHeader` | Title + subtitle | "Pensjon", "Oppspart pensjon og fremtidig utbetaling" |
| `HeroNumber` | Large centered value | Sum pensjon, "Estimert ved pensjonering" |
| `BreakdownCards` | 2 cards side by side | Arbeidsgiver (70%), NAV (30%) |
| `OtpSection` | Progress bar | OTP som prosent av total |
| `ChartSection` | Stacked area chart | Pensjonsutvikling (Arbeidsgiver vs NAV) |

**Pension Sources**:
- Arbeidsgiver: Employer pension (OTP - obligatorisk tjenestepensjon)
- NAV: Government pension

---

### 6. Kalkulatorer (Calculators)
**File**: [draft-1-kalkulatorer.html](.docs/design-drafts/draft-1-kalkulatorer.html)

**Purpose**: Financial calculation tools.

**Components**:
| Component | Description | Data |
|-----------|-------------|------|
| `PageHeader` | Centered title + subtitle | "Kalkulatorer", "Verktøy for å planlegge din økonomi" |
| `CalculatorGrid` | 2x2 grid of calculator cards | 4 calculator options |

**Calculators**:
| Calculator | Icon | Description |
|------------|------|-------------|
| Renters rente | 📈 | Compound interest calculator |
| F.I.R.E. kalkulator | 🎯 | Time to financial independence |
| Lånekalkulator | 🏠 | Monthly payments and total interest |
| Monte Carlo | 🎲 | Retirement scenario simulations |

---

## Data Flow

### Monthly Snapshot Entry
```
1. User clicks "+ Ny måned" on Portfolio page
2. Modal/form opens for new month entry
3. User enters values for each account
4. System calculates totals (Sum sparing, Sum gjeld, Sum pensjon)
5. System detects milestone crossings → marks with gold
6. Data saved to CosmosDB
7. All pages update with new data
```

### Calculated Values
| Value | Formula | Used On |
|-------|---------|---------|
| Netto formue | Sum sparing - Sum gjeld | Oversikt |
| Dekning | Sum sparing / Sum gjeld × 100 | Gjeld |
| Sparerate | (Inntekt - Utgifter) / Inntekt × 100 | Oversikt, Sparing |
| Firetall | Årlige utgifter × 25 | Sparing |
| Måneder fri | Sum sparing / Månedlige utgifter | Sparing |

### Milestone Detection
```typescript
// Check if value crosses threshold for first time
function detectMilestone(currentValue: number, previousValue: number): number | null {
  const thresholds = [
    // 10k increments up to 100k
    10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000,
    // 100k increments up to 1M
    100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000,
    // 1M increments beyond
    1000000, 2000000, 3000000, ...
  ];

  for (const threshold of thresholds) {
    if (previousValue < threshold && currentValue >= threshold) {
      return threshold; // First crossing of this threshold
    }
  }
  return null;
}
```

---

## Component Patterns

### HeroNumber
Large, centered value with optional change indicator.
```
┌─────────────────────────────────────┐
│          LABEL (small caps)         │
│         1 234 567 kr                │
│         (huge Cormorant)            │
│      ┌──────────────────┐           │
│      │ +2.33% denne mnd │           │
│      └──────────────────┘           │
└─────────────────────────────────────┘
```

### StatCard
Clickable card with value and label.
```
┌─────────────────┐
│   970 194 kr    │  ← Cormorant, 32px
│   Sum sparing   │  ← Small caps, secondary
└─────────────────┘
```

### ProgressBar
Horizontal progress with labels.
```
┌─────────────────────────────────────┐
│ [████████████████████░░░] 97%       │
│ Gjenstår: 29 806 kr                 │
└─────────────────────────────────────┘
```

### CollapsibleGroup
Table column group that collapses to show only total.
```
Expanded:                          Collapsed:
┌─────┬─────┬─────┬───────┐       ┌───────┐
│Col1 │Col2 │Col3 │ Total │  →    │ Total │
└─────┴─────┴─────┴───────┘       └───────┘
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
- `GET /api/v1/users/me` - Get current user with profile and accounts
- `POST /api/v1/users/me/setup` - First-time user setup (nickname, profile)
- `PATCH /api/v1/users/me` - Update user settings
- `PATCH /api/v1/users/me/profile` - Update user profile (salary, expenses, etc.)

**Accounts** (account configurations, stored in User):
- `GET /api/v1/accounts` - Get all accounts for user
- `POST /api/v1/accounts` - Create new account config
- `PATCH /api/v1/accounts/:id` - Update account config
- `DELETE /api/v1/accounts/:id` - Delete account config (and related balances)

**Snapshots** (monthly balances):
- `GET /api/v1/snapshots` - Get all snapshots for user
- `POST /api/v1/snapshots` - Create new monthly snapshot
- `PATCH /api/v1/snapshots/:id` - Edit snapshot balances
- `DELETE /api/v1/snapshots/:id` - Delete snapshot

**Aggregated Data** (for pages):
- `GET /api/v1/dashboard` - Dashboard data (net worth, stats, milestones)
- `GET /api/v1/sparing` - Sparing page data (savings, F.I.R.E. progress)
- `GET /api/v1/gjeld` - Gjeld page data (debt, coverage, loans)
- `GET /api/v1/pensjon` - Pensjon page data (pension breakdown)

**Calculators:**
- `POST /api/v1/calculators/compound` - Run compound interest calculator
- `POST /api/v1/calculators/fire` - Run F.I.R.E. calculator
- `POST /api/v1/calculators/loan` - Run loan calculator
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
- `nickname`: Display name
- `email`: User email
- `createdAt`, `updatedAt`: Timestamps
- `profile`: UserProfile (embedded)
- `accounts`: AccountConfig[] (embedded)

**UserProfile** (embedded in User)
- `monthlySalary`: Monthly income for savings rate calculation
- `annualExpenses`: Yearly expenses for F.I.R.E. calculation
- `birthYear`: For pension projections
- `plannedRetirementAge`: Target retirement age
- `fireNumber`: Optional custom F.I.R.E. target (defaults to 25x expenses)

**AccountConfig** (embedded in User)
- `id`: Unique identifier
- `name`: User-defined (e.g., "Nordnet ASK", "Huslån")
- `category`: 'sparing' | 'gjeld' | 'pensjon'
- `isActive`: Boolean for hiding old accounts
- `sortOrder`: Display order within category
- `createdAt`: Timestamp
- `loanDetails`: Optional LoanDetails for gjeld accounts

**LoanDetails** (embedded in AccountConfig)
- `interestRate`: Interest rate percentage
- `remainingYears`: Years left on loan
- `originalAmount`: Optional original loan amount

**MonthlySnapshot**
- `id`: Unique identifier
- `userId`: Foreign key to User
- `date`: Snapshot date (1st of month, UTC)
- `createdAt`, `updatedAt`: Timestamps
- `balances`: AccountBalance[] (embedded)

**AccountBalance** (embedded in MonthlySnapshot)
- `accountId`: Foreign key to AccountConfig.id
- `balance`: Value in NOK

### Relationships
- One User → Many AccountConfigs (embedded)
- One User → Many MonthlySnapshots
- One MonthlySnapshot → Many AccountBalances (embedded, references AccountConfig by ID)

### Categories
- `sparing`: Savings and investments (bank, stocks, funds, crypto)
- `gjeld`: Debt (loans, mortgages)
- `pensjon`: Pension (employer, government)

### Default Accounts
Created on user signup:
- Bank (sparing)
- Fond (sparing)
- Huslån (gjeld)
- Studielån (gjeld)
- Arbeidsgiver (pensjon)
- Folketrygden (pensjon)

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

### Visual Development with Playwright MCP

Use Playwright MCP tools during development to visually inspect and verify implementations:

**Common workflows:**
- **Verify design implementation**: Navigate to a page and capture snapshot to compare against design drafts
- **Debug layout issues**: Inspect element positioning, spacing, and responsive behavior
- **Test interactions**: Click buttons, fill forms, verify state changes
- **Cross-browser checks**: Verify rendering consistency

**Available MCP tools:**
- `browser_navigate` - Open a URL in the browser
- `browser_snapshot` - Capture accessibility tree (preferred for understanding page structure)
- `browser_take_screenshot` - Capture visual screenshot
- `browser_click` - Click on elements
- `browser_type` - Type text into inputs
- `browser_fill_form` - Fill multiple form fields

**Example workflow:**
```
1. Start frontend dev server: pnpm --filter frontend dev
2. Use browser_navigate to open http://localhost:5173
3. Use browser_snapshot to see page structure
4. Compare against design draft in .docs/design-drafts/
5. Iterate on implementation
```

### Adding a New Feature

1. Create feature folder in `/frontend/src/features/<feature-name>/`
2. Build components (reuse shared components from `/components`)
3. Create Zustand store if needed for client state
4. Use TanStack Query for API calls
5. **Use Playwright MCP to visually verify implementation matches design**
6. Add Playwright test for critical user path
7. Update Storybook if creating new shared components

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

## NOTES FROM THE USER
- USER IS A SENIOR DEV WITH GOOD KNOWLEDGE OF SOFTWARE DEVELOPMENT. USER EXPECTS SENIOR DEVELOPER LEVEL WORK.
- DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG, FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY.
- BE CLEAR AND CONSISTANT. SACRIFICE GRAMMER FOR SHORT, CONSISTANT LANGUAGE. EXPRESS YOURSELF TO THE POINT.