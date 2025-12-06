import type { Meta, StoryObj } from '@storybook/react';
import { BreakdownCard } from './BreakdownCard';

const meta = {
  title: 'Cards/BreakdownCard',
  component: BreakdownCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text' },
    iconLabel: { control: 'text' },
    value: { control: 'number' },
    label: { control: 'text' },
    percentage: { control: { type: 'range', min: 0, max: 100 } },
    variant: {
      control: 'radio',
      options: ['primary', 'secondary'],
    },
  },
} satisfies Meta<typeof BreakdownCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    icon: '🏢',
    iconLabel: 'Arbeidsgiver',
    value: 450000,
    label: 'Pensjon arbeidsgiver',
    percentage: 70,
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    icon: '🏛️',
    iconLabel: 'NAV',
    value: 192857,
    label: 'Pensjon NAV',
    percentage: 30,
    variant: 'secondary',
  },
};

export const SavingsBreakdown: Story = {
  args: {
    icon: '📈',
    iconLabel: 'Aksjer',
    value: 850000,
    label: 'Aksjer og fond',
    percentage: 65,
    variant: 'primary',
  },
};

export const DebtBreakdown: Story = {
  args: {
    icon: '🏠',
    iconLabel: 'Boliglån',
    value: 2500000,
    label: 'Boliglån',
    percentage: 85,
    variant: 'secondary',
  },
};

export const SmallPercentage: Story = {
  args: {
    icon: '💰',
    iconLabel: 'Krypto',
    value: 25000,
    label: 'Kryptovaluta',
    percentage: 3,
    variant: 'primary',
  },
};

export const LargeValue: Story = {
  args: {
    icon: '🏦',
    iconLabel: 'Bank',
    value: 15000000,
    label: 'Bankinnskudd',
    percentage: 45,
    variant: 'primary',
  },
};

/**
 * Side-by-side breakdown cards as used on Pensjon page
 */
export const PensjonBreakdown: Story = {
  args: {
    icon: '🏢',
    iconLabel: 'Arbeidsgiver',
    value: 450000,
    label: 'Pensjon arbeidsgiver',
    percentage: 70,
    variant: 'primary',
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '600px' }}>
      <BreakdownCard
        icon="🏢"
        iconLabel="Arbeidsgiver"
        value={450000}
        label="Pensjon arbeidsgiver"
        percentage={70}
        variant="primary"
      />
      <BreakdownCard
        icon="🏛️"
        iconLabel="NAV"
        value={192857}
        label="Pensjon NAV"
        percentage={30}
        variant="secondary"
      />
    </div>
  ),
};
