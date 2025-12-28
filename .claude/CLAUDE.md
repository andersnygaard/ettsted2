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
- **Styling**: Custom CSS (Nordic Minimal design system) + Material UI
- **Visualizations**: D3.js
- **State Management**: TanStack Query (server state) + React Context (auth)
- **HTTP Client**: Axios
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
- **Styling**: Custom CSS (Nordic Minimal design system) + Material UI
- **Distribution**: Workspace co-hosting (bundled into frontend)

### Testing (`/e2e`)
- **Framework**: Playwright
- **Strategy**: Integration + E2E tests only. No unit tests.
- **Pattern**: Sanity check suite with fixtures
- **Focus**: Page health, navigation, auth flows
- **Docs**: See [e2e/README.md](../e2e/README.md)
- **Rationale**: Test larger components through integration tests; verify user flows via E2E. Avoids brittle unit tests on implementation details.

---

## Database & Data Layer

### Technology
- **Database**: Azure CosmosDB (NoSQL)
- **Local Development**: CosmosDB Emulator (run via `emulator.bat` using npx)
- **Data Access**: CosmosDB SDK for Node.js (@azure/cosmos)
- **Date Sorting**: CosmosDB string sort on "dd.MM.yyyy" is alphabetical, not chronological. Always sort dates in JS using `compareDatesAsc` from `backend/src/utils/dateUtils.ts`.

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
    monthlySavings: number      // Monthly savings (annualExpenses derived as (salary - savings) * 12)
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
- **Date sorting**: Dates in "dd.MM.yyyy" format don't sort correctly as strings. Backend uses `dateUtils.ts` to parse and sort in JS after fetching.

### Demo Login
- **Endpoint**: `POST /api/v1/auth/demo-login`
- **Availability**: All environments including production
- **Flow**: Seeds demo user and snapshots INTO database on login. All pages fetch from database - no mock mode bypass.
- **Data**: 12 months of realistic portfolio data generated in `authRoutes.ts`

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

---

## Design System

### Design Drafts
- **Location**: [.docs/design-drafts/](.docs/design-drafts/)
- **Approved Design**: Nordic Minimal (draft-1-*)

### CSS Tokens
**Location**: `@finans/components/styles/tokens.css`
**Import**: `@import '@finans/components/styles/tokens.css'`

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

### Layout Rules
- **PageHeader**: Always centered (`text-align: center`). Never left-aligned.

### Mobile-First Strategy

**Principle**: Write mobile styles first, then add complexity for larger screens via `min-width` queries.

**Breakpoints** (defined in `tokens.css`):
```css
--breakpoint-sm: 640px;   /* Small tablets */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
```

**CSS Pattern**:
```css
/* Base: mobile styles (no media query) */
.component {
  flex-direction: column;
  padding: var(--space-md);
  gap: var(--space-sm);
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    flex-direction: row;
    padding: var(--space-lg);
    gap: var(--space-md);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

**Rules**:
1. **NEVER use `max-width` media queries** - always `min-width` (mobile-first)
2. **Base styles = mobile** - no media query wrapping for mobile
3. **Progressive enhancement** - add features/complexity as screen grows
4. **Touch targets**: min 44x44px on mobile (use `--touch-target-min`)
5. **Stack on mobile, row on desktop** - default pattern for layouts
6. **Hide non-essential on mobile** - use `display: none` at base, show at breakpoint

**Component Checklist**:
- [ ] Works on 320px width (small phones)
- [ ] Touch targets are 44px minimum
- [ ] Text is readable without zoom
- [ ] No horizontal scroll
- [ ] Forms are single-column on mobile

---

## Pages

| Page | Purpose | Design Draft |
|------|---------|--------------|
| **Oversikt** | Dashboard with net worth, quick stats, milestone progress | [draft-1-nordic-minimal.html](.docs/design-drafts/draft-1-nordic-minimal.html) |
| **Portefølje** | SpreadsheetTable for monthly snapshots, data entry, export | [draft-1-portfolio.html](.docs/design-drafts/draft-1-portfolio.html) |
| **Sparing** | Savings total, F.I.R.E. progress, historical chart | [draft-1-sparing.html](.docs/design-drafts/draft-1-sparing.html) |
| **Gjeld** | Debt total, coverage %, loan list, historical chart | [draft-1-gjeld.html](.docs/design-drafts/draft-1-gjeld.html) |
| **Pensjon** | Pension breakdown (OTP vs NAV), historical chart | [draft-1-pensjon.html](.docs/design-drafts/draft-1-pensjon.html) |
| **Kalkulatorer** | Compound, F.I.R.E., Loan, Monte Carlo calculators | [draft-1-kalkulatorer.html](.docs/design-drafts/draft-1-kalkulatorer.html) |
| **Import** | LLM chatbot for pasting/importing portfolio data | - |
| **Min Økonomi** | User settings: profile, accounts config (via OnboardingWizard) | - |

**Note**: "Min Økonomi" is the single settings page. No separate "Innstillinger" page exists.

**Key Features**:
- Collapsible column groups in SpreadsheetTable
- Gold milestone highlights for threshold crossings
- Dekning (coverage) = savings / debt percentage
- Export button on portfolio page

---

## Calculated Values

| Value | Formula | Used On |
|-------|---------|---------|
| Netto formue | Sum sparing - Sum gjeld | Oversikt |
| Dekning | Sum sparing / Sum gjeld × 100 | Gjeld |
| Sparerate | Månedlig sparing / Månedlig inntekt × 100 | Oversikt, Sparing |
| Årlige utgifter | (Månedlig inntekt - Månedlig sparing) × 12 | Derived |
| Firetall | Årlige utgifter × 25 | Sparing |
| Måneder fri | Sum sparing / Månedlige utgifter | Sparing |

---

## API Design

### REST Conventions
- **Base path**: `/api/v1`
- **Route naming**: Norwegian names with æøå replaced by aoa (e.g., `/portefolje` not `/portefølje`, `/okonomi` not `/økonomi`)
- **HTTP methods**: Standard REST (GET, POST, PATCH, DELETE)
- **Status codes**: 200 (Success), 201 (Created), 400 (Validation), 401 (Unauthorized), 404 (Not found), 500 (Server error)

### Response Format
```json
// Success
{ "data": { ... }, "success": true }

