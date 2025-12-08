# Backend

Express API server for Finans portfolio tracker. Handles authentication, data persistence, calculations, and LLM-powered import agent.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express
- **Language**: TypeScript
- **Database**: Azure CosmosDB (NoSQL)
- **Authentication**: Azure EasyAuth (OAuth headers)
- **LLM Agent**: OpenAI GPT-4 Turbo
- **Observability**: Langfuse (LLM tracing)
- **Validation**: Zod
- **Rate Limiting**: express-rate-limit
- **Security**: Helmet.js
- **Logging**: Winston
- **Testing**: Vitest
- **Linting**: ESLint

## Commands

```bash
pnpm dev              # Start development server with hot-reload (port 3000)
pnpm build            # Build production bundle (esbuild)
pnpm build:tsc        # TypeScript compilation only
pnpm start            # Run production build
pnpm lint             # Run ESLint
pnpm type-check       # Check TypeScript types
pnpm test             # Run integration tests
pnpm test:watch       # Run tests in watch mode
pnpm db:seed          # Seed CosmosDB with sample data
pnpm db:reset         # Reset CosmosDB (drops all containers)
```

## Directory Structure

```
src/
├── index.ts           # Server entry point
├── app.ts             # Express app setup
├── routes/            # API route handlers
├── controllers/       # Route logic
├── services/          # Business logic (calculations, imports, etc.)
├── llm/               # OpenAI and import agent
├── middleware/        # Auth, validation, rate limiting
├── validators/        # Zod schemas and validation
├── models/            # TypeScript types
├── config/            # Environment and database setup
├── errors/            # Error handling
├── utils/             # Helper functions (date, calculations)
├── seed/              # Database seeding scripts
└── test/              # Integration tests
```

## Environment Variables

Create `.env` file in the `backend` directory:

```
# CosmosDB
COSMOS_DB_ENDPOINT    # Connection endpoint
COSMOS_DB_KEY         # Primary key

# Server
NODE_ENV              # development|production
PORT                  # Server port (default 3000)

# Authentication (EasyAuth)
FACEBOOK_APP_ID       # Facebook OAuth app ID
FACEBOOK_APP_SECRET   # Facebook OAuth secret
GOOGLE_CLIENT_ID      # Google OAuth client ID
GOOGLE_CLIENT_SECRET  # Google OAuth secret

# OpenAI (for import agent)
OPENAI_API_KEY        # API key

# Langfuse (LLM observability)
LANGFUSE_PUBLIC_KEY   # Public key
LANGFUSE_SECRET_KEY   # Secret key
LANGFUSE_HOST         # Observability host

# CORS
ALLOWED_ORIGINS       # Comma-separated list of allowed origins

# Rate Limiting
RATE_LIMIT_REQUESTS   # General rate limit (req/min)
RATE_LIMIT_CALCULATOR # Calculator endpoint limit (req/min)
RATE_LIMIT_LLM        # LLM import endpoint limit (req/min)

# Development
DEV_MODE_ENABLED      # Enable development routes (requires NODE_ENV=development)
```

See `.env.example` for reference.

## Development

### Local Database Setup

Run CosmosDB Emulator:

```bash
npx emulator
```

Then seed demo data:

```bash
pnpm db:seed
```

### API Routes

Base path: `/api/v1`

- **Users**: `GET/PATCH /users/me`, `POST /users/me/setup`
- **Accounts**: `GET/POST/PATCH/DELETE /accounts`
- **Snapshots**: `GET/POST/PATCH/DELETE /snapshots`
- **Aggregated**: `GET /oversikt`, `GET /sparing`, `GET /gjeld`, `GET /pensjon`
- **Calculators**: `POST /kalkulatorer/{rentes-rente|fire|lan|monte-carlo}`
- **Import**: `POST /import/chat`

### Date Handling

CosmosDB string sorting is alphabetical, not chronological. Always parse and sort dates in JavaScript using `compareDatesAsc` from `utils/dateUtils.ts`:

```typescript
import { compareDatesAsc } from '@/utils/dateUtils';

snapshots.sort((a, b) => compareDatesAsc(a.date, b.date));
```

## Testing

Integration tests use Vitest and mock CosmosDB:

```bash
pnpm test             # Run once
pnpm test:watch       # Watch mode
```

See `src/test/integration/` for examples.
