# Component Usage Guide

Complete guide to components available in `@finans/components`. All components are documented in Storybook and follow the Nordic Minimal design system.

## Quick Reference

All components are exported from `components/src/index.ts` and can be imported into the frontend application.

## UI Primitives

### Button

Simple, functional button with primary and secondary variants.

```typescript
import { Button } from '@finans/components'

// Primary action
<Button variant="primary">Lagre</Button>

// Secondary action
<Button variant="secondary">Avbryt</Button>
```

**When to use:**
- Main action on a page (primary)
- Alternative or cancel actions (secondary)
- Single primary action per view

**Variants:** primary, secondary

**Available in Storybook:** `Components/Button`

---

### Card

Elevated container for grouped content.

```typescript
import { Card } from '@finans/components'

<Card>
  <h3>Net Worth</h3>
  <p>1 234 567,89 kr</p>
</Card>
```

**When to use:**
- Group related information
- Create visual hierarchy
- Separate sections on dashboard

**Available in Storybook:** `Components/Card`

---

### Modal

Dialog overlay for focused content and forms.

```typescript
import { Modal } from '@finans/components'

<Modal isOpen={true} onClose={() => {}}>
  <h2>Edit Account</h2>
  {/* Form content */}
</Modal>
```

**When to use:**
- Capture user input (forms, confirmations)
- Present detailed information
- Temporary actions that require focus

**Available in Storybook:** `Components/Modal`

---

### Avatar

User initials in a circular badge.

```typescript
import { Avatar } from '@finans/components'

<Avatar initials="JD" />
```

**When to use:**
- Display user in header or profile
- Show user context in comments/lists

**Available in Storybook:** `Components/Avatar`

---

### Breadcrumb

Navigation path showing current location.

```typescript
import { Breadcrumb } from '@finans/components'

<Breadcrumb items={[
  { label: 'Oversikt', href: '/' },
  { label: 'Portefølje' }
]} />
```

**When to use:**
- Deep navigation hierarchies
- Show user location in app
- Allow backward navigation

**Available in Storybook:** `Components/Breadcrumb`

---

### Skeleton

Loading placeholder that mimics component shape.

```typescript
import { Skeleton } from '@finans/components'

<Skeleton height={48} width={200} />
```

**When to use:**
- Show loading state while data fetches
- Reduce perceived loading time
- Progressive content loading

**Available in Storybook:** `Components/Skeleton`

---

### Placeholder

Empty state component for when no data exists.

```typescript
import { Placeholder } from '@finans/components'

<Placeholder
  title="Ingen kontoer"
  description="Opprett din første konto for å komme i gang"
/>
```

**When to use:**
- No data available yet
- Guides users on next steps
- First-time user experience

**Available in Storybook:** `Components/Placeholder`

---

## Form Components

### NumberInput

Norwegian-formatted number input with thousands separator and comma decimal.

```typescript
import { NumberInput } from '@finans/components'

<NumberInput
  label="Beløp"
  value={100000}
  onChange={(value) => setValue(value)}
  placeholder="0,00"
/>
```

**Features:**
- Automatic formatting (1 234 567,89)
- Arrow key increment/decrement
- Paste support
- Utility functions: `formatNumber()`, `parseNumber()`

**When to use:**
- Currency input fields
- Any numeric input in Norwegian locale

**Available in Storybook:** `Components/NumberInput`

---

### DateInput

Norwegian date picker (dd.MM.yyyy format).

```typescript
import { DateInput } from '@finans/components'

<DateInput
  label="Dato"
  value="01.01.2024"
  onChange={(date) => setDate(date)}
/>
```

**Features:**
- Date picker UI
- dd.MM.yyyy format
- Utility functions: `formatDate()`, `parseNorwegianDate()`, `getFirstDayOfMonth()`

**When to use:**
- Portfolio snapshot dates
- Account creation dates
- Any temporal data entry

**Available in Storybook:** `Components/DateInput`

---

### ProgressBar

Horizontal progress indicator with labels.

```typescript
import { ProgressBar } from '@finans/components'

<ProgressBar
  current={75}
  target={100}
  label="F.I.R.E. Progress"
/>
```

