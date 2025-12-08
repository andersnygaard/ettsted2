# Frontend

React application for Finans portfolio tracker. Built with TypeScript, Vite, and Nordic Minimal design system.

## Tech Stack

- **Framework**: React 18, TypeScript
- **Build Tool**: Vite
- **State Management**: TanStack Query (server state), React Context (auth)
- **HTTP Client**: Axios
- **Styling**: Custom CSS (Nordic Minimal), Material UI
- **Visualization**: D3.js
- **Routing**: React Router DOM 6
- **Forms**: React Hook Form + Zod validation
- **Formatting**: numeral.js (numbers), date-fns (dates)
- **Linting**: ESLint

## Commands

```bash
pnpm dev              # Start development server (port 5173)
pnpm build            # Build for production
pnpm preview          # Preview production build
pnpm lint             # Run ESLint
pnpm type-check       # Check TypeScript types
```

## Directory Structure

```
src/
├── features/          # Feature modules (auth, portfolio, calculators, etc.)
├── shared/            # Shared code
│   ├── api/           # API client setup
│   ├── components/    # Shared components
│   ├── hooks/         # Custom hooks (usePageTitle, etc.)
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── routes/            # Route definitions
├── config/            # Application configuration
└── styles/            # Global CSS
```

## Environment Variables

Create `.env` file in the `frontend` directory:

```
VITE_API_URL          # Backend API endpoint (e.g., http://localhost:3000/api/v1)
VITE_APP_ENV          # Environment (development|production)
```

See `.env.example` for reference.

## Development

All pages include a `usePageTitle` hook for setting browser tab title and H1:

```typescript
import { usePageTitle } from '@/shared/hooks';

export function MyPage() {
  usePageTitle('Page Title');
  // ...
}
```

Norwegian number and date formatting is handled via `@finans/components`:

```typescript
import { formatCurrency, formatDate } from '@finans/components';
```

## Dependencies

Frontend depends on `@finans/components` workspace for shared UI components and styling tokens.
