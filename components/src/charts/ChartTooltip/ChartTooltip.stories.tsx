import type { Meta, StoryObj } from '@storybook/react'
import { ChartTooltip } from './ChartTooltip'
import './ChartTooltip.css'

const meta: Meta<typeof ChartTooltip> = {
  title: 'Charts/ChartTooltip',
  component: ChartTooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  },
  argTypes: {
    visible: { control: 'boolean' },
    x: { control: 'number' },
    y: { control: 'number' },
    date: { control: 'date' }
  }
}

export default meta
type Story = StoryObj<typeof ChartTooltip>

const today = new Date()

export const Default: Story = {
  args: {
    visible: true,
    x: 200,
    y: 100,
    date: today,
    values: [
      {
        label: 'Sparing',
        value: 1250000,
        color: 'var(--muted-sage)'
      }
    ]
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'var(--bone)',
        border: '1px solid var(--border)'
      }}
    >
      <ChartTooltip {...args} />
      <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Tooltip positioned at ({args.x}, {args.y})
      </div>
    </div>
  )
}

export const Hidden: Story = {
  args: {
    visible: false,
    x: 200,
    y: 100,
    date: today,
    values: [
      {
        label: 'Sparing',
        value: 1250000,
        color: 'var(--muted-sage)'
      }
    ]
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'var(--bone)',
        border: '1px solid var(--border)'
      }}
    >
      <ChartTooltip {...args} />
      <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Tooltip is hidden (visible=false)
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip is not rendered when visible is false' } }
  }
}

export const SingleValue: Story = {
  args: {
    visible: true,
    x: 300,
    y: 150,
    date: new Date('2024-06-15'),
    values: [
      {
        label: 'Totalverdi',
        value: 2500000,
        color: 'var(--muted-sage)'
      }
    ]
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'var(--bone)',
        border: '1px solid var(--border)'
      }}
    >
      <ChartTooltip {...args} />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip with single value (area chart)' } }
  }
}

export const MultipleValues: Story = {
  args: {
    visible: true,
    x: 250,
    y: 120,
    date: new Date('2024-06-15'),
    values: [
      {
        label: 'Aksjer',
        value: 800000,
        color: 'var(--muted-sage)'
      },
      {
        label: 'Fond',
        value: 600000,
        color: 'var(--soft-terracotta)'
      },
      {
        label: 'Bankkonto',
        value: 400000,
        color: 'var(--pale-blue)'
      }
    ],
    total: 1800000
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'var(--bone)',
        border: '1px solid var(--border)'
      }}
    >
      <ChartTooltip {...args} />
      <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Tooltip shows breakdown for stacked area chart
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip with multiple values and total (stacked area chart)' } }
  }
}

export const ManyValues: Story = {
  args: {
    visible: true,
    x: 200,
    y: 100,
    date: new Date('2024-06-15'),
    values: [
      {
        label: 'Aksjer',
        value: 500000,
        color: 'var(--muted-sage)'
      },
      {
        label: 'Fond',
        value: 400000,
        color: 'var(--soft-terracotta)'
      },
      {
        label: 'Krypto',
        value: 200000,
        color: '#FF6B35'
      },
      {
        label: 'Obligasjoner',
        value: 300000,
        color: 'var(--pale-blue)'
      },
      {
        label: 'Bankkonto',
        value: 150000,
        color: 'var(--gold)'
      }
    ],
    total: 1550000
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '500px',
        background: 'var(--bone)',
        border: '1px solid var(--border)'
      }}
    >
      <ChartTooltip {...args} />
      <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Tooltip with many values (scrollable if needed)
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip with many account values in breakdown' } }
  }
}

export const PositionedTopLeft: Story = {
  args: {
    visible: true,
    x: 50,
    y: 50,
    date: today,
    values: [
      {
        label: 'Sparing',
        value: 1250000,
        color: 'var(--muted-sage)'
      }
    ]
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'var(--bone)',
        border: '1px solid var(--border)'
      }}
    >
      <ChartTooltip {...args} />
      <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Positioned at top-left (50, 50)
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip near top-left corner of chart' } }
  }
}

export const PositionedTopRight: Story = {
  args: {
    visible: true,
    x: 550,
    y: 50,
    date: today,
    values: [
      {
        label: 'Sparing',
        value: 1250000,
        color: 'var(--muted-sage)'
      }
    ]
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'var(--bone)',
        border: '1px solid var(--border)'
      }}
    >
      <ChartTooltip {...args} />
      <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Positioned at top-right (550, 50)
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip near top-right corner - demonstrates flip positioning' } }
  }
}

export const PositionedBottomLeft: Story = {
  args: {
    visible: true,
    x: 50,
    y: 350,
    date: today,
    values: [
      {
        label: 'Sparing',
        value: 1250000,
        color: 'var(--muted-sage)'
      }
    ]
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'var(--bone)',
        border: '1px solid var(--border)'
      }}
    >
      <ChartTooltip {...args} />
      <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Positioned at bottom-left (50, 350)
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip near bottom-left corner' } }
  }
}

