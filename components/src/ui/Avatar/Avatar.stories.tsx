import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'
import './Avatar.css'

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'radio' }
    },
    name: { control: 'text' }
  }
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Small: Story = {
  args: {
    name: 'John Doe',
    size: 'small'
  }
}

export const Medium: Story = {
  args: {
    name: 'Alice Brown',
    size: 'medium'
  }
}

export const Large: Story = {
  args: {
    name: 'Charlie Davis',
    size: 'large'
  }
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar name="John Doe" size="small" />
      <Avatar name="John Doe" size="medium" />
      <Avatar name="John Doe" size="large" />
    </div>
  )
}

export const WithLongName: Story = {
  args: {
    name: 'Jonathan Doe',
    size: 'large'
  }
}
