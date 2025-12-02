import type { Meta, StoryObj } from '@storybook/react';
import { HeroNumber } from './HeroNumber';

const meta = {
  title: 'Data/HeroNumber',
  component: HeroNumber,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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

export const NegativeChange: Story = {
  args: {
    label: 'Sum gjeld',
    value: '456 789 kr',
    change: -1.25,
    changeLabel: 'denne måneden',
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

export const SmallValue: Story = {
  args: {
    label: 'Månedlig sparing',
    value: '12 500 kr',
    change: 3.5,
    changeLabel: 'vs forrige måned',
  },
};
