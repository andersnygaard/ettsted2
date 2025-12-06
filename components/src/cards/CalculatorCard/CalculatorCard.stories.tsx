import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { CalculatorCard } from './CalculatorCard';

const meta = {
  title: 'Layout/CalculatorCard',
  component: CalculatorCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof CalculatorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: '📈',
    title: 'Renters rente',
    description: 'Beregn hvordan pengene dine vokser over tid med renters rente',
    href: '/calculators/compound',
  },
};

export const WithIcon: Story = {
  args: {
    icon: '🎯',
    title: 'F.I.R.E. kalkulator',
    description: 'Beregn når du kan pensjonere deg basert på spareinntekter',
    href: '/calculators/fire',
  },
};

export const MonteCarloCard: Story = {
  args: {
    icon: '🎲',
    title: 'Monte Carlo',
    description: 'Simuler pensjonistscenarioer med markedsvolatilitet',
    href: '/calculators/monte-carlo',
  },
};

export const LoanCard: Story = {
  args: {
    icon: '🏠',
    title: 'Lånekalkulator',
    description: 'Beregn månedlige betalinger og total rente for lån',
    href: '/calculators/loan',
  },
};

export const WithCustomBackground: Story = {
  args: {
    icon: '📊',
    title: 'Analyse',
    description: 'Analyser porteføljeprestasjon og fordeling',
    href: '/calculators/analysis',
    iconBg: '#E8D7C3',
  },
};

export const TwoByTwoGrid: Story = {
  args: {
    icon: '📈',
    title: '2x2 Grid',
    description: 'Grid layout demo',
    href: '/calculators',
  },
  render: () => (
    <BrowserRouter>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', maxWidth: '600px' }}>
        <CalculatorCard
          icon="📈"
          title="Renters rente"
          description="Beregn hvordan pengene dine vokser"
          href="/calculators/compound"
        />
        <CalculatorCard
          icon="🎯"
          title="F.I.R.E."
          description="Veien til økonomisk frihet"
          href="/calculators/fire"
        />
        <CalculatorCard
          icon="🏠"
          title="Lånekalkulator"
          description="Kalkuler lånets påvirkning"
          href="/calculators/loan"
        />
        <CalculatorCard
          icon="🎲"
          title="Monte Carlo"
          description="Pensjonistscenarioer"
          href="/calculators/monte-carlo"
        />
      </div>
    </BrowserRouter>
  ),
};

export const SingleCard: Story = {
  render: (args) => (
    <BrowserRouter>
      <div style={{ maxWidth: '300px' }}>
        <CalculatorCard {...args} />
      </div>
    </BrowserRouter>
  ),
  args: {
    icon: '🎯',
    title: 'F.I.R.E. kalkulator',
    description: 'Beregn når du kan pensjonere deg',
    href: '/calculators/fire',
  },
};

export const WithHover: Story = {
  args: {
    icon: '📈',
    title: 'Renters rente',
    description: 'Beregn hvordan pengene dine vokser over tid',
    href: '/calculators/compound',
  },
  parameters: {
    pseudo: { hover: true },
  },
};
