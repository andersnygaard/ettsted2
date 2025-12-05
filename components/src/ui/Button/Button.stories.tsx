import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import { Button } from './Button'
import './Button.css'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
    variant: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' }
    },
    disabled: { control: 'boolean' },
    type: {
      options: ['button', 'submit', 'reset'],
      control: { type: 'radio' }
    },
    onClick: { action: 'clicked' }
  }
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Click me',
    variant: 'primary'
  }
}

export const PrimaryInteractive: Story = {
  args: {
    children: 'Click me',
    variant: 'primary'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    await userEvent.click(button)
  },
  parameters: {
    docs: { description: { story: 'Click interaction test for primary button' } },
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary'
  }
}

export const SecondaryInteractive: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    await userEvent.click(button)
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true
  }
}

export const DisabledSecondary: Story = {
  args: {
    children: 'Disabled Secondary',
    variant: 'secondary',
    disabled: true
  }
}

export const WithIcon: Story = {
  args: {
    children: 'Add Item',
    variant: 'primary',
    icon: '+'
  }
}

export const WithIconInteractive: Story = {
  args: {
    children: 'Add Item',
    variant: 'primary',
    icon: '+'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    await userEvent.click(button)
  },
  parameters: {
    docs: { description: { story: 'Button with icon and click interaction' } },
  },
}

export const Submit: Story = {
  args: {
    children: 'Submit',
    variant: 'primary',
    type: 'submit'
  }
}

export const Reset: Story = {
  args: {
    children: 'Reset',
    variant: 'secondary',
    type: 'reset'
  }
}

export const LongText: Story = {
  args: {
    children: 'This is a button with longer text content',
    variant: 'primary'
  }
}

export const SmallText: Story = {
  args: {
    children: 'Go',
    variant: 'primary'
  }
}

export const CustomClass: Story = {
  args: {
    children: 'Custom styled',
    variant: 'primary',
    className: 'custom-button-class'
  }
}
