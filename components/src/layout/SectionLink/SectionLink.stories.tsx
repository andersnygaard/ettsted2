import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { SectionLink } from './SectionLink';

const meta = {
  title: 'Layout/SectionLink',
  component: SectionLink,
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
} satisfies Meta<typeof SectionLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Portefølje',
    subtitle: 'Alle investeringer samlet',
    href: '/portfolio',
  },
};

export const Sparing: Story = {
  args: {
    title: 'Sparing',
    subtitle: 'Spareutvikling og F.I.R.E. progresjon',
    href: '/sparing',
  },
};

export const Gjeld: Story = {
  args: {
    title: 'Gjeld',
    subtitle: 'Oversikt over lån og nedbetaling',
    href: '/gjeld',
  },
};

export const GridLayout: Story = {
  render: () => (
    <BrowserRouter>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <SectionLink
          title="Portefølje"
          subtitle="Alle investeringer samlet"
          href="/portfolio"
        />
        <SectionLink
          title="Sparing"
          subtitle="Spareutvikling og F.I.R.E."
          href="/sparing"
        />
        <SectionLink
          title="Kalkulatorer"
          subtitle="Finansielle verktøy"
          href="/calculators"
        />
      </div>
    </BrowserRouter>
  ),
};

export const HoverState: Story = {
  args: {
    title: 'Pensjon',
    subtitle: 'Oppspart pensjon og utbetaling',
    href: '/pension',
  },
  parameters: {
    pseudo: { hover: true },
  },
};

export const SingleCard: Story = {
  args: {
    title: 'Oversikt',
    subtitle: 'Din finansielle status',
    href: '/dashboard',
  },
  render: (args) => (
    <BrowserRouter>
      <div style={{ maxWidth: '400px' }}>
        <SectionLink {...args} />
      </div>
    </BrowserRouter>
  ),
};
