import type { Meta, StoryObj } from '@storybook/react';
import { AreaChart } from './AreaChart';

const meta = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate mock data
const generateData = (months: number, baseValue: number, trend: 'up' | 'down' | 'flat') => {
  const data = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    let value = baseValue;

    if (trend === 'up') {
      value += (months - i) * 5000 + Math.random() * 10000;
    } else if (trend === 'down') {
      value -= (months - i) * 3000 + Math.random() * 5000;
    } else {
      value += Math.random() * 20000 - 10000;
    }

    data.push({ date, value: Math.max(0, value) });
  }

  return data;
};

export const SixMonths: Story = {
  args: {
    data: generateData(6, 500000, 'up'),
    color: 'var(--muted-sage)',
    title: 'Spareutvikling',
    subtitle: '6 måneder',
    height: 200,
    showXAxis: true,
  },
};

export const OneYear: Story = {
  args: {
    data: generateData(12, 500000, 'up'),
    color: 'var(--muted-sage)',
    title: 'Porteføljeverdi',
    subtitle: '12 måneder',
    height: 250,
    showXAxis: true,
  },
};

export const PositiveTrend: Story = {
  args: {
    data: generateData(18, 300000, 'up'),
    color: 'var(--positive)',
    title: 'Oppgang',
    subtitle: 'Positiv trend',
    height: 200,
  },
};

export const NegativeTrend: Story = {
  args: {
    data: generateData(12, 500000, 'down'),
    color: 'var(--negative)',
    title: 'Gjeld',
    subtitle: 'Nedgang',
    height: 200,
  },
};

export const FlatTrend: Story = {
  args: {
    data: generateData(12, 400000, 'flat'),
    color: 'var(--pale-blue)',
    title: 'Stabil',
    subtitle: 'Flat trend',
    height: 200,
  },
};

export const NoTitle: Story = {
  args: {
    data: generateData(6, 500000, 'up'),
    color: 'var(--muted-sage)',
    height: 200,
    showXAxis: true,
  },
};

export const NoXAxis: Story = {
  args: {
    data: generateData(12, 500000, 'up'),
    color: 'var(--muted-sage)',
    title: 'Spareutvikling',
    height: 150,
    showXAxis: false,
  },
};

export const CustomColor: Story = {
  args: {
    data: generateData(12, 500000, 'up'),
    color: '#C9A962',
    title: 'Custom Gold',
    height: 200,
  },
};

export const TallChart: Story = {
  args: {
    data: generateData(24, 500000, 'up'),
    color: 'var(--muted-sage)',
    title: '2 år',
    subtitle: 'Lang tidsserie',
    height: 300,
  },
};

export const MinimalData: Story = {
  args: {
    data: generateData(2, 500000, 'up'),
    color: 'var(--muted-sage)',
    title: 'Minimal data',
    height: 200,
    showXAxis: true,
  },
  parameters: {
    docs: { description: { story: 'Chart with minimal data points (2 months)' } },
  },
};

export const NoData: Story = {
  args: {
    data: [],
    color: 'var(--muted-sage)',
    title: 'No data available',
    height: 200,
    showXAxis: true,
  },
  parameters: {
    docs: { description: { story: 'Empty state when no data is available' } },
  },
};

export const LargeValues: Story = {
  args: {
    data: generateData(12, 10000000, 'up'),
    color: 'var(--muted-sage)',
    title: 'Large portfolio values',
    subtitle: 'Multi-million values',
    height: 200,
  },
  parameters: {
    docs: { description: { story: 'Chart with large numerical values' } },
  },
};

export const CustomXAxisFormat: Story = {
  args: {
    data: generateData(12, 500000, 'up'),
    color: 'var(--muted-sage)',
    title: 'Custom date format',
    height: 200,
    xAxisFormat: (date: Date) => `${date.getDate()}/${date.getMonth() + 1}`,
  },
  parameters: {
    docs: { description: { story: 'Chart with custom X-axis date formatting' } },
  },
};
