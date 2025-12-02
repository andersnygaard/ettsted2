import type { Meta, StoryObj } from '@storybook/react';
import { MilestoneCard } from './MilestoneCard';

const meta = {
  title: 'Data/MilestoneCard',
  component: MilestoneCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MilestoneCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InProgress: Story = {
  args: {
    label: 'Første million',
    target: 1000000,
    current: 500000,
  },
};

export const NearCompletion: Story = {
  args: {
    label: 'Første million',
    target: 1000000,
    current: 900000,
  },
};

export const Completed: Story = {
  args: {
    label: 'Første million',
    target: 1000000,
    current: 1000000,
  },
};

export const JustStarted: Story = {
  args: {
    label: 'Første million',
    target: 1000000,
    current: 100000,
  },
};

export const FireGoal: Story = {
  args: {
    label: 'Firetall',
    target: 6400000,
    current: 3200000,
  },
};

export const CustomFormat: Story = {
  args: {
    label: 'Neste milepæl',
    target: 250000,
    current: 170000,
    formatValue: (value: number) => `${(value / 1000).toFixed(0)}k`,
  },
};
