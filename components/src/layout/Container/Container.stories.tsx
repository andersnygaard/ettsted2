import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';

const meta = {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ background: '#F5F2ED', padding: '48px', textAlign: 'center' }}>
        <h2>Default Container (1200px)</h2>
        <p>Max width 1200px for dashboard and overview pages</p>
      </div>
    ),
    width: 'default',
  },
};

export const Narrow: Story = {
  args: {
    children: (
      <div style={{ background: '#FDFCFA', padding: '48px', textAlign: 'center' }}>
        <h2>Narrow Container (900px)</h2>
        <p>Max width 900px for calculators and focused pages</p>
      </div>
    ),
    width: 'narrow',
  },
};

export const Wide: Story = {
  args: {
    children: (
      <div style={{ background: '#F5F2ED', padding: '48px', textAlign: 'center' }}>
        <h2>Wide Container (1800px)</h2>
        <p>Max width 1800px for portfolio table and wide layouts</p>
      </div>
    ),
    width: 'wide',
  },
};

export const WithContent: Story = {
  args: {
    children: (
      <div>
        <h1 style={{ fontSize: '32px', marginBottom: '16px' }}>Page Title</h1>
        <p style={{ fontSize: '16px', color: '#6B6B6B', marginBottom: '48px' }}>
          Subtitle with additional information about the page
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginTop: '48px',
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                padding: '32px',
                background: '#FDFCFA',
                borderRadius: '4px',
                textAlign: 'center',
              }}
            >
              <h3>Card {i}</h3>
              <p>Content for card {i}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    width: 'default',
  },
};

export const ResponsiveComparison: Story = {
  args: {
    children: <div>Responsive Comparison</div>,
  },
  render: () => (
    <div>
      <div style={{ background: '#F5F2ED', padding: '32px 0', marginBottom: '32px' }}>
        <Container width="narrow">
          <div style={{ padding: '32px', background: '#FDFCFA', borderRadius: '4px' }}>
            <h3>Narrow (900px)</h3>
            <p>Calculators and focused content</p>
          </div>
        </Container>
      </div>

      <div style={{ background: '#F5F2ED', padding: '32px 0', marginBottom: '32px' }}>
        <Container width="default">
          <div style={{ padding: '32px', background: '#FDFCFA', borderRadius: '4px' }}>
            <h3>Default (1200px)</h3>
            <p>Dashboard and overview pages</p>
          </div>
        </Container>
      </div>

      <div style={{ background: '#F5F2ED', padding: '32px 0' }}>
        <Container width="wide">
          <div style={{ padding: '32px', background: '#FDFCFA', borderRadius: '4px' }}>
            <h3>Wide (1800px)</h3>
            <p>Portfolio table and wide layouts</p>
          </div>
        </Container>
      </div>
    </div>
  ),
};
