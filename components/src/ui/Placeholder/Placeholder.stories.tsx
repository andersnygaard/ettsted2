import type { Meta, StoryObj } from '@storybook/react';
import { Placeholder } from './Placeholder';

const meta: Meta<typeof Placeholder> = {
  title: 'UI/Placeholder',
  component: Placeholder,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'bone' },
  },
  argTypes: {
    height: {
      description: 'Height of the placeholder (number for px, string for any CSS unit)',
      control: 'text',
    },
    className: {
      description: 'Additional CSS classes',
      control: 'text',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--warm-white)', padding: '16px', borderRadius: '2px' }}>
        <div style={{ background: 'var(--pale-blue)', padding: '8px', marginBottom: '4px' }}>
          Content above
        </div>
        <Story />
        <div style={{ background: 'var(--pale-blue)', padding: '8px', marginTop: '4px' }}>
          Content below
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Placeholder>;

export const Default: Story = {
  args: {
    height: 32,
  },
};

export const Small: Story = {
  args: {
    height: 16,
  },
};

export const Large: Story = {
  args: {
    height: 64,
  },
};

export const WithCSSUnit: Story = {
  args: {
    height: '2rem',
  },
};

export const WithPercentage: Story = {
  args: {
    height: '50px',
  },
};

export const MultipleSpacers: Story = {
  render: () => (
    <div>
      <div style={{ background: 'var(--muted-sage)', padding: '12px', color: 'white' }}>
        Section 1
      </div>
      <Placeholder height={24} />
      <div style={{ background: 'var(--soft-terracotta)', padding: '12px', color: 'white' }}>
        Section 2
      </div>
      <Placeholder height={48} />
      <div style={{ background: 'var(--pale-blue)', padding: '12px' }}>
        Section 3
      </div>
    </div>
  ),
  decorators: [],
};
