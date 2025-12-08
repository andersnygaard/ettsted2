---
name: storybook-stories
description: Write comprehensive Storybook stories for React components with proper TypeScript types, args, controls, decorators, and interaction tests. Use this skill when the user asks to create or improve Storybook stories for components in the /components workspace.
---

This skill guides creation of comprehensive, well-structured Storybook stories for React components. Write production-ready stories with proper TypeScript types, interactive controls, and interaction tests.

The user provides a component to document in Storybook. They may specify particular states, variants, or interaction scenarios to cover.

## Project Context

- **Component Library**: `/components` workspace
- **Styling**: Custom CSS with Nordic Minimal design system (see tokens.css)
- **Icons**: Custom SVG icons via `Icon` component from @finans/components
- **Stories Location**: Co-located with components (`*.stories.tsx`)
- **Storybook Deployment**: `finans-components` Azure App Service

## Story Structure Fundamentals

Every Storybook story file follows this pattern:

1. **Imports**: Component, types, decorators, and test utilities
2. **Meta Object**: Component-level configuration (default export)
3. **Type Definition**: `type Story = StoryObj<typeof Component>`
4. **Individual Stories**: Named exports representing different states

### Basic React Story Template

```typescript
import type { Meta, StoryObj } from '@storybook/react';

import { YourComponent } from './YourComponent';

const meta: Meta<typeof YourComponent> = {
  component: YourComponent,
  title: 'Feature/YourComponent', // Optional: organize in sidebar
  tags: ['autodocs'], // Generates documentation automatically
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const Default: Story = {
  args: {
    // Component props
  },
};
```

## React-Specific Configuration

### Decorator for Context Providers

Wrap components that need context (theme, auth, etc.):

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../providers/ThemeProvider';

const meta: Meta<typeof YourComponent> = {
  component: YourComponent,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};
```

### Global Decorators in preview.tsx

Configure in `.storybook/preview.tsx` for project-wide providers:

```typescript
import type { Preview } from '@storybook/react';
import '../src/styles/tokens.css';
import '../src/styles/globals.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'bone',
      values: [
        { name: 'bone', value: '#F5F2ED' },
        { name: 'warm-white', value: '#FDFCFA' },
        { name: 'dark', value: '#2C2C2C' },
      ],
    },
  },
};

export default preview;
```

### Story-Specific Decorators

Apply decorators to individual stories when needed:

```typescript
export const WithDarkTheme: Story = {
  args: { ... },
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};
```

## Args and Controls

Args are the primary way to make stories interactive. They map directly to component props.

### Defining Args

```typescript
export const Primary: Story = {
  args: {
    label: 'Click me',
    disabled: false,
    variant: 'primary',
    size: 'medium',
  },
};
```

### Customizing Controls with ArgTypes

Control the UI for editing args in Storybook:

```typescript
const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Visual style variant',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    disabled: {
      control: 'boolean',
    },
    backgroundColor: {
      control: 'color',
    },
    onClick: {
      action: 'clicked', // Logs to Actions panel
    },
  },
};
```

### Story Composition (Reusing Args)

Extend existing stories to reduce duplication:

```typescript
export const Primary: Story = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    label: 'Secondary Button',
    variant: 'secondary',
  },
};
```

## Actions and Event Handlers

### Automatic Action Logging

Configure globally in `.storybook/preview.tsx`:

```typescript
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on.*' }, // Logs all props starting with 'on'
  },
};

export default preview;
```

### Manual Actions for Testing

Use `fn()` from `storybook/test` to create spies for interaction tests:

```typescript
import { fn } from 'storybook/test';

const meta: Meta<typeof FormComponent> = {
  component: FormComponent,
  args: {
    onSubmit: fn(), // Can be asserted in play functions
  },
};
```

## Interaction Testing with Play Functions

Play functions simulate user interactions and run assertions after the story renders.

### Basic Interaction Test

```typescript
import { fn, userEvent, within, expect } from 'storybook/test';

export const FilledForm: Story = {
  args: {
    onSubmit: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Query the DOM using Testing Library
    const emailInput = canvas.getByLabelText('Email');
    const passwordInput = canvas.getByLabelText('Password');
    const submitButton = canvas.getByRole('button', { name: 'Submit' });

    // Simulate user interactions
    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);

    // Assert behavior
    await expect(args.onSubmit).toHaveBeenCalled();
    await expect(canvas.getByText('Success!')).toBeInTheDocument();
  },
};
```

### Common UserEvent Methods

All methods must be awaited:

```typescript
await userEvent.click(element);
await userEvent.dblClick(element);
await userEvent.type(element, 'text', { delay: 100 });
await userEvent.hover(element);
await userEvent.tab();
await userEvent.keyboard('{Shift}{Tab}');
await userEvent.selectOptions(select, ['option1', 'option2']);
await userEvent.clear(input);
```

### Grouping Interactions with Steps

Organize complex tests with descriptive steps:

```typescript
import { within, userEvent, expect, step } from 'storybook/test';

export const ComplexFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await step('Fill in credentials', async () => {
      await userEvent.type(canvas.getByLabelText('Email'), 'user@example.com');
      await userEvent.type(canvas.getByLabelText('Password'), 'secret');
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Login' }));
    });

    await step('Verify success message', async () => {
      await expect(canvas.getByText('Welcome!')).toBeInTheDocument();
    });
  },
};
```

### Mocking and Spying

Use `beforeEach` to set up mocks:

```typescript
import { fn } from 'storybook/test';