// Error
{ "error": { "message": "...", "code": "..." }, "success": false }
```

### Endpoints

**Users**: `GET/PATCH /users/me`, `POST /users/me/setup`
**Accounts**: `GET/POST/PATCH/DELETE /accounts`
**Snapshots**: `GET/POST/PATCH/DELETE /snapshots`
**Aggregated**: `GET /oversikt`, `GET /sparing`, `GET /gjeld`, `GET /pensjon`
**Calculators**: `POST /kalkulatorer/{rentes-rente|fire|lan|monte-carlo}`
**Import**: `POST /import/chat`

---

## Security

### Authentication
- **Provider**: Azure EasyAuth (Google + Facebook OAuth)
- **Backend validation**: User extracted from `x-ms-client-principal` header

### Rate Limiting
- **General**: 100 req/min per user
- **Calculator**: 10 req/min per user
- **LLM**: 20 req/min per user
- **Implementation**: express-rate-limit middleware

### Security Features
- Input validation (backend middleware)
- HTTP security headers (Helmet.js with explicit CSP)
- CORS configured for frontend origin (rejects no-origin in production)
- HTTPS only

### Zod Validation
- **Stripping**: Zod schemas strip unknown fields by default. If frontend sends extra fields, add them to the schema or they'll be dropped.
- **Location**: `backend/src/validators/schemas.ts`

---

## Development Setup

### Prerequisites
- Node.js 18.x or 20.x
- pnpm

### Commands
```bash
pnpm install                      # Install deps
pnpm dev                          # Run all workspaces
pnpm --filter frontend dev        # Frontend only
pnpm --filter backend dev         # Backend only
pnpm --filter components storybook # Storybook
pnpm build                        # Build all
pnpm --filter e2e test:smoke      # Fast sanity tests (PR checks)
pnpm --filter e2e test:full       # Full E2E suite (nightly)
```

### Environment Variables

**Backend** (`.env`): `COSMOS_DB_ENDPOINT`, `COSMOS_DB_KEY`, `OPENAI_API_KEY`, `LANGFUSE_*`, `ALLOWED_ORIGINS`
**Frontend** (`.env`): `VITE_API_URL`, `VITE_APP_ENV`

---

## Coding Standards

### File Naming
- **Components**: `PascalCase.tsx`
- **Utilities**: `camelCase.ts`

### Component Organization
Organize by feature (vertical slicing):
```
/frontend/src/features/{auth,portfolio,calculators,dashboard,...}
/frontend/src/shared/{components,hooks,utils}
```

**Vertical Slicing Rule**: Feature-specific code stays in feature folder.

| Location | What Belongs |
|----------|--------------|
| `features/{name}/` | Page components, page-specific hooks/CSS, loading states, components used by ONE feature |
| `shared/` | Components used by 2+ features, generic utilities, app-wide hooks, app-wide layout |

**Test**: "Is this used by multiple unrelated features?" → Yes = `shared/`, No = `features/`

### State Management
- **TanStack Query**: Server state (API data)
- **React Context**: Auth state
- **useState**: Component-local state

### Shared Hooks & Utilities
```typescript
// Page titles (required for all pages)
import { usePageTitle } from '@/shared/hooks';
usePageTitle('Oversikt'); // → "Oversikt | Finans"

