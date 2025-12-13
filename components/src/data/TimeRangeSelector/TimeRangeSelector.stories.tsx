import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import { useState } from 'react'
import { TimeRangeSelector, type TimeRange } from './TimeRangeSelector'
import './TimeRangeSelector.css'

const meta: Meta<typeof TimeRangeSelector> = {
  title: 'Data/TimeRangeSelector',
  component: TimeRangeSelector,
  tags: ['autodocs'],
  argTypes: {
    selected: {
      options: ['ytd', '1yr', '3yr', '5yr', 'all'],
      control: { type: 'radio' }
    },
    dataMonthsCount: { control: 'number' }
  }
}

export default meta
type Story = StoryObj<typeof TimeRangeSelector>

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('all')
    return (
      <TimeRangeSelector
        selected={selected}
        onChange={setSelected}
        dataMonthsCount={60}
      />
    )
  }
}

export const DefaultInteractive: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('all')
    return (
      <TimeRangeSelector
        selected={selected}
        onChange={setSelected}
        dataMonthsCount={60}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttons = canvas.getAllByRole('button')
    if (buttons.length > 0) {
      await userEvent.click(buttons[0])
    }
  },
  parameters: {
    docs: { description: { story: 'All options available with 60+ months of data' } }
  }
}

export const YTDSelected: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('ytd')
    return (
      <TimeRangeSelector
        selected={selected}
        onChange={setSelected}
        dataMonthsCount={60}
      />
    )
  },
  parameters: {
    docs: { description: { story: 'Year-to-date selected with full data available' } }
  }
}

export const OneYearSelected: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('1yr')
    return (
      <TimeRangeSelector
        selected={selected}
        onChange={setSelected}
        dataMonthsCount={60}
      />
    )
  },
  parameters: {
    docs: { description: { story: '1 year option selected' } }
  }
}

export const ThreeYearSelected: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('3yr')
    return (
      <TimeRangeSelector
        selected={selected}
        onChange={setSelected}
        dataMonthsCount={60}
      />
    )
  },
  parameters: {
    docs: { description: { story: '3 year option selected' } }
  }
}

export const FiveYearSelected: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('5yr')
    return (
      <TimeRangeSelector
        selected={selected}
        onChange={setSelected}
        dataMonthsCount={60}
      />
    )
  },
  parameters: {
    docs: { description: { story: '5 year option selected' } }
  }
}

export const AllSelected: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('all')
    return (
      <TimeRangeSelector
        selected={selected}
        onChange={setSelected}
        dataMonthsCount={60}
      />
    )
  },
  parameters: {
    docs: { description: { story: 'All data option selected' } }
  }
}

export const LimitedData6Months: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('all')
    return (
      <>
        <TimeRangeSelector
          selected={selected}
          onChange={setSelected}
          dataMonthsCount={6}
        />
        <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          6 months of data available. Only YTD and Alle options show.
        </p>
      </>
    )
  },
  parameters: {
    docs: { description: { story: 'Limited data (6 months) - only YTD and All options available' } }
  }
}

export const LimitedData12Months: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('all')
    return (
      <>
        <TimeRangeSelector
          selected={selected}
          onChange={setSelected}
          dataMonthsCount={12}
        />
        <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          12 months of data available. YTD, 1 år, and Alle options show.
        </p>
      </>
    )
  },
  parameters: {
    docs: { description: { story: 'Limited data (12 months) - YTD, 1 year, and All options available' } }
  }
}

export const LimitedData24Months: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('all')
    return (
      <>
        <TimeRangeSelector
          selected={selected}
          onChange={setSelected}
          dataMonthsCount={24}
        />
        <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          24 months of data available. All except 5 år option shows.
        </p>
      </>
    )
  },
  parameters: {
    docs: { description: { story: 'Limited data (24 months) - all except 5 year option available' } }
  }
}

export const LimitedData36Months: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('all')
    return (
      <>
        <TimeRangeSelector
          selected={selected}
          onChange={setSelected}
          dataMonthsCount={36}
        />
        <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          36 months of data available. All except 5 år option shows.
        </p>
      </>
    )
  },
  parameters: {
    docs: { description: { story: 'Limited data (36 months) - all except 5 year option available' } }
  }
}

export const FullData60Months: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('all')
    return (
      <>
        <TimeRangeSelector
          selected={selected}
          onChange={setSelected}
          dataMonthsCount={60}
        />
        <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          60 months of data available. All options (YTD, 1 år, 3 år, 5 år, Alle) show.
        </p>
      </>
    )
  },
  parameters: {
    docs: { description: { story: 'Full data (60+ months) - all time range options available' } }
  }
}

export const MinimalData1Month: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('all')
    return (
      <>
        <TimeRangeSelector
          selected={selected}
          onChange={setSelected}
          dataMonthsCount={1}
        />
        <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Only 1 month of data. Only Alle option shows.
        </p>
      </>
    )
  },
  parameters: {
    docs: { description: { story: 'Minimal data (1 month) - only All option available' } }
  }
}

export const Accessibility: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('all')
    return (
      <>
        <TimeRangeSelector
          selected={selected}
          onChange={setSelected}
          dataMonthsCount={60}
        />
        <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <p>Accessibility features:</p>
          <ul>
            <li>Role: group with aria-label</li>
            <li>Buttons use aria-pressed to indicate selection state</li>
            <li>Keyboard accessible: Tab to focus, Space/Enter to activate</li>
            <li>Touch-friendly: 44px+ minimum touch target height</li>
          </ul>
        </div>
      </>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'TimeRangeSelector implements WCAG 2.1 accessibility standards with proper ARIA labels, keyboard navigation, and adequate touch target sizes'
      }
    }
  }
}

export const WithCallback: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('all')
    const [lastSelected, setLastSelected] = useState<TimeRange | null>(null)

    const handleChange = (range: TimeRange) => {
      setSelected(range)
      setLastSelected(range)
    }

    return (
      <>
        <TimeRangeSelector
          selected={selected}
          onChange={handleChange}
          dataMonthsCount={60}
        />
        {lastSelected && (
          <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Last selected: {lastSelected}
          </p>
        )}
      </>
    )
  },
  parameters: {
    docs: { description: { story: 'TimeRangeSelector onChange callback demonstrates selection tracking' } }
  }
}

export const InteractiveDemo: Story = {
  render: () => {
    const [selected, setSelected] = useState<TimeRange>('1yr')
    const [dataMonths, setDataMonths] = useState(36)

    return (
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            Data months: {dataMonths}
          </label>
          <input
            type="range"
            min="1"
            max="120"
            value={dataMonths}
            onChange={(e) => setDataMonths(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <TimeRangeSelector
          selected={selected}
          onChange={setSelected}
          dataMonthsCount={dataMonths}
        />
        <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          Selected: {selected} | Available options update based on data months
        </p>
      </div>
    )
  },
  parameters: {
    docs: { description: { story: 'Interactive demo showing how available options change with data availability' } }
  }
}
