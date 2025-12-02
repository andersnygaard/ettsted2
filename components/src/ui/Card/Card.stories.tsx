import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'
import './Card.css'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    hoverable: { control: 'boolean' },
    onClick: { action: 'clicked' }
  }
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  args: {
    children: 'This is a card with some content inside.'
  }
}

export const Hoverable: Story = {
  args: {
    children: 'This is a hoverable card. Try hovering over it!',
    hoverable: true
  }
}

export const WithContent: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ margin: '0 0 8px 0' }}>Card Title</h3>
        <p style={{ margin: 0 }}>This card contains multiple elements like headings and paragraphs.</p>
      </div>
    )
  }
}

export const Clickable: Story = {
  args: {
    children: 'Click this card to trigger an action',
    hoverable: true,
    onClick: () => alert('Card clicked!')
  }
}
