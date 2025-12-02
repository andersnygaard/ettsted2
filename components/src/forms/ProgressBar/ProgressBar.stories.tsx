import type { Meta, StoryObj } from '@storybook/react';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Forms/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
    variant: 'default',
    height: 8,
  },
};

export const DefaultWithLabels: Story = {
  args: {
    value: 50,
    variant: 'default',
    height: 8,
    leftLabel: 'Spareprogress',
    rightLabel: '500 000 kr',
  },
};

export const Gold: Story = {
  args: {
    value: 75,
    variant: 'gold',
    height: 8,
  },
};

export const GoldWithLabels: Story = {
  args: {
    value: 75,
    variant: 'gold',
    height: 8,
    leftLabel: 'Milestone: 1M kr',
    rightLabel: '75%',
  },
};

export const Blue: Story = {
  args: {
    value: 30,
    variant: 'blue',
    height: 8,
  },
};

export const BlueWithLabels: Story = {
  args: {
    value: 30,
    variant: 'blue',
    height: 8,
    leftLabel: 'Gjeldsdekning',
    rightLabel: '30%',
  },
};

export const EmptyProgress: Story = {
  args: {
    value: 0,
    variant: 'default',
    height: 8,
    leftLabel: 'Spareprogress',
    rightLabel: '0 kr',
  },
};

export const HalfProgress: Story = {
  args: {
    value: 50,
    variant: 'default',
    height: 8,
    leftLabel: 'F.I.R.E. mål',
    rightLabel: '50%',
  },
};

export const FullProgress: Story = {
  args: {
    value: 100,
    variant: 'default',
    height: 8,
    leftLabel: 'Nådd målsetning',
    rightLabel: '100%',
  },
};

export const TallProgressBar: Story = {
  args: {
    value: 65,
    variant: 'default',
    height: 12,
    leftLabel: 'Dekning',
    rightLabel: '65%',
  },
};

export const HighProgress: Story = {
  args: {
    value: 97,
    variant: 'gold',
    height: 8,
    leftLabel: 'Nesten der!',
    rightLabel: '97%',
  },
};

export const WithoutLabels: Story = {
  args: {
    value: 60,
    variant: 'default',
    height: 8,
  },
};
