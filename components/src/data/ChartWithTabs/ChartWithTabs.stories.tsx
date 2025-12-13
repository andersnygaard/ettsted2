import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import { ChartWithTabs, type ChartAccount } from './ChartWithTabs'
import './ChartWithTabs.css'

const meta: Meta<typeof ChartWithTabs> = {
  title: 'Data/ChartWithTabs',
  component: ChartWithTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  },
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    height: { control: 'number' },
    totalColor: { control: 'color' },
    totalStacked: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof ChartWithTabs>

// Helper function to generate mock data
const generateStackedData = (months: number, accounts: ChartAccount[]) => {
  const data: Array<{ date: Date; [key: string]: number | Date }> = []
  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const point: { date: Date; [key: string]: number | Date } = { date }

    // Generate values for each account
    accounts.forEach((account, index) => {
      const baseValue = (index + 1) * 100000
      const trend = (months - i) * 5000
      const variance = Math.random() * 20000 - 10000
      point[account.id] = Math.max(0, baseValue + trend + variance)
    })

    data.push(point)
  }

  return data
}

// Sample accounts for stories
const savingsAccounts: ChartAccount[] = [
  { id: 'aksjer', name: 'Aksjer' },
  { id: 'fond', name: 'Fond' },
  { id: 'bank', name: 'Bankkonto' }
]

const debtAccounts: ChartAccount[] = [
  { id: 'boliglan', name: 'Boliglån' },
  { id: 'studielan', name: 'Studielån' }
]

const pensionAccounts: ChartAccount[] = [
  { id: 'otp', name: 'Arbeidsgiver (OTP)' },
  { id: 'nav', name: 'Folketrygden (NAV)' },
  { id: 'ips', name: 'IPS' }
]

export const Default: Story = {
  render: () => (
    <ChartWithTabs
      data={generateStackedData(12, savingsAccounts)}
      accounts={savingsAccounts}
      title="Spareutvikling"
      subtitle="12 måneder"
      height={250}
    />
  )
}

export const DefaultInteractive: Story = {
  render: () => (
    <ChartWithTabs
      data={generateStackedData(12, savingsAccounts)}
      accounts={savingsAccounts}
      title="Spareutvikling"
      subtitle="12 måneder"
      height={250}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tabs = canvas.getAllByRole('tab')
    if (tabs.length > 1) {
      await userEvent.click(tabs[1])
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  },
  parameters: {
    docs: { description: { story: 'Click second tab to view per-account breakdown' } }
  }
}

export const SavingsView: Story = {
  render: () => (
    <ChartWithTabs
      data={generateStackedData(24, savingsAccounts)}
      accounts={savingsAccounts}
      title="Spareutvikling"
      subtitle="24 måneder"
      height={280}
      totalColor="var(--muted-sage)"
    />
  ),
  parameters: {
    docs: { description: { story: 'Savings tracking with accounts: Aksjer, Fond, Bankkonto' } }
  }
}

export const DebtView: Story = {
  render: () => (
    <ChartWithTabs
      data={generateStackedData(12, debtAccounts)}
      accounts={debtAccounts}
      title="Gjeldsoversikt"
      height={250}
      totalColor="var(--negative)"
    />
  ),
  parameters: {
    docs: { description: { story: 'Debt tracking with accounts: Boliglån, Studielån' } }
  }
}

export const PensionView: Story = {
  render: () => (
    <ChartWithTabs
      data={generateStackedData(12, pensionAccounts)}
      accounts={pensionAccounts}
      title="Pensjonsutvikling"
      height={250}
      totalColor="var(--pale-blue)"
    />
  ),
  parameters: {
    docs: { description: { story: 'Pension tracking with accounts: OTP, NAV, IPS' } }
  }
}

export const CustomColors: Story = {
  render: () => (
    <ChartWithTabs
      data={generateStackedData(12, savingsAccounts)}
      accounts={savingsAccounts}
      title="Spareutvikling"
      subtitle="Egendefinerte farger"
      height={250}
      totalColor="var(--gold)"
      accountColors={{
        aksjer: 'var(--muted-sage)',
        fond: 'var(--soft-terracotta)',
        bank: 'var(--pale-blue)'
      }}
    />
  ),
  parameters: {
    docs: { description: { story: 'Chart with custom color palette for accounts' } }
  }
}

export const LimitedData6Months: Story = {
  render: () => (
    <ChartWithTabs
      data={generateStackedData(6, savingsAccounts)}
      accounts={savingsAccounts}
      title="Spareutvikling"
      subtitle="6 måneder"
      height={250}
    />
  ),
  parameters: {
    docs: { description: { story: 'Limited data (6 months) - only YTD and All time range options available' } }
  }
}

export const FullData5Years: Story = {
  render: () => (
    <ChartWithTabs
      data={generateStackedData(60, savingsAccounts)}
      accounts={savingsAccounts}
      title="Spareutvikling"
      subtitle="5 år"
      height={280}
    />
  ),
  parameters: {
    docs: { description: { story: 'Full data (5 years) - all time range options available' } }
  }
}

export const MinimalData1Month: Story = {
  render: () => (
    <ChartWithTabs
      data={generateStackedData(1, savingsAccounts)}
      accounts={savingsAccounts}
      title="Spareutvikling"
      subtitle="1 måned"
      height={250}
    />
  ),
  parameters: {
    docs: { description: { story: 'Minimal data (1 month) - only All time range option available' } }
  }
}

export const EmptyData: Story = {
  render: () => (
    <ChartWithTabs
      data={[]}
      accounts={savingsAccounts}
      title="Spareutvikling"
      height={250}
    />
  ),
  parameters: {
    docs: { description: { story: 'Empty state when no data is available' } }
  }
}

export const SingleAccount: Story = {
  render: () => (
    <ChartWithTabs
      data={generateStackedData(12, [savingsAccounts[0]])}
      accounts={[savingsAccounts[0]]}
      title="Aksjebeholdning"
      height={250}
    />
  ),
  parameters: {
    docs: { description: { story: 'Chart with single account' } }
  }
}

export const ManyAccounts: Story = {
  render: () => {
    const manyAccounts: ChartAccount[] = [
      { id: 'aksjer', name: 'Aksjer' },
      { id: 'fond', name: 'Fond' },
      { id: 'krypto', name: 'Krypto' },
      { id: 'bank', name: 'Bankkonto' },
      { id: 'eiendom', name: 'Eiendom' }
    ]
    return (
      <ChartWithTabs
        data={generateStackedData(12, manyAccounts)}
        accounts={manyAccounts}
        title="Diverse portefølje"
        height={280}
      />
    )
  },
  parameters: {
    docs: { description: { story: 'Chart with many accounts for complex portfolios' } }
  }
}

export const TabNavigation: Story = {
  render: () => (
    <ChartWithTabs
      data={generateStackedData(12, savingsAccounts)}
      accounts={savingsAccounts}
      title="Spareutvikling"
      subtitle="12 måneder"
      height={250}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const tabs = canvas.getAllByRole('tab')

    // Click on "Per konto" tab
    if (tabs.length > 1) {
      await userEvent.click(tabs[1])
      await new Promise(resolve => setTimeout(resolve, 500))

      // Click back on "Totalt" tab
      await userEvent.click(tabs[0])
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  },
  parameters: {
    docs: { description: { story: 'Tab switching interaction between Totalt and Per konto views' } }
  }
}

export const ResponsiveHeight: Story = {
  render: () => (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '16px' }}>Small height (150px)</h3>
        <ChartWithTabs
          data={generateStackedData(12, savingsAccounts)}
          accounts={savingsAccounts}
          title="Spareutvikling"
          height={150}
        />
      </div>
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '16px' }}>Medium height (250px)</h3>
        <ChartWithTabs
          data={generateStackedData(12, savingsAccounts)}
          accounts={savingsAccounts}
          title="Spareutvikling"
          height={250}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '16px' }}>Large height (350px)</h3>
        <ChartWithTabs
          data={generateStackedData(12, savingsAccounts)}
          accounts={savingsAccounts}
          title="Spareutvikling"
          height={350}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Chart at different heights for responsive layouts' } }
  }
}

