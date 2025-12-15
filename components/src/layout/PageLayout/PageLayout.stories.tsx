import type { Meta, StoryObj } from '@storybook/react';
import { PageLayout } from './PageLayout';

const meta: Meta<typeof PageLayout> = {
  title: 'Layout/PageLayout',
  component: PageLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'bone' },
  },
  argTypes: {
    title: {
      description: 'Page title displayed in header',
      control: 'text',
    },
    subtitle: {
      description: 'Optional description below title',
      control: 'text',
    },
    width: {
      description: 'Container width variant',
      options: ['narrow', 'default', 'wide'],
      control: { type: 'radio' },
    },
    centered: {
      description: 'Center the header text',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageLayout>;

const SampleContent = () => (
  <div style={{ padding: '24px', background: 'var(--warm-white)', borderRadius: '2px' }}>
    <p style={{ margin: 0, color: 'var(--charcoal)' }}>Page content goes here</p>
  </div>
);

export const Default: Story = {
  args: {
    title: 'Oversikt',
    subtitle: 'Din økonomiske oversikt',
    width: 'narrow',
    children: <SampleContent />,
  },
};

export const WithBreadcrumb: Story = {
  args: {
    title: 'Rentes rente',
    subtitle: 'Beregn fremtidig verdi med rentes rente',
    breadcrumb: [
      { label: 'Kalkulatorer', path: '/kalkulatorer' },
      { label: 'Rentes rente' },
    ],
    width: 'narrow',
    children: <SampleContent />,
  },
};

export const WideContainer: Story = {
  args: {
    title: 'Portefølje',
    subtitle: 'Alle data samlet',
    width: 'wide',
    children: <SampleContent />,
  },
};

export const CenteredHeader: Story = {
  args: {
    title: 'Velkommen',
    subtitle: 'Start din økonomiske reise',
    centered: true,
    width: 'narrow',
    children: <SampleContent />,
  },
};

export const WithoutSubtitle: Story = {
  args: {
    title: 'Sparing',
    width: 'narrow',
    children: <SampleContent />,
  },
};

export const DeepBreadcrumb: Story = {
  args: {
    title: 'Monte Carlo',
    subtitle: 'Simuler ulike markedsscenarier',
    breadcrumb: [
      { label: 'Hjem', path: '/' },
      { label: 'Kalkulatorer', path: '/kalkulatorer' },
      { label: 'Monte Carlo' },
    ],
    width: 'narrow',
    children: <SampleContent />,
  },
};
