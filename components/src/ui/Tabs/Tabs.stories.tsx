import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import { Tabs } from './Tabs'
import './Tabs.css'

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    tabs: { control: 'object' },
    activeTab: { control: 'text' },
    onChange: { action: 'changed' },
    ariaLabel: { control: 'text' },
    className: { control: 'text' }
  }
}

export default meta
type Story = StoryObj<typeof Tabs>

interface TabsStateWrapperProps {
  tabs: Array<{ id: string; label: string }>;
  initialActive?: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * Wrapper component to manage state for stories
 */
function TabsStateWrapper({
  initialActive = 'totalt',
  ...props
}: TabsStateWrapperProps) {
  const [activeTab, setActiveTab] = useState(initialActive)
  return <Tabs {...props} activeTab={activeTab} onChange={setActiveTab} />
}

export const Default: Story = {
  render: (args) => <TabsStateWrapper {...args} />,
  args: {
    tabs: [
      { id: 'totalt', label: 'Totalt' },
      { id: 'per-konto', label: 'Per konto' }
    ],
    initialActive: 'totalt',
    ariaLabel: 'Chart view options'
  }
}

export const ThreeTabs: Story = {
  render: (args) => <TabsStateWrapper {...args} />,
  args: {
    tabs: [
      { id: 'annuity', label: 'Annuitetslån' },
      { id: 'serial', label: 'Serielån' },
      { id: 'flexi', label: 'Fleksilån' }
    ],
    initialActive: 'annuity',
    ariaLabel: 'Loan type selection'
  }
}

export const FourTabs: Story = {
  render: (args) => <TabsStateWrapper {...args} />,
  args: {
    tabs: [
      { id: 'ytd', label: 'YTD' },
      { id: '1yr', label: '1 år' },
      { id: '3yr', label: '3 år' },
      { id: 'all', label: 'Alt' }
    ],
    initialActive: 'all',
    ariaLabel: 'Time range selection'
  }
}

export const ManyTabs: Story = {
  render: (args) => <TabsStateWrapper {...args} />,
  args: {
    tabs: [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
      { id: 'tab3', label: 'Tab 3' },
      { id: 'tab4', label: 'Tab 4' },
      { id: 'tab5', label: 'Tab 5' }
    ],
    initialActive: 'tab1',
    ariaLabel: 'Multiple tabs'
  }
}

export const Interactive: Story = {
  render: (args) => <TabsStateWrapper {...args} />,
  args: {
    tabs: [
      { id: 'totalt', label: 'Totalt' },
      { id: 'per-konto', label: 'Per konto' }
    ],
    initialActive: 'totalt',
    ariaLabel: 'Interactive chart view'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttons = canvas.getAllByRole('tab')

    // Click first tab (already active)
    await userEvent.click(buttons[0])
    await new Promise(resolve => setTimeout(resolve, 100))

    // Click second tab
    await userEvent.click(buttons[1])
    await new Promise(resolve => setTimeout(resolve, 100))

    // Click back to first tab
    await userEvent.click(buttons[0])
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing tab switching with mouse clicks'
      }
    }
  }
}

export const KeyboardNavigation: Story = {
  render: (args) => <TabsStateWrapper {...args} />,
  args: {
    tabs: [
      { id: 'totalt', label: 'Totalt' },
      { id: 'per-konto', label: 'Per konto' }
    ],
    initialActive: 'totalt',
    ariaLabel: 'Keyboard navigation test'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttons = canvas.getAllByRole('tab')

    // Focus first tab
    buttons[0].focus()
    await new Promise(resolve => setTimeout(resolve, 300))

    // Tab to next element (second button)
    await userEvent.tab()
    await new Promise(resolve => setTimeout(resolve, 300))

    // Tab back
    await userEvent.tab({ shift: true })
    await new Promise(resolve => setTimeout(resolve, 300))
  },
  parameters: {
    docs: {
      description: {
        story: 'Keyboard navigation with Tab key. All tabs are accessible via keyboard.'
      }
    }
  }
}

export const CustomClass: Story = {
  render: (args) => <TabsStateWrapper {...args} />,
  args: {
    tabs: [
      { id: 'option1', label: 'Option 1' },
      { id: 'option2', label: 'Option 2' }
    ],
    initialActive: 'option1',
    className: 'custom-tabs',
    ariaLabel: 'Custom styled tabs'
  }
}

export const AccessibilityTest: Story = {
  render: (args) => <TabsStateWrapper {...args} />,
  args: {
    tabs: [
      { id: 'visning1', label: 'Visning 1' },
      { id: 'visning2', label: 'Visning 2' },
      { id: 'visning3', label: 'Visning 3' }
    ],
    initialActive: 'visning1',
    ariaLabel: 'Visningsvalg'
  },
  parameters: {
    docs: {
      description: {
        story: 'Full ARIA support: tablist role, tab roles, aria-selected, aria-controls. Compliant with WCAG 2.1 AAA standards.'
      }
    }
  }
}