// Environment detection (use for debug logs)
import { isDevelopment } from '@/shared/utils/environment';
if (isDevelopment) console.log('Debug:', data);
```

### Language
All code, comments, and documentation MUST be in English.

---

## Norwegian Formatting

- **Numbers**: `123 456,78 kr` (space thousands, comma decimal)
- **Dates**: `dd.MM.yyyy` (01.01.2024)
- **Library**: numeral.js (Norwegian locale), date-fns (nb locale)
- **Import**: `import { formatCurrency, formatDate } from '@finans/components'`

---

## Authentication (EasyAuth)

EasyAuth configured on both frontend and backend App Services.

| App Service | Purpose |
|-------------|---------|
| `finans-frontend` | User login via OAuth |
| `finans-backend` | Validates `x-ms-client-principal` header |

**Providers**: Google, Facebook

---

## LLM Import Agent

Agentic chatbot for importing portfolio data. Location: `backend/src/services/importAgentService.ts`

- **LLM**: OpenAI GPT-4 Turbo
- **Observability**: Langfuse (traces, spans, generations)
- **Pattern**: Agent loop with tool calls

**Tools**: `get_user_accounts`, `get_existing_snapshots`, `upsert_snapshot`

**Flow**: User pastes data → Agent analyzes → Asks confirmation → Imports on "ja"

---

## CI/CD Pipeline

**GitHub Actions workflows:**

1. **ci.yml** - On push/PR: lint, type check, build
2. **deploy-frontend.yml** - Deploy React app to Azure
3. **deploy-backend.yml** - Deploy Express API to Azure
4. **deploy-storybook.yml** - Deploy Storybook to Azure

**Deployment**: Push to `main` triggers automatic deployment.

---

## Onboarding Default Accounts

Created during user signup (user can customize):

**Sparing**: Aksjer, Fond, Bankkonto, Krypto (inactive)
**Gjeld**: Boliglån, Studielån
**Pensjon**: Arbeidsgiver (OTP), Folketrygden (NAV), IPS (inactive)

---

## Domain Concepts

| Term | Definition |
|------|------------|
| **F.I.R.E.** | Financial Independence, Retire Early |
| **Net Worth** | Total assets - total liabilities |
| **Savings Rate** | (Income - Expenses) / Income |
| **F.I.R.E. Number** | 25x annual expenses (target for FI) |
| **Dekning** | Savings / Debt percentage (100% = zero net debt) |
| **4% Rule** | Safe annual withdrawal rate in retirement |

---

## NOTES FROM THE USER
- USER IS A SENIOR DEV WITH GOOD KNOWLEDGE OF SOFTWARE DEVELOPMENT. USER EXPECTS SENIOR DEVELOPER LEVEL WORK.
- DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG, FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY.
- BE CLEAR AND CONSISTANT. SACRIFICE GRAMMER FOR SHORT, CONSISTANT LANGUAGE. EXPRESS YOURSELF TO THE POINT.
- ALWAYS USE TOOLS OVER BASH!! USE READ, EDIT, WRITE, GLOB, GREP TOOLS INSTEAD OF CAT, SED, AWK, FIND, GREP BASH COMMANDS!
- ASSIGN COLORS TO SUBAGENTS
- BE VERBOSE WHEN USING RULES
- DO NOT ADD BACKWARDS COMPATIBILITY UNLESS EXPLICITLY REQUESTED.
- THINK HARD. WRITE ELEGANT CODE. NO SLOPPY SOLUTIONS. DON'T BE LAZY.
- AFTER EVERY CODE BLOCK: LINT, COMPILE. DO THIS BEFORE WRITING THE NEXT CODE BLOCK. NO EXCEPTIONS.
- CLEAN, READABLE, DRY CODE. ALWAYS. NO DUPLICATION. NO CLEVER TRICKS THAT HURT READABILITY.
- EDIT EXISTING CODE OVER ADDING NEW CODE. LOOK FOR OPPORTUNITIES TO REFACTOR. DO NOT BLOAT THE CODEBASE.
- REVIEW YOUR OWN WORK AFTER EACH STEP. ASK YOURSELF: IS THIS CLEAN? IS THIS DRY? COULD I HAVE EDITED INSTEAD OF ADDED? FIX IT BEFORE MOVING ON.
- LOAD RULES RELEVANT FOR TASK: Before starting any task, READ the relevant rule files from `.claude/rules/` (e.g., `charts.md` for chart work, `api.md` for backend routes). Do this FIRST, before writing any code.