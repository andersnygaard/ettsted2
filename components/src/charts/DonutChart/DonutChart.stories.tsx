import type { Meta, StoryObj } from '@storybook/react';
import { DonutChart } from './DonutChart';

const meta = {
  title: 'Charts/DonutChart',
  component: DonutChart,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    percentage: 85.5,
    label: 'Dekning',
    size: 180,
  },
};

export const FullCircle: Story = {
  args: {
    percentage: 100,
    label: 'Fullført',
    size: 180,
  },
};

export const HalfCircle: Story = {
  args: {
    percentage: 50,
    label: 'Halvveis',
    size: 180,
  },
};

export const LowPercentage: Story = {
  args: {
    percentage: 15,
    label: 'Dekning',
    size: 180,
  },
};

export const HighPercentage: Story = {
  args: {
    percentage: 97.8,
    label: 'Nesten ferdig',
    size: 180,
  },
};

export const SmallSize: Story = {
  args: {
    percentage: 75,
    label: 'Dekning',
    size: 120,
  },
};

export const LargeSize: Story = {
  args: {
    percentage: 65,
    label: 'Dekning',
    size: 240,
  },
};

export const CustomLabel: Story = {
  args: {
    percentage: 42.3,
    label: 'Sparerate',
    size: 180,
  },
};

export const CoverageExample: Story = {
  args: {
    percentage: 212.5,
    label: 'Dekning',
    size: 180,
  },
};

export const ZeroPercentage: Story = {
  args: {
    percentage: 0,
    label: 'Start',
    size: 180,
  },
};

export const NorwegianLabel: Story = {
  args: {
    percentage: 42.3,
    label: 'Sparerate',
    size: 180,
  },
  parameters: {
    docs: { description: { story: 'Chart with Norwegian percentage formatting and labels' } },
  },
};

export const OverThreshold: Story = {
  args: {
    percentage: 150,
    label: 'Dekning',
    size: 180,
  },
  parameters: {
    docs: { description: { story: 'Coverage percentage over 100% (savings exceed debt)' } },
  },
};

export const ExtraLarge: Story = {
  args: {
    percentage: 85,
    label: 'Progress',
    size: 300,
  },
};

export const ExtraSmall: Story = {
  args: {
    percentage: 60,
    label: 'Done',
    size: 100,
  },
};

export const CoverageMetrics: Story = {
  args: {
    percentage: 212.5,
    label: 'Dekning',
    size: 180,
  },
  parameters: {
    docs: { description: { story: 'Real world example: debt coverage metric exceeding 100%' } },
  },
};

export const AlmostComplete: Story = {
  args: {
    percentage: 99.9,
    label: 'Nesten der!',
    size: 180,
  },
};
