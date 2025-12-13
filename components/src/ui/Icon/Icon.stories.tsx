import type { Meta, StoryObj } from '@storybook/react'
import { Icon } from './Icon'
import './Icon.css'

const meta: Meta<typeof Icon> = {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: {
      options: [
        'dashboard',
        'account-balance',
        'login',
        'trending-up',
        'savings',
        'calculate',
        'elderly',
        'insights',
        'rocket-launch',
        'arrow-back',
        'arrow-forward',
        'check',
        'error',
        'add',
        'delete',
        'close',
        'refresh',
        'trending-up-chart',
        'target',
        'home',
        'dice'
      ],
      control: { type: 'select' }
    },
    size: { control: 'number' },
    className: { control: 'text' }
  }
}

export default meta
type Story = StoryObj<typeof Icon>

export const Dashboard: Story = {
  args: {
    name: 'dashboard',
    size: 24
  }
}

export const AccountBalance: Story = {
  args: {
    name: 'account-balance',
    size: 24
  }
}

export const Login: Story = {
  args: {
    name: 'login',
    size: 24
  }
}

export const TrendingUp: Story = {
  args: {
    name: 'trending-up',
    size: 24
  }
}

export const Savings: Story = {
  args: {
    name: 'savings',
    size: 24
  }
}

export const Calculate: Story = {
  args: {
    name: 'calculate',
    size: 24
  }
}

export const Elderly: Story = {
  args: {
    name: 'elderly',
    size: 24
  }
}

export const Insights: Story = {
  args: {
    name: 'insights',
    size: 24
  }
}

export const RocketLaunch: Story = {
  args: {
    name: 'rocket-launch',
    size: 24
  }
}

export const ArrowBack: Story = {
  args: {
    name: 'arrow-back',
    size: 24
  }
}

export const ArrowForward: Story = {
  args: {
    name: 'arrow-forward',
    size: 24
  }
}

export const Check: Story = {
  args: {
    name: 'check',
    size: 24
  }
}

export const Error: Story = {
  args: {
    name: 'error',
    size: 24
  }
}

export const Add: Story = {
  args: {
    name: 'add',
    size: 24
  }
}

export const Delete: Story = {
  args: {
    name: 'delete',
    size: 24
  }
}

export const Close: Story = {
  args: {
    name: 'close',
    size: 24
  }
}

export const Refresh: Story = {
  args: {
    name: 'refresh',
    size: 24
  }
}

export const TrendingUpChart: Story = {
  args: {
    name: 'trending-up-chart',
    size: 24
  }
}

export const Target: Story = {
  args: {
    name: 'target',
    size: 24
  }
}

export const Home: Story = {
  args: {
    name: 'home',
    size: 24
  }
}

export const Dice: Story = {
  args: {
    name: 'dice',
    size: 24
  }
}

export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '24px', padding: '24px', alignItems: 'center', justifyItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <Icon name="dashboard" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>dashboard</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="account-balance" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>account-balance</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="login" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>login</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="trending-up" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>trending-up</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="savings" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>savings</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="calculate" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>calculate</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="elderly" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>elderly</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="insights" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>insights</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="rocket-launch" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>rocket-launch</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="arrow-back" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>arrow-back</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="arrow-forward" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>arrow-forward</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="check" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>check</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="error" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>error</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="add" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>add</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="delete" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>delete</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="close" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>close</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="refresh" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>refresh</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="trending-up-chart" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>trending-up-chart</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="target" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>target</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="home" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>home</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="dice" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>dice</div>
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Gallery of all 21 icon variants at default size (24px)' } }
  }
}

export const SizeSmall: Story = {
  args: {
    name: 'dashboard',
    size: 16
  },
  parameters: {
    docs: { description: { story: 'Icon at small size (16px) for compact layouts' } }
  }
}

export const SizeMedium: Story = {
  args: {
    name: 'dashboard',
    size: 24
  },
  parameters: {
    docs: { description: { story: 'Icon at medium size (24px) - default' } }
  }
}

export const SizeLarge: Story = {
  args: {
    name: 'dashboard',
    size: 32
  },
  parameters: {
    docs: { description: { story: 'Icon at large size (32px) for prominence' } }
  }
}

export const SizeExtraLarge: Story = {
  args: {
    name: 'dashboard',
    size: 48
  },
  parameters: {
    docs: { description: { story: 'Icon at extra-large size (48px)' } }
  }
}

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center' }}>
        <Icon name="trending-up" size={16} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>16px</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="trending-up" size={24} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>24px</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="trending-up" size={32} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>32px</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Icon name="trending-up" size={48} />
        <div style={{ fontSize: '12px', marginTop: '8px' }}>48px</div>
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Icon in multiple sizes for responsive use' } }
  }
}

export const WithCustomColor: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '24px', padding: '24px' }}>
      <div style={{ color: 'var(--muted-sage)' }}>
        <Icon name="check" size={24} />
      </div>
      <div style={{ color: 'var(--positive)' }}>
        <Icon name="trending-up" size={24} />
      </div>
      <div style={{ color: 'var(--negative)' }}>
        <Icon name="error" size={24} />
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Icons inherit color from parent. Use CSS color property to customize.' } }
  }
}

export const Accessibility: Story = {
  args: {
    name: 'check',
    size: 24,
    'aria-hidden': true
  },
  parameters: {
    docs: {
      description: {
        story: 'Icons are hidden from screen readers by default (aria-hidden=true). Only use aria-hidden=false for decorative icons that convey meaningful information.'
      }
    }
  }
}
