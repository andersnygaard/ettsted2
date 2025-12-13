import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import { Tooltip } from './Tooltip'
import './Tooltip.css'

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    side: {
      options: ['left', 'right', 'auto'],
      control: { type: 'radio' }
    },
    delay: { control: 'number' }
  }
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    side: 'auto',
    delay: 200,
    children: <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Hover me</button>
  }
}

export const DefaultInteractive: Story = {
  args: {
    content: 'This is a tooltip',
    side: 'auto',
    delay: 200,
    children: <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Hover me</button>
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('tooltip')
    await userEvent.hover(trigger)
    await new Promise(resolve => setTimeout(resolve, 300))
  },
  parameters: {
    docs: { description: { story: 'Tooltip appears on hover with default delay (200ms)' } }
  }
}

export const PositionRight: Story = {
  args: {
    content: 'Right-positioned tooltip',
    side: 'right',
    delay: 200,
    children: <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Hover me</button>
  },
  parameters: {
    docs: { description: { story: 'Tooltip positioned to the right of the trigger element' } }
  }
}

export const PositionLeft: Story = {
  args: {
    content: 'Left-positioned tooltip',
    side: 'left',
    delay: 200,
    children: <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Hover me</button>
  },
  parameters: {
    docs: { description: { story: 'Tooltip positioned to the left of the trigger element' } }
  }
}

export const AutoPosition: Story = {
  args: {
    content: 'Auto-positioned tooltip - flips if too close to viewport edge',
    side: 'auto',
    delay: 200,
    children: <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Hover me</button>
  },
  parameters: {
    docs: { description: { story: 'Tooltip automatically flips position based on available viewport space' } }
  }
}

export const ZeroDelay: Story = {
  args: {
    content: 'Appears immediately',
    side: 'auto',
    delay: 0,
    children: <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Hover me</button>
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('tooltip')
    await userEvent.hover(trigger)
    await new Promise(resolve => setTimeout(resolve, 100))
  },
  parameters: {
    docs: { description: { story: 'Tooltip with no delay (0ms) appears immediately on hover' } }
  }
}

export const LongDelay: Story = {
  args: {
    content: 'This appears after a long delay',
    side: 'auto',
    delay: 1000,
    children: <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Hover me (slow tooltip)</button>
  },
  parameters: {
    docs: { description: { story: 'Tooltip with long delay (1000ms) for less intrusive hints' } }
  }
}

export const MediumDelay: Story = {
  args: {
    content: 'Medium delay tooltip',
    side: 'auto',
    delay: 500,
    children: <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Hover me</button>
  },
  parameters: {
    docs: { description: { story: 'Tooltip with medium delay (500ms)' } }
  }
}

export const LongContent: Story = {
  args: {
    content: 'This is a longer tooltip content that provides more detailed information about the interactive element',
    side: 'auto',
    delay: 200,
    children: <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Hover me</button>
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('tooltip')
    await userEvent.hover(trigger)
    await new Promise(resolve => setTimeout(resolve, 300))
  },
  parameters: {
    docs: { description: { story: 'Tooltip with longer content for detailed explanations' } }
  }
}

export const ShortContent: Story = {
  args: {
    content: 'Save',
    side: 'auto',
    delay: 200,
    children: <button style={{ padding: '8px 16px', cursor: 'pointer' }}>📁</button>
  },
  parameters: {
    docs: { description: { story: 'Tooltip with short content for icon buttons' } }
  }
}

export const ReactNodeContent: Story = {
  args: {
    content: (
      <div style={{ fontSize: '12px' }}>
        <strong>Save File</strong>
        <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.9 }}>Ctrl+S</div>
      </div>
    ),
    side: 'auto',
    delay: 200,
    children: <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Save</button>
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('tooltip')
    await userEvent.hover(trigger)
    await new Promise(resolve => setTimeout(resolve, 300))
  },
  parameters: {
    docs: { description: { story: 'Tooltip with React node content for complex layouts' } }
  }
}

export const KeyboardAccessibility: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Tooltip content="Press Escape to close this tooltip" side="auto" delay={0}>
        <button style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Hover or focus me
        </button>
      </Tooltip>
      <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Keyboard support: Hover or focus the button, then press Escape to hide the tooltip.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tooltip is keyboard accessible. Press Escape key while tooltip is visible to close it. WCAG 2.1 compliant.'
      }
    }
  }
}

export const MultipleTooltips: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', padding: '24px' }}>
      <Tooltip content="Create new item" side="auto" delay={200}>
        <button style={{ padding: '8px 16px', cursor: 'pointer' }}>+</button>
      </Tooltip>
      <Tooltip content="Edit item" side="auto" delay={200}>
        <button style={{ padding: '8px 16px', cursor: 'pointer' }}>✎</button>
      </Tooltip>
      <Tooltip content="Delete item" side="auto" delay={200}>
        <button style={{ padding: '8px 16px', cursor: 'pointer' }}>🗑</button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Multiple tooltips on different elements work independently' } }
  }
}

export const WithCustomClass: Story = {
  args: {
    content: 'Custom styled tooltip',
    side: 'auto',
    delay: 200,
    className: 'custom-tooltip-class',
    children: <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Hover me</button>
  },
  parameters: {
    docs: { description: { story: 'Tooltip with custom className for styling customization' } }
  }
}

export const MobileSimulation: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Tooltip content="Tap to see tooltip" side="auto" delay={0}>
        <button style={{
          padding: '16px',
          cursor: 'pointer',
          minHeight: '44px',
          minWidth: '44px'
        }}>
          Tap
        </button>
      </Tooltip>
      <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        Touch targets are minimum 44x44px for accessibility on mobile devices.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tooltip trigger buttons meet minimum 44x44px touch target size for mobile accessibility'
      }
    }
  }
}

export const EdgeCase: Story = {
  render: () => (
    <div style={{ padding: '24px', background: 'var(--bone)' }}>
      <div style={{ marginBottom: '16px' }}>
        <Tooltip content="Right edge test" side="right" delay={200}>
          <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Right edge</button>
        </Tooltip>
      </div>
      <div>
        <Tooltip content="Left edge test" side="left" delay={200}>
          <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Left edge</button>
        </Tooltip>
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Tooltip behavior when trigger element is near viewport edges' } }
  }
}
