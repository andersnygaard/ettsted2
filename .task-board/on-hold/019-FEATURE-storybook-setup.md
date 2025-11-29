# FEATURE: Storybook Setup for Components

**Status**: Backlog
**Created**: 2025-11-28
**Priority**: Low
**Labels**: components, storybook, documentation
**Estimated Effort**: Medium - 2 days

## Context & Motivation

Storybook provides documentation and development environment for the shared component library.

## Desired Outcome

- Storybook configured for `/components` workspace
- Stories for shared UI components
- BeerCSS integration in Storybook
- Deployed to `finans-components` Azure App Service
- Accessible for design review and documentation

## Acceptance Criteria

- [ ] Storybook installed in `/components`
- [ ] Stories created for shared components (Button, Card, DataTable, etc.)
- [ ] BeerCSS styles applied in Storybook preview
- [ ] Component props documented in stories
- [ ] Interactive controls for props
- [ ] Build command: `pnpm --filter components build-storybook`
- [ ] Static site deployed to Azure

## Technical Approach

```bash
cd components
npx storybook init
```

**Story Example**:
```tsx
// components/src/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] }
  }
};

export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: {
    children: 'Klikk meg',
    variant: 'primary'
  }
};
```

## Dependencies

- Component library components created

---

**Next Steps**: Ready after shared components built.
