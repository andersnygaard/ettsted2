import type { Meta, StoryObj } from '@storybook/react';
import { StackedAreaChart } from './StackedAreaChart';

const meta = {
  title: 'Charts/StackedAreaChart',
  component: StackedAreaChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StackedAreaChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate mock pension data
const generatePensionData = (years: number) => {
  const data = [];
  const startYear = new Date().getFullYear();

  for (let i = 0; i < years; i++) {
    const year = startYear + i;
    data.push({
      date: new Date(year, 0, 1),
      arbeidsgiver: 50000 + i * 8000 + Math.random() * 5000,
      nav: 20000 + i * 3000 + Math.random() * 2000,
    });
  }

  return data;
};

// Generate mock savings data
const generateSavingsData = (years: number) => {
  const data = [];
  const startYear = new Date().getFullYear();

  for (let i = 0; i < years; i++) {
    const year = startYear + i;
    data.push({
      date: new Date(year, 0, 1),
      aksjer: 200000 + i * 15000 + Math.random() * 20000,
      fond: 150000 + i * 10000 + Math.random() * 15000,
      krypto: 50000 + i * 5000 + Math.random() * 10000,
    });
  }

  return data;
};

export const PensionDevelopment: Story = {
  args: {
    data: generatePensionData(10),
    series: [
      { key: 'arbeidsgiver', color: '#6a7a60', label: 'Arbeidsgiver' },
      { key: 'nav', color: '#8b9a7d', label: 'NAV' },
    ],
    title: 'Pensjonsutvikling',
    height: 200,
  },
};

export const SavingsBreakdown: Story = {
  args: {
    data: generateSavingsData(8),
    series: [
      { key: 'aksjer', color: '#5a6d7a', label: 'Aksjer' },
      { key: 'fond', color: '#b8c5d0', label: 'Fond' },
      { key: 'krypto', color: '#c4a484', label: 'Krypto' },
    ],
    title: 'Sparing fordelt',
    height: 250,
  },
};

export const ShortTimeline: Story = {
  args: {
    data: generatePensionData(5),
    series: [
      { key: 'arbeidsgiver', color: '#6a7a60', label: 'Arbeidsgiver' },
      { key: 'nav', color: '#8b9a7d', label: 'NAV' },
    ],
    title: '5 år',
    height: 200,
  },
};

export const LongTimeline: Story = {
  args: {
    data: generatePensionData(20),
    series: [
      { key: 'arbeidsgiver', color: '#6a7a60', label: 'Arbeidsgiver' },
      { key: 'nav', color: '#8b9a7d', label: 'NAV' },
    ],
    title: '20 år fremskrivning',
    height: 250,
  },
};

export const ThreeSeries: Story = {
  args: {
    data: generateSavingsData(12),
    series: [
      { key: 'aksjer', color: '#5a6d7a', label: 'Aksjer' },
      { key: 'fond', color: '#b8c5d0', label: 'Fond' },
      { key: 'krypto', color: '#c4a484', label: 'Krypto' },
    ],
    title: 'Tre kategorier',
    height: 200,
  },
};

export const NoTitle: Story = {
  args: {
    data: generatePensionData(10),
    series: [
      { key: 'arbeidsgiver', color: '#6a7a60', label: 'Arbeidsgiver' },
      { key: 'nav', color: '#8b9a7d', label: 'NAV' },
    ],
    height: 200,
  },
};

export const TallChart: Story = {
  args: {
    data: generatePensionData(15),
    series: [
      { key: 'arbeidsgiver', color: '#6a7a60', label: 'Arbeidsgiver' },
      { key: 'nav', color: '#8b9a7d', label: 'NAV' },
    ],
    title: 'Høyere diagram',
    height: 300,
  },
};

export const CustomColors: Story = {
  args: {
    data: generatePensionData(10),
    series: [
      { key: 'arbeidsgiver', color: '#C9A962', label: 'Arbeidsgiver' },
      { key: 'nav', color: '#C4A484', label: 'NAV' },
    ],
    title: 'Custom farger',
    height: 200,
  },
};

export const MinimalData: Story = {
  args: {
    data: generatePensionData(2),
    series: [
      { key: 'arbeidsgiver', color: '#6a7a60', label: 'Arbeidsgiver' },
      { key: 'nav', color: '#8b9a7d', label: 'NAV' },
    ],
    title: 'Minimal data (2 år)',
    height: 200,
  },
  parameters: {
    docs: { description: { story: 'Chart with minimal data points' } },
  },
};

export const NoData: Story = {
  args: {
    data: [],
    series: [
      { key: 'arbeidsgiver', color: '#6a7a60', label: 'Arbeidsgiver' },
      { key: 'nav', color: '#8b9a7d', label: 'NAV' },
    ],
    title: 'No data available',
    height: 200,
  },
  parameters: {
    docs: { description: { story: 'Empty state when no data is available' } },
  },
};

export const LargeValues: Story = {
  args: {
    data: generatePensionData(10).map((d) => ({
      ...d,
      arbeidsgiver: d.arbeidsgiver * 10,
      nav: d.nav * 10,
    })),
    series: [
      { key: 'arbeidsgiver', color: '#6a7a60', label: 'Arbeidsgiver' },
      { key: 'nav', color: '#8b9a7d', label: 'NAV' },
    ],
    title: 'Large values',
    height: 200,
  },
  parameters: {
    docs: { description: { story: 'Chart with large numerical values' } },
  },
};

export const FourSeries: Story = {
  args: {
    data: generateSavingsData(12),
    series: [
      { key: 'aksjer', color: '#5a6d7a', label: 'Aksjer' },
      { key: 'fond', color: '#b8c5d0', label: 'Fond' },
      { key: 'krypto', color: '#c4a484', label: 'Krypto' },
      { key: 'bankkonto', color: '#8b9a7d', label: 'Bankkonto' },
    ],
    title: 'Fire kategorier',
    height: 250,
  },
  parameters: {
    docs: { description: { story: 'Stacked chart with four data series' } },
  },
};
