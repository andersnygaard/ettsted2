import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './PageHeader';

const meta = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Centered: Story = {
  args: {
    title: 'God morgen, Anders',
    subtitle: 'November 2024',
    centered: true,
  },
};

export const LeftAligned: Story = {
  args: {
    title: 'Portefølje',
    subtitle: 'Alle dine investeringer',
    centered: false,
  },
};

export const WithActions: Story = {
  args: {
    title: 'Portefølje',
    subtitle: 'Månedlig historikk',
    centered: false,
    actions: (
      <div style={{ display: 'flex', gap: '12px' }}>
        <button style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc' }}>
          Eksporter
        </button>
        <button style={{ padding: '8px 16px', borderRadius: '4px', background: '#8B9A7D', color: 'white' }}>
          + Ny måned
        </button>
      </div>
    ),
  },
};

export const WithBreadcrumb: Story = {
  args: {
    title: 'Sparing',
    subtitle: 'Din vei mot økonomisk frihet',
    centered: false,
  },
};

export const DashboardStyle: Story = {
  args: {
    title: 'Oversikt',
    subtitle: 'Desember 2024',
    centered: true,
  },
};

export const DetailPageStyle: Story = {
  args: {
    title: 'Gjeld',
    subtitle: 'Oversikt over lån og nedbetaling',
    centered: false,
  },
};
