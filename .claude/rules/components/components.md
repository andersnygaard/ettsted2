---
paths:
  - components/**/*
---

# Components Rules

## Stack
React 18, TypeScript, custom CSS (no utility frameworks)

## Structure
- `/ui/` - Core UI primitives (Button, Card, Modal, Avatar, Skeleton)
- `/cards/` - Domain-specific cards (StatCard, MilestoneCard, CalculatorCard, BreakdownCard)
- `/forms/` - Form inputs (NumberInput, DateInput, ProgressBar)
- `/data/` - Data display (HeroNumber, StatsRow, SpreadsheetTable, TableHeader, TableFooter)
- `/layout/` - Page structure (Container, PageHeader, PageSkeleton, SectionLink)
- `/charts/` - D3 visualizations (AreaChart, StackedAreaChart, DonutChart)
- `/system/` - App-level (Toast, ErrorBoundary)
- `/hooks/` - Shared hooks (useCountAnimation)

## Patterns
- One component per folder: `ComponentName/ComponentName.tsx` + `.css` + `index.ts`
- Props interface named `ComponentNameProps`, exported from index.ts
- CSS file co-located, imported directly in component
- Barrel export from `/src/index.ts` - export component AND type

```typescript
// Component file
export interface ComponentProps { ... }
export function Component({ ... }: ComponentProps) { ... }

// index.ts
export { Component } from './Component'
export type { ComponentProps } from './Component'
```

## Decisions
- Custom CSS over CSS-in-JS for simplicity and design token usage
- No prop spreading - explicit props only
- React.memo for expensive components (charts)
- Norwegian locale for all user-facing text (buttons, labels, errors)

## Gotchas
- Import tokens.css in Storybook preview, not in each component
- Component CSS uses tokens via `var(--token-name)` - never hardcode colors
- JetBrains Mono font for numeric data (`font-family: var(--font-mono)`)
- Export types separately: `export type { Props }` not just `export { Props }`
