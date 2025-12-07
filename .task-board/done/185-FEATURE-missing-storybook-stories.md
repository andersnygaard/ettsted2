# 185-FEATURE: Add Missing Storybook Stories

## Context

Some components in the `/components` workspace are missing Storybook stories, reducing documentation coverage and making it harder to develop in isolation.

**Components missing stories:**
- [PageSkeleton.tsx](components/src/layout/PageSkeleton/PageSkeleton.tsx) - Layout wrapper used on every page
- [Placeholder.tsx](components/src/ui/Placeholder/Placeholder.tsx) - Development placeholder component

## Type

FEATURE

## Priority

Low - Documentation improvement, no user impact

## Acceptance Criteria

- [x] PageSkeleton.stories.tsx created with variants showing different props
- [x] Placeholder.stories.tsx created with usage examples
- [x] Stories follow existing patterns (autodocs tag, argTypes, etc.)
- [x] Storybook builds without errors

## Technical Approach

Follow existing story patterns from [Button.stories.tsx](components/src/ui/Button/Button.stories.tsx):

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { PageSkeleton } from './PageSkeleton';

const meta: Meta<typeof PageSkeleton> = {
  title: 'Layout/PageSkeleton',
  component: PageSkeleton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageSkeleton>;

export const Default: Story = {
  args: {
    title: 'Page Title',
    breadcrumb: [{ label: 'Home', path: '/' }, { label: 'Current Page' }],
    children: <div>Page content goes here</div>,
  },
};
```

## Files Created

- `components/src/layout/PageSkeleton/PageSkeleton.stories.tsx`
- `components/src/ui/Placeholder/Placeholder.stories.tsx`

## Resolution

**Completed**: 2025-12-06

Created comprehensive Storybook stories for both components:

**PageSkeleton.stories.tsx** (6 variants):
- Default - Basic page layout
- WithBreadcrumb - Shows breadcrumb navigation
- WideContainer - Wide width variant
- CenteredHeader - Centered header alignment
- WithoutSubtitle - Minimal variant
- DeepBreadcrumb - Multi-level breadcrumb

**Placeholder.stories.tsx** (6 variants):
- Default - 32px height
- Small - 16px height
- Large - 64px height
- WithCSSUnit - Using rem units
- WithPercentage - Using fixed pixels
- MultipleSpacers - Real usage example

**Bonus fix**: Fixed broken imports in AllComponents.stories.tsx:
- Moved StatCard, MilestoneCard, CalculatorCard imports from incorrect paths to `../cards/`

**Verification**:
- ✅ Storybook builds without errors
- ✅ Lint passes
