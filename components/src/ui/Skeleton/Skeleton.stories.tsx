import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton } from './Skeleton'
import './Skeleton.css'

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: ['text', 'rectangular', 'circular'],
      control: { type: 'radio' }
    },
    width: { control: 'text' },
    height: { control: 'text' }
  }
}

export default meta
type Story = StoryObj<typeof Skeleton>

export const TextSkeleton: Story = {
  args: {
    variant: 'text',
    width: '100%',
    height: 16
  }
}

export const RectangularSkeleton: Story = {
  args: {
    variant: 'rectangular',
    width: '100%',
    height: 200
  }
}

export const CircularSkeleton: Story = {
  args: {
    variant: 'circular',
    width: 48,
    height: 48
  }
}

export const SkeletonGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Skeleton variant="circular" width={48} height={48} />
        <div style={{ flex: 1 }}>
          <Skeleton variant="text" width="100%" height={16} style={{ marginBottom: '8px' }} />
          <Skeleton variant="text" width="80%" height={12} />
        </div>
      </div>
      <Skeleton variant="rectangular" width="100%" height={200} />
      <Skeleton variant="text" width="100%" height={16} style={{ marginBottom: '8px' }} />
      <Skeleton variant="text" width="100%" height={16} style={{ marginBottom: '8px' }} />
      <Skeleton variant="text" width="60%" height={16} />
    </div>
  )
}

export const CardSkeleton: Story = {
  render: () => (
    <div style={{ background: '#fdfcfa', padding: '28px', borderRadius: '2px' }}>
      <Skeleton variant="rectangular" width="100%" height={200} style={{ marginBottom: '16px' }} />
      <Skeleton variant="text" width="100%" height={20} style={{ marginBottom: '12px' }} />
      <Skeleton variant="text" width="100%" height={16} style={{ marginBottom: '8px' }} />
      <Skeleton variant="text" width="70%" height={16} />
    </div>
  )
}
