import type { Meta, StoryObj } from '@storybook/react';
import { StatsRow } from './StatsRow';

const meta = {
  title: 'Data/StatsRow',
  component: StatsRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    stats: { control: 'object' },
  },
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

export const NorwegianFormatting: Story = {
  args: {
    stats: [
      { value: '2 156 789,50 kr', label: 'Netto formue' },
      { value: '42,3 %', label: 'Sparerate' },
      { value: '67,8 %', label: 'Dekning' },
    ],
  },
  parameters: {
    docs: { description: { story: 'Demonstrates Norwegian number formatting with space thousands and comma decimals' } },
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

export const TwoColumnsLarge: Story = {
  args: {
    stats: [
      { value: '1 234 567 kr', label: 'Netto formue' },
      { value: '+28,5 %', label: 'Årlig avkastning' },
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

export const FiveColumns: Story = {
  args: {
    stats: [
      { value: '1 234 567 kr', label: 'Netto formue' },
      { value: '970 194 kr', label: 'Sparing' },
      { value: '456 789 kr', label: 'Gjeld' },
      { value: '345 678 kr', label: 'Pensjon' },
      { value: '+5,2 %', label: 'Avkastning' },
    ],
  },
};

export const SavingsMetrics: Story = {
  args: {
    stats: [
      { value: '970 194 kr', label: 'Sum sparing' },
      { value: '42,3 %', label: 'Sparerate' },
      { value: '24,5', label: 'Måneder fri' },
    ],
  },
};

export const LargeNumbers: Story = {
  args: {
    stats: [
      { value: '12 500 000 kr', label: 'Porteføljeverdi' },
      { value: '2 500 000 kr', label: 'Gjeld' },
      { value: '10 000 000 kr', label: 'Netto formue' },
    ],
  },
};

export const MixedFormats: Story = {
  args: {
    stats: [
      { value: '67 år', label: 'Pensjonistalderen' },
      { value: '15 år', label: 'År til FI' },
      { value: '280 000 kr', label: 'Årlig uttak' },
    ],
  },
};
