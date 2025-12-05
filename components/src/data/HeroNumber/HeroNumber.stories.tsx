import type { Meta, StoryObj } from '@storybook/react';
import { HeroNumber } from './HeroNumber';

const meta = {
  title: 'Data/HeroNumber',
  component: HeroNumber,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    change: { control: 'number' },
    changeLabel: { control: 'text' },
  },
} satisfies Meta<typeof HeroNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Netto formue',
    value: '1 234 567 kr',
    change: 2.33,
    changeLabel: 'denne måneden',
  },
};

export const PositiveChange: Story = {
  args: {
    label: 'Sum sparing',
    value: '970 194 kr',
    change: 5.42,
    changeLabel: 'i år',
  },
};

export const PositiveChangeGreen: Story = {
  args: {
    label: 'Avkastning',
    value: '1 234 567 kr',
    change: 12.8,
    changeLabel: 'siste 12 måneder',
  },
  parameters: {
    docs: { description: { story: 'Positive change indicator displayed in green (--positive color)' } },
  },
};

export const NegativeChange: Story = {
  args: {
    label: 'Sum gjeld',
    value: '456 789 kr',
    change: -1.25,
    changeLabel: 'denne måneden',
  },
};

export const NegativeChangeRed: Story = {
  args: {
    label: 'Gjeld',
    value: '500 000 kr',
    change: -3.5,
    changeLabel: 'siste måned',
  },
  parameters: {
    docs: { description: { story: 'Negative change indicator displayed in red (--negative color)' } },
  },
};

export const NoChange: Story = {
  args: {
    label: 'Pensjon',
    value: '345 678 kr',
  },
};

export const LargeValue: Story = {
  args: {
    label: 'Firetall',
    value: '6 400 000 kr',
    change: 12.8,
    changeLabel: 'siste 12 måneder',
  },
};

export const NorwegianFormatting: Story = {
  args: {
    label: 'Netto formue',
    value: '2 156 789,50 kr',
    change: 4.25,
    changeLabel: 'denne måneden',
  },
  parameters: {
    docs: { description: { story: 'Demonstrates Norwegian number formatting (space thousands, comma decimal)' } },
  },
};

export const SmallValue: Story = {
  args: {
    label: 'Månedlig sparing',
    value: '12 500 kr',
    change: 3.5,
    changeLabel: 'vs forrige måned',
  },
};

export const PercentageChange: Story = {
  args: {
    label: 'Sparerate',
    value: '42,3 %',
    change: 2.1,
    changeLabel: 'vs forrige år',
  },
};

export const ZeroChange: Story = {
  args: {
    label: 'Inntekt',
    value: '75 000 kr',
    change: 0,
    changeLabel: 'denne måneden',
  },
};

export const LargePositiveChange: Story = {
  args: {
    label: 'Porteføljeverdi',
    value: '5 234 567 kr',
    change: 28.5,
    changeLabel: 'siste år',
  },
  parameters: {
    docs: { description: { story: 'Large positive change value' } },
  },
};
