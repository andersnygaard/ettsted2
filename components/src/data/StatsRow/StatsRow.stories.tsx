import type { Meta, StoryObj } from '@storybook/react';
import { StatsRow } from './StatsRow';

const meta = {
  title: 'Data/StatsRow',
  component: StatsRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StatsRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeColumns: Story = {
  args: {
    stats: [
      { value: '42,3 %', label: 'Sparerate' },
      { value: '12 500 kr', label: 'Siste måned' },
      { value: '24,5', label: 'Måneder fri' },
    ],
  },
};

export const FireMetrics: Story = {
  args: {
    stats: [
      { value: '6 400 000 kr', label: 'Firetall' },
      { value: '67 år', label: 'Min. pensjonsalder' },
      { value: '256 000 kr', label: 'Årlig uttak (4%)' },
    ],
  },
};

export const DebtMetrics: Story = {
  args: {
    stats: [
      { value: '456 789 kr', label: 'Total gjeld' },
      { value: '212,5 %', label: 'Dekning' },
      { value: '18 234 kr', label: 'Månedlig nedbetaling' },
    ],
  },
};

export const PensionMetrics: Story = {
  args: {
    stats: [
      { value: '345 678 kr', label: 'Sum pensjon' },
      { value: '70 %', label: 'Arbeidsgiver' },
      { value: '30 %', label: 'NAV' },
    ],
  },
};

export const TwoColumns: Story = {
  args: {
    stats: [
      { value: '970 194 kr', label: 'Sum sparing' },
      { value: '+12,3 %', label: 'Avkastning i år' },
    ],
  },
};

export const FourColumns: Story = {
  args: {
    stats: [
      { value: '970 194 kr', label: 'Sum sparing' },
      { value: '456 789 kr', label: 'Sum gjeld' },
      { value: '345 678 kr', label: 'Sum pensjon' },
      { value: '42,3 %', label: 'Sparerate' },
    ],
  },
};
