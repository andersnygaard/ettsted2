import type { Meta, StoryObj } from '@storybook/react';
import { StatCard } from './StatCard';

const meta = {
  title: 'Data/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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