**When to use:**
- Show progress toward goals
- F.I.R.E. calculations
- Milestone achievement

**Available in Storybook:** `Components/ProgressBar`

---

## Data Display Components

### HeroNumber

Large centered value with optional change badge and description.

```typescript
import { HeroNumber } from '@finans/components'

<HeroNumber
  value={2345678.90}
  label="Netto formue"
  change={+5.2}
  description="This month"
/>
```

**When to use:**
- Key metrics on dashboard
- Primary stat display
- Hero value in page section

**Available in Storybook:** `Components/HeroNumber`

---

### StatCard

Clickable stat card with value, label, and optional change.

```typescript
import { StatCard } from '@finans/components'

<StatCard
  label="Sparing"
  value={1000000}
  change={+2.5}
  onClick={() => navigate('/sparing')}
/>
```

**When to use:**
- Dashboard stat grid
- Category summary (Sparing, Gjeld, Pensjon)
- Navigable metrics

**Available in Storybook:** `Components/StatCard`

---

### StatsRow

Horizontal row of 3-4 stat cards for dashboard sections.

```typescript
import { StatsRow } from '@finans/components'

<StatsRow stats={[
  { label: 'Sparing', value: 1000000, change: +2.5 },
  { label: 'Gjeld', value: 500000, change: -1.2 },
  { label: 'Netto', value: 500000, change: +3.7 }
]} />
```

**When to use:**
- Dashboard sections with multiple stats
- Category overviews
- Summary rows

**Available in Storybook:** `Components/StatsRow`

---

### MilestoneCard

Progress card showing achievement toward a goal.

```typescript
import { MilestoneCard } from '@finans/components'

<MilestoneCard
  title="F.I.R.E. Number"
  current={1500000}
  target={2500000}
  percentage={60}
/>
```

**When to use:**
- F.I.R.E. progress tracking
- Goal visualization
- Milestone celebrations

**Available in Storybook:** `Components/MilestoneCard`

---

### SpreadsheetTable

Complex data table with collapsible column groups and editable cells.

```typescript
import { SpreadsheetTable } from '@finans/components'

<SpreadsheetTable
  columns={columns}
  columnGroups={columnGroups}
  data={data}
  onCellChange={(rowIndex, column, value) => {}}
  onAddRow={() => {}}
  onDeleteRow={(rowIndex) => {}}
/>
```

**Features:**
- Collapsible column groups
- Editable cells
- Row add/delete
- Category color coding (sparing, gjeld, pensjon)

**When to use:**
- Portfolio monthly snapshots (Portefølje page)
- Complex data entry and viewing
- Historical data with editing

**Available in Storybook:** `Components/SpreadsheetTable`

---

### TableHeader

Header row for data tables with sorting and filtering.

```typescript
import { TableHeader } from '@finans/components'

<TableHeader
  columns={columns}
  onSort={(column) => {}}
/>
```

**When to use:**
- Table headers with sorting
- Column filtering
- Data table controls

**Available in Storybook:** `Components/TableHeader`

---

### TableFooter

Footer row for data tables with column visibility toggles.

```typescript
import { TableFooter } from '@finans/components'

<TableFooter
  columnToggles={toggles}
  onToggle={(column) => {}}
/>
```

**When to use:**
- Column visibility controls
- Summary rows
- Table footer information

**Available in Storybook:** `Components/TableFooter`

---

## Chart Components

### AreaChart

Single-series area chart for showing trends.

```typescript
import { AreaChart } from '@finans/components'

<AreaChart
  data={[
    { date: '01.01.2024', value: 1000000 },
    { date: '01.02.2024', value: 1050000 }
  ]}
  height={300}
/>
```

**When to use:**
- Single asset class trends
- Net worth over time
- Savings progression

**Available in Storybook:** `Components/AreaChart`

---

### StackedAreaChart

Multi-series stacked area chart showing composition.

```typescript
import { StackedAreaChart } from '@finans/components'

<StackedAreaChart
  data={data}
  series={[
    { key: 'aksjer', label: 'Aksjer' },
    { key: 'fond', label: 'Fond' }
  ]}
  height={300}
/>
```

