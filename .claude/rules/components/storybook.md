---
paths:
  - components/**/*
---

# Storybook Rules

## Stack
Storybook 8, @storybook/react-vite

## Structure
- `/.storybook/main.ts` - Storybook config
- `/.storybook/preview.ts` - Global decorators, parameters
- Stories co-located: `ComponentName/ComponentName.stories.tsx`

## Patterns
- CSF3 format with `meta` default export
- Args-based stories for interactive controls
- Autodocs via `tags: ['autodocs']`

```typescript
// ComponentName.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Category/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    propName: { control: 'text' },
    variant: { control: 'select', options: ['a', 'b'] },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    propName: 'value',
  },
};

export const Variant: Story = {
  args: {
    propName: 'other',
    variant: 'b',
  },
};
```

## Category Structure
- `UI/` - Core primitives (Button, Card, Modal)
- `Forms/` - Input components
- `Data/` - Data display (tables, stats)
- `Cards/` - Domain cards
- `Charts/` - D3 visualizations
- `Layout/` - Page structure
- `System/` - App-level (Toast, ErrorBoundary)

## Decisions
- Autodocs for all components
- Interactive controls via argTypes
- Static directory for assets: `.storybook/public/`

## Gotchas
- Tokens.css imported in preview.ts - available globally
- React Router mocked in preview for Link components
- Use decorators for providers (Toast, Router)
- Chart stories need realistic mock data

## Commands
- `pnpm --filter components storybook` - Dev server (port 6006)
- `pnpm --filter components build-storybook` - Build static site