export const PositionedBottomRight: Story = {
  args: {
    visible: true,
    x: 550,
    y: 350,
    date: today,
    values: [
      {
        label: 'Sparing',
        value: 1250000,
        color: 'var(--muted-sage)'
      }
    ]
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'var(--bone)',
        border: '1px solid var(--border)'
      }}
    >
      <ChartTooltip {...args} />
      <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Positioned at bottom-right (550, 350)
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip near bottom-right corner' } }
  }
}

export const LargeValues: Story = {
  args: {
    visible: true,
    x: 300,
    y: 150,
    date: today,
    values: [
      {
        label: 'Totalverdi',
        value: 25000000,
        color: 'var(--muted-sage)'
      }
    ]
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'var(--bone)',
        border: '1px solid var(--border)'
      }}
    >
      <ChartTooltip {...args} />
      <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Large numerical values are formatted with Norwegian currency
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip with large portfolio values' } }
  }
}

export const SmallValues: Story = {
  args: {
    visible: true,
    x: 300,
    y: 150,
    date: today,
    values: [
      {
        label: 'Bankkonto',
        value: 15000,
        color: 'var(--pale-blue)'
      }
    ]
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'var(--bone)',
        border: '1px solid var(--border)'
      }}
    >
      <ChartTooltip {...args} />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip with small values' } }
  }
}

export const NegativeValues: Story = {
  args: {
    visible: true,
    x: 300,
    y: 150,
    date: today,
    values: [
      {
        label: 'Gjeld',
        value: -500000,
        color: 'var(--negative)'
      }
    ]
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'var(--bone)',
        border: '1px solid var(--border)'
      }}
    >
      <ChartTooltip {...args} />
      <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Negative values are supported (e.g., debt shown as negative)
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip with negative values for debt representation' } }
  }
}

export const MixedPositiveNegative: Story = {
  args: {
    visible: true,
    x: 250,
    y: 120,
    date: today,
    values: [
      {
        label: 'Sparing',
        value: 1500000,
        color: 'var(--muted-sage)'
      },
      {
        label: 'Gjeld',
        value: -300000,
        color: 'var(--negative)'
      }
    ],
    total: 1200000
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'var(--bone)',
        border: '1px solid var(--border)'
      }}
    >
      <ChartTooltip {...args} />
      <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Mixed positive and negative values showing net worth calculation
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip with mixed assets and liabilities' } }
  }
}

export const DateVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>Recent date</div>
        <div
          style={{
            position: 'relative',
            width: '300px',
            height: '250px',
            background: 'var(--bone)',
            border: '1px solid var(--border)'
          }}
        >
          <ChartTooltip
            visible={true}
            x={100}
            y={80}
            date={new Date()}
            values={[
              {
                label: 'Sparing',
                value: 1250000,
                color: 'var(--muted-sage)'
              }
            ]}
          />
        </div>
      </div>
      <div>
        <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold' }}>Historical date</div>
        <div
          style={{
            position: 'relative',
            width: '300px',
            height: '250px',
            background: 'var(--bone)',
            border: '1px solid var(--border)'
          }}
        >
          <ChartTooltip
            visible={true}
            x={100}
            y={80}
            date={new Date('2020-01-15')}
            values={[
              {
                label: 'Sparing',
                value: 500000,
                color: 'var(--muted-sage)'
              }
            ]}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip displays various date formats correctly' } }
  }
}

export const Accessibility: Story = {
  args: {
    visible: true,
    x: 300,
    y: 150,
    date: today,
    values: [
      {
        label: 'Sparing',
        value: 1250000,
        color: 'var(--muted-sage)'
      }
    ]
  },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'var(--bone)',
        border: '1px solid var(--border)'
      }}
    >
      <ChartTooltip {...args} />
      <div style={{ padding: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        <p>Accessibility features:</p>
        <ul>
          <li>role="tooltip" for screen reader announcement</li>
          <li>aria-live="polite" for dynamic content updates</li>
          <li>Formatted currency and dates for readability</li>
          <li>Color contrast meets WCAG AA standards</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'ChartTooltip implements accessibility with ARIA attributes, semantic markup, and proper formatting'
      }
    }
  }
}

export const OverflowHandling: Story = {
  render: () => (
    <div
      style={{
        position: 'relative',
        width: '600px',
        height: '400px',
        background: 'var(--bone)',
        border: '1px solid var(--border)',
        marginBottom: '16px'
      }}
    >
      <div style={{ padding: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
        Tooltip at right edge (should position left to avoid overflow)
      </div>
      <ChartTooltip
        visible={true}
        x={580}
        y={150}
        date={today}
        values={[
          {
            label: 'Sparing',
            value: 1250000,
            color: 'var(--muted-sage)'
          }
        ]}
      />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip automatically adjusts position to avoid viewport overflow' } }
  }
}
