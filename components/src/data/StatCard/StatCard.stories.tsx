import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from './StatCard';

const meta = {
  title: 'Data/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '970 194 kr',
    label: 'Sum sparing',
  },
};

export const Clickable: Story = {
  args: {
    value: '970 194 kr',
    label: 'Sum sparing',
    onClick: () => console.log('Card clicked'),
  },
  parameters: {
    docs: { description: { story: 'Card with click handler shows hover cursor and clickable style' } },
  },
};

export const ClickableWithAction: Story = {
  render: (args) => (
    <StatCard
      {...args}
      onClick={() => {
        alert('Card clicked!');
      }}
    />
  ),
  args: {
    value: '970 194 kr',
    label: 'Sum sparing',
  },
};

export const Debt: Story = {
  args: {
    value: '456 789 kr',
    label: 'Sum gjeld',
  },
};

export const Pension: Story = {
  args: {
    value: '345 678 kr',
    label: 'Sum pensjon',
  },
};

export const SavingsRate: Story = {
  args: {
    value: '42,3 %',
    label: 'Sparerate',
  },
};

export const NorwegianFormatting: Story = {
  args: {
    value: '2 156 789,50 kr',
    label: 'Netto formue',
  },
  parameters: {
    docs: { description: { story: 'Demonstrates Norwegian number formatting (space thousands, comma decimal)' } },
  },
};

export const MonthsFreed: Story = {
  args: {
    value: '24,5',
    label: 'Måneder fri',
  },
};

export const LargeNumber: Story = {
  args: {
    value: '6 400 000 kr',
    label: 'Firetall',
    onClick: () => console.log('Card clicked'),
  },
};

export const SmallNumber: Story = {
  args: {
    value: '12 500 kr',
    label: 'Månedlig sparing',
  },
};

export const Percentage: Story = {
  args: {
    value: '67,8 %',
    label: 'Dekning',
  },
};

export const CoverageMetric: Story = {
  args: {
    value: '212,5 %',
    label: 'Gjeldsdekning',
    onClick: () => console.log('Coverage card clicked'),
  },
  parameters: {
    docs: { description: { story: 'Coverage metric can exceed 100% (savings/debt)' } },
  },
};

export const WithLongLabel: Story = {
  args: {
    value: '1 234 567 kr',
    label: 'Samlet porteføljeverdi',
  },
};
