import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './Container'
import './Container.css'

const meta: Meta<typeof Container> = {
  title: 'UI/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    width: {
      options: ['default', 'narrow', 'wide'],
      control: { type: 'radio' }
    }
  }
}

export default meta
type Story = StoryObj<typeof Container>

export const Default: Story = {
  args: {
    width: 'default',
    children: (
      <div style={{ background: '#f0f0f0', padding: '20px', textAlign: 'center' }}>
        <p>Default width: 1200px (dashboard, overview pages)</p>
      </div>
    )
  }
}

export const Narrow: Story = {
  args: {
    width: 'narrow',
    children: (
      <div style={{ background: '#f0f0f0', padding: '20px', textAlign: 'center' }}>
        <p>Narrow width: 900px (calculators, focused pages)</p>
      </div>
    )
  }
}

export const Wide: Story = {
  args: {
    width: 'wide',
    children: (
      <div style={{ background: '#f0f0f0', padding: '20px', textAlign: 'center' }}>
        <p>Wide width: 1800px (portfolio table)</p>
      </div>
    )
  }
}
