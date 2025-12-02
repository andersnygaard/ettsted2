# FEATURE: Migrate Core UI Components to Storybook

**Status**: Backlog
**Created**: 2025-12-01
**Priority**: High
**Labels**: components, storybook, migration
**Estimated Effort**: Medium - 2-3 hours

## Context & Motivation

7 core UI components exist in `/frontend/src/shared/components/` that should be in the shared component library. These are generic, zero-business-logic components used across multiple features.

## Desired Outcome

Core UI components are in `/components/src/ui/` with comprehensive Storybook stories demonstrating all variants and states.

## Acceptance Criteria

- [ ] Migrate Button.tsx + Button.css with story showing all variants
- [ ] Migrate Card.tsx + Card.css with story
- [ ] Migrate Container.tsx + Container.css with story (3 width variants)
- [ ] Migrate Avatar.tsx + Avatar.css with story (3 size variants)
- [ ] Migrate Modal.tsx + Modal.css with story (focus trap, keyboard handling)
- [ ] Migrate Skeleton.tsx + Skeleton.css with story (shimmer animation)
- [ ] Migrate Breadcrumb.tsx + Breadcrumb.css with story
- [ ] Export all from `components/src/index.ts`
- [ ] All stories render correctly in Storybook

## Technical Approach

**For each component:**

1. Copy `.tsx` and `.css` files to `components/src/ui/`
2. Create `ComponentName.stories.tsx` with:
   - Default story
   - All variant stories (sizes, colors, states)
   - Interactive controls via args
   - Documentation via autodocs
3. Add export to `src/index.ts`

**Story template:**
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: { onClick: { action: 'clicked' } }
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = { args: { children: 'Click me' } }
export const Secondary: Story = { args: { variant: 'secondary' } }
```

**Source files:**
- `frontend/src/shared/components/Button.tsx`
- `frontend/src/shared/components/Card.tsx`
- `frontend/src/shared/components/Container.tsx`
- `frontend/src/shared/components/Avatar.tsx`
- `frontend/src/shared/components/Modal.tsx`
- `frontend/src/shared/components/Skeleton.tsx`
- `frontend/src/shared/components/Breadcrumb.tsx`

## Dependencies

- Task 101 (Storybook config) must be complete

---

**Next Steps**: Migrate form components (103)
