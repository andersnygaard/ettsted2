# Components

Shared React component library for Finans. Provides design-system components, data visualization, forms, and Nordic Minimal styling tokens.

## Tech Stack

- **Framework**: React 18, TypeScript
- **Documentation**: Storybook 7
- **Styling**: Custom CSS (Nordic Minimal design system)
- **Visualization**: D3.js
- **Formatting**: numeral.js, date-fns
- **Build**: ESM (imported directly by workspaces)
- **Linting**: ESLint

## Commands

```bash
pnpm storybook        # Start Storybook dev server (port 6006)
pnpm build-storybook  # Build Storybook for deployment
pnpm lint             # Run ESLint (no warnings allowed)
```

## Directory Structure

```
src/
├── cards/             # Card components (StatCard, CalculatorCard, etc.)
├── charts/            # Data visualization (AreaChart, StackedAreaChart, etc.)
├── data/              # Data display (HeroNumber, SpreadsheetTable, etc.)
├── forms/             # Form inputs (DateInput, NumberInput)
├── layout/            # Layout components (Container, PageHeader, PageSkeleton)
├── system/            # System components (Toast, Modal, etc.)
├── domain/            # Domain-specific components
├── stories/           # Storybook stories
├── styles/            # Design tokens and global CSS
│   └── tokens.css     # CSS custom properties
└── index.ts           # Public export barrel
```

## Styling Tokens

Design system tokens are defined in `src/styles/tokens.css` and exported via `exports` field:

```typescript
// In other workspaces:
import '@finans/components/styles/tokens.css';
```

Available CSS variables:

```css
--bone              /* Primary background */
--warm-white        /* Cards, elevated surfaces */
--charcoal          /* Primary text */
--muted-sage        /* Positive values, savings */
--soft-terracotta   /* Accent color */
--pale-blue         /* Secondary accent */
--text-secondary    /* Muted text */
--gold              /* Milestone highlights */
--positive          /* Positive changes */
--negative          /* Negative changes */
--border            /* Border color */
```

## Typography

Global font imports:

- **Cormorant Garamond**: Serif headings (light weight)
- **DM Sans**: Body text (sans-serif)
- **JetBrains Mono**: Numbers and data (monospace)

## Component Patterns

All components are documented in Storybook with:

- Props documentation
- Interactive controls
- Multiple story variants
- Accessibility annotations
- TypeScript types

## Dependencies

Workspaces depend on this library via workspace dependency:

```json
{
  "@finans/components": "workspace:*"
}
```

Components are bundled into the frontend application at build time.

## Norwegian Formatting

Shared formatting utilities for Norwegian locale:

```typescript
import { formatCurrency, formatDate, formatNumber } from '@finans/components';

formatCurrency(1234567.89);  // "1 234 567,89 kr"
formatDate(new Date());       // "08.12.2024"
formatNumber(1234.56);        // "1 234,56"
```
