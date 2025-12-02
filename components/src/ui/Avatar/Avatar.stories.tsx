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
    initials: { control: 'text' }
  }
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Small: Story = {
  args: {
    initials: 'JD',
    size: 'small'
  }
}

export const Medium: Story = {
  args: {
    initials: 'AB',
    size: 'medium'
  }
}

export const Large: Story = {
  args: {
    initials: 'CD',
    size: 'large'
  }
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Avatar initials="JD" size="small" />
      <Avatar initials="JD" size="medium" />
      <Avatar initials="JD" size="large" />
    </div>
  )
}

export const WithLongName: Story = {
  args: {
    initials: 'Jonathan Doe',
    size: 'large'
  }
}