**When to use:**
- Portfolio composition over time
- Category breakdown (sparing, gjeld, pensjon)
- Multi-series trends

**Available in Storybook:** `Components/StackedAreaChart`

---

### DonutChart

Ring/donut chart showing percentages.

```typescript
import { DonutChart } from '@finans/components'

<DonutChart
  data={[
    { label: 'Aksjer', value: 50 },
    { label: 'Fond', value: 30 },
    { label: 'Krypto', value: 20 }
  ]}
  height={300}
/>
```

**When to use:**
- Asset allocation breakdown
- Category composition
- Percentage distribution

**Available in Storybook:** `Components/DonutChart`

---

## Layout Components

### Container

Max-width wrapper with responsive padding.

```typescript
import { Container } from '@finans/components'

<Container maxWidth="wide">
  {/* Page content */}
</Container>
```

**Props:**
- `maxWidth`: "wide" (1200px), "narrow" (900px), "tight" (600px)

**When to use:**
- Page wrappers
- Content max-width control
- Responsive padding

**Available in Storybook:** `Components/Container`

---

### PageHeader

Title, subtitle, and optional action buttons.

```typescript
import { PageHeader } from '@finans/components'

<PageHeader
  title="Portefølje"
  subtitle="Monthly snapshots of your investments"
  actions={[
    { label: 'Eksporter', onClick: () => {} },
    { label: 'Legg til', onClick: () => {} }
  ]}
/>
```

**When to use:**
- Page titles
- Section headers with actions
- Navigation context

**Available in Storybook:** `Components/PageHeader`

---

### SectionLink

Navigation card with arrow linking to a section.

```typescript
import { SectionLink } from '@finans/components'

<SectionLink
  title="Sparing"
  description="View your savings progress"
  href="/sparing"
/>
```

**When to use:**
- Dashboard navigation cards
- Section discovery
- Feature highlights

**Available in Storybook:** `Components/SectionLink`

---

### CalculatorCard

Specialized card for calculator tools.

```typescript
import { CalculatorCard } from '@finans/components'

<CalculatorCard
  title="Compound Interest"
  description="Calculate investment growth"
  icon="chart"
/>
```

**When to use:**
- Kalkulatorer page
- Calculator tool discovery
- Financial tool promotion

**Available in Storybook:** `Components/CalculatorCard`

---

## System Components

### ToastProvider & useToast

Toast notification system for user feedback.

```typescript
import { ToastProvider, useToast } from '@finans/components'

function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  )
}

function MyComponent() {
  const { toast } = useToast()

  const handleSave = () => {
    toast('Lagret!', 'success')
  }
}
```

**Types:** 'success', 'error', 'info', 'warning'

**When to use:**
- User action confirmation
- Error messages
- Status updates

**Available in Storybook:** `Components/Toast`

---

### ErrorBoundary

React error boundary for error recovery.

```typescript
import { ErrorBoundary } from '@finans/components'

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

**When to use:**
- Wrap feature sections
- Prevent full app crashes
- Show error fallback UI

**Available in Storybook:** `Components/ErrorBoundary`

---

## Utilities

### Number Formatting

```typescript
import { formatNumber, parseNumber, formatCurrency, formatPercentage } from '@finans/components'

formatNumber(1234567.89)      // "1 234 567,89"
formatCurrency(1234567.89)    // "1 234 567,89 kr"
formatPercentage(2.33)        // "+2,33%"
parseNumber("1 234 567,89")   // 1234567.89
```

### Date Formatting

```typescript
import { formatDate, parseNorwegianDate, getFirstDayOfMonth } from '@finans/components'

formatDate(new Date(2024, 0, 1))   // "01.01.2024"
parseNorwegianDate("01.01.2024")   // Date object
getFirstDayOfMonth(2024, 0)        // "01.01.2024"
```

---

## Accessing Storybook

View all components and their stories:

```bash
pnpm --filter components storybook
```

Stories are organized by category:
- `Components/` - Individual component stories
- `DesignSystem/` - Design foundations
- `Demo/` - Layout and composition examples

---

*Last updated: December 2024*