export const TimeRangeFiltering: Story = {
  render: () => (
    <ChartWithTabs
      data={generateStackedData(60, savingsAccounts)}
      accounts={savingsAccounts}
      title="Spareutvikling"
      subtitle="Med tidsfiltrering"
      height={280}
    />
  ),
  play: async () => {
    // Wait for chart to render
    await new Promise(resolve => setTimeout(resolve, 500))
  },
  parameters: {
    docs: { description: { story: 'TimeRangeSelector allows filtering data by YTD, 1 år, 3 år, 5 år, or Alle' } }
  }
}

export const Accessibility: Story = {
  render: () => (
    <ChartWithTabs
      data={generateStackedData(12, savingsAccounts)}
      accounts={savingsAccounts}
      title="Spareutvikling"
      height={250}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accessibility features: ARIA labels on tabs, semantic HTML structure, keyboard navigation support (Tab to focus tabs, Space/Enter to activate). Charts are interactive with hover tooltips.'
      }
    }
  }
}

export const WithoutSubtitle: Story = {
  render: () => (
    <ChartWithTabs
      data={generateStackedData(12, savingsAccounts)}
      accounts={savingsAccounts}
      title="Spareutvikling"
      height={250}
    />
  ),
  parameters: {
    docs: { description: { story: 'Chart without subtitle for cleaner layout' } }
  }
}

export const DataVariations: Story = {
  render: () => (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '16px' }}>Upward trend</h3>
        <ChartWithTabs
          data={generateStackedData(12, savingsAccounts).map((d, i) => ({
            ...d,
            aksjer: (i + 1) * 50000,
            fond: (i + 1) * 40000,
            bank: (i + 1) * 30000
          }))}
          accounts={savingsAccounts}
          title="Vekst"
          height={200}
        />
      </div>
      <div>
        <h3 style={{ marginBottom: '16px' }}>Volatile values</h3>
        <ChartWithTabs
          data={generateStackedData(12, savingsAccounts)}
          accounts={savingsAccounts}
          title="Volatilt marked"
          height={200}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Chart behavior with different data trends and volatility' } }
  }
}