export const WithMockedData: Story = {
  args: {
    fetchUsers: fn(),
    onSubmit: fn(),
  },
  beforeEach: async ({ args }) => {
    // Mock return values
    args.fetchUsers.mockResolvedValue([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ]);
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Wait for async data
    await canvas.findByText('Alice');

    // Interact and assert
    await userEvent.click(canvas.getByRole('button'));
    await expect(args.onSubmit).toHaveBeenCalledWith({
      userCount: 2,
      data: expect.anything(),
    });
  },
};
```

## Component Patterns

### Components with Children

For components that render children:

```typescript
export const WithChildren: Story = {
  args: {
    title: 'Card Title',
  },
  render: (args) => (
    <Card {...args}>
      <p>This is child content</p>
      <button>Click me</button>
    </Card>
  ),
};
```

### Components with Render Props

```typescript
export const WithRenderProp: Story = {
  args: {
    renderItem: (item) => <span>{item.name}</span>,
    items: [{ name: 'Item 1' }, { name: 'Item 2' }],
  },
};
```

### Multiple Component Variants

Document different states thoroughly:

```typescript
export const Default: Story = { args: { ... } };
export const Loading: Story = { args: { isLoading: true } };
export const Error: Story = { args: { error: 'Something went wrong' } };
export const Empty: Story = { args: { items: [] } };
export const WithData: Story = { args: { items: mockData } };
export const Disabled: Story = { args: { disabled: true } };
```

## Project-Specific Patterns

### Using Custom CSS Components

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Icon } from '@finans/components';

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Save',
    variant: 'primary',
    icon: <Icon name="check" size={18} />,
  },
};
```

### Financial Data Components

For components displaying financial data (currency, percentages):

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { HeroNumber } from './HeroNumber';

const meta: Meta<typeof HeroNumber> = {
  component: HeroNumber,
  title: 'Components/HeroNumber',
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'Value in NOK (kroner)',
    },
    change: {
      control: 'number',
      description: 'Percentage change',
    },
    changeType: {
      control: { type: 'radio' },
      options: ['positive', 'negative', 'neutral'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroNumber>;

export const Default: Story = {
  args: {
    label: 'Netto formue',
    value: 1234567,
    change: 2.33,
    changeType: 'positive',
  },
};

export const NegativeChange: Story = {
  args: {
    ...Default.args,
    change: -1.5,
    changeType: 'negative',
  },
};

export const Milestone: Story = {
  args: {
    ...Default.args,
    value: 1000000,
    showMilestone: true,
  },
};
```

### Chart Components with D3

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { NetWorthChart } from './NetWorthChart';

const mockData = [
  { date: '01.01.2024', value: 950000 },
  { date: '01.02.2024', value: 980000 },
  { date: '01.03.2024', value: 1020000 },
];

const meta: Meta<typeof NetWorthChart> = {
  component: NetWorthChart,
  title: 'Components/Charts/NetWorthChart',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof NetWorthChart>;

export const Default: Story = {
  args: {
    data: mockData,
    width: 600,
    height: 300,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    width: 600,
    height: 300,
  },
};
```

## Best Practices

1. **One Story Per State**: Each story should represent a distinct, meaningful state
2. **Meaningful Names**: Use descriptive story names (not `Story1`, `Story2`)
3. **Args Over Hardcoding**: Use args for all configurable properties
4. **Comprehensive Coverage**: Document all important variants and edge cases
5. **Interaction Tests**: Add play functions for critical user flows
6. **TypeScript Types**: Use proper `Meta` and `StoryObj` types for type safety
7. **Documentation**: Add descriptions to argTypes for better autodocs
8. **Actions for Events**: Use `fn()` for callback props that need testing
9. **Accessibility**: Test keyboard navigation and screen reader behavior
10. **Norwegian Context**: Use Norwegian text in stories to match production UI

## CSS Scoping

Always scope page-level CSS to avoid collisions with component library classes.

**Problem**: Unscoped selectors in page CSS override component styles globally.

```css
/* BAD - leaks globally, overrides component library */
.page-header {
  margin-bottom: 64px;
}

/* GOOD - scoped to page */
.dashboard-page .page-header {
  margin-bottom: 64px;
}
```

**Rules**:
- Component library classes (in `/components`) define the base styles
- Page-level CSS should scope selectors to their parent container
- Use BEM naming (`.block__element--modifier`) to reduce collision risk
- When debugging unexpected styles, check for unscoped selectors in page CSS

## Story Organization

```typescript
const meta: Meta<typeof YourComponent> = {
  component: YourComponent,
  title: 'Features/Portfolio/YourComponent', // Nested in sidebar
  tags: ['autodocs'], // Auto-generate documentation page
};

// Basic states
export const Default: Story = { ... };
export const Empty: Story = { ... };
export const Loading: Story = { ... };

// Variants
export const Primary: Story = { ... };
export const Secondary: Story = { ... };

// Edge cases
export const WithLongText: Story = { ... };
export const WithError: Story = { ... };

// Interactive scenarios
export const UserCanSubmitForm: Story = {
  play: async ({ canvasElement }) => { ... },
};
```

## Workflow

1. **Analyze Component**: Review component props, state, and dependencies
2. **Set Up Meta**: Configure component, decorators, and argTypes
3. **Define Stories**: Create stories for all major states and variants
4. **Add Controls**: Customize argTypes for better UX in Storybook UI
5. **Add Interactions**: Write play functions for critical user flows
6. **Document**: Add descriptions and examples for other developers
7. **Test**: Run `pnpm --filter components storybook` and verify all stories

## Running Storybook

```bash
# Start Storybook development server
pnpm --filter components storybook

# Build Storybook for deployment
pnpm --filter components build-storybook
```

Remember: Great Storybook stories serve as both documentation and tests. They should be comprehensive, interactive, and easy to understand for other developers on the team.
