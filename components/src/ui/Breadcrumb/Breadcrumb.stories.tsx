import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from './Breadcrumb'
import './Breadcrumb.css'

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' }
  }
}

export default meta
type Story = StoryObj<typeof Breadcrumb>

export const Default: Story = {
  args: {
    items: [
      { label: 'Oversikt', path: '/' },
      { label: 'Portefølje', path: '/portfolio' },
      { label: 'Sparing' }
    ]
  }
}

export const ShortBreadcrumb: Story = {
  args: {
    items: [
      { label: 'Oversikt', path: '/' },
      { label: 'Kalkulatorer' }
    ]
  }
}

export const LongBreadcrumb: Story = {
  args: {
    items: [
      { label: 'Oversikt', path: '/' },
      { label: 'Portefølje', path: '/portfolio' },
      { label: 'Sparing', path: '/sparing' },
      { label: 'Gjeld', path: '/gjeld' },
      { label: 'Pensjon' }
    ]
  }
}

export const WithCallbacks: Story = {
  args: {
    items: [
      {
        label: 'Oversikt',
        onClick: () => alert('Navigated to Oversikt')
      },
      {
        label: 'Portefølje',
        onClick: () => alert('Navigated to Portefølje')
      },
      {
        label: 'Current Page'
      }
    ]
  }
}
