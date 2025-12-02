import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'
import './Button.css'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
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

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary'
  }
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
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

export const Submit: Story = {
  args: {
    children: 'Submit',
    variant: 'primary',
    type: 'submit'
  }
}
