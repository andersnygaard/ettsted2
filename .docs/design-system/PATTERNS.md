# Design Patterns - Common Layouts

Proven layout patterns and composition strategies for building consistent interfaces with the Nordic Minimal design system.

## Page Layouts

### Standard Page Layout

Most pages follow this structure:

```
┌─────────────────────────────────────┐
│        Navigation Header            │
├─────────────────────────────────────┤
│  PageHeader (title + actions)       │
├─────────────────────────────────────┤
│                                     │
│  Container                          │
│    Main Content                     │
│                                     │
└─────────────────────────────────────┘
```

**Implementation:**

```typescript
import { Container, PageHeader } from '@finans/components'

export function PortfoliioPage() {
  return (
    <>
      <PageHeader
        title="Portefølje"
        subtitle="Monthly snapshots of your investments"
        actions={[
          { label: 'Eksporter', onClick: handleExport },
          { label: 'Legg til', onClick: handleAdd }
        ]}
      />
      <Container maxWidth="wide">
        {/* Content here */}
      </Container>
    </>
  )
}
```

**Best Practices:**
- Use consistent max-widths (wide: 1200px, narrow: 900px, tight: 600px)
- Maintain breathing room with spacing tokens
- Single primary action per page section
- Descriptive page titles and subtitles

---

## Dashboard Grid Pattern

Responsive grid for dashboard stats and cards.

```
Desktop (1200px):
┌────────────┬────────────┬────────────┬────────────┐
│   Stat     │   Stat     │   Stat     │   Stat     │
└────────────┴────────────┴────────────┴────────────┘

Tablet (768px):
┌────────────────────────┬────────────────────────┐
│        Stat            │        Stat            │
├────────────────────────┼────────────────────────┤
│        Stat            │        Stat            │
└────────────────────────┴────────────────────────┘

Mobile (480px):
┌──────────────────────┐
│       Stat           │
├──────────────────────┤
│       Stat           │
├──────────────────────┤
│       Stat           │
├──────────────────────┤
│       Stat           │
└──────────────────────┘
```

**Implementation:**

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-xl);
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
```

**Best Practices:**
- Use CSS Grid for alignment
- Maintain consistent spacing (var(--space-xl))
- Collapse gracefully on smaller screens
- Consider read order on mobile

---

## Card Pattern

Standard container for grouped content.

```typescript
import { Card } from '@finans/components'

<Card>
  <div className="card-header">
    <h3>Title</h3>
    <p className="text-secondary">Subtitle or meta</p>
  </div>

  <div className="card-body">
    {/* Content */}
  </div>

  <div className="card-footer">
    <button>Action</button>
  </div>
</Card>
```

**Card Variants:**

### Simple Card
Just content in a white background with subtle border.

```typescript
<Card>
  <p>Content here</p>
</Card>
```

### Card with Header
Title, subtitle, and optional actions.

```typescript
<Card>
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 'var(--space-md)'
  }}>
    <div>
      <h3>Title</h3>
      <p className="text-secondary">Subtitle</p>
    </div>
    <button>Action</button>
  </div>
  {/* Content */}
</Card>
```

### Card with Footer
Content with footer actions or metadata.

```typescript
<Card>
  {/* Content */}
  <div style={{
    borderTop: `1px solid var(--border)`,
    marginTop: 'var(--space-md)',
    paddingTop: 'var(--space-md)'
  }}>
    <button>Save</button>
    <button>Cancel</button>
  </div>
</Card>
```

**Best Practices:**
- Whitespace inside cards (padding: var(--space-3xl))
- Use --warm-white background
- Subtle border: 0.5px solid #efefef
- Consistent shadow on hover: var(--shadow-md)

---

## Form Pattern

Standard form layout with labels, inputs, and actions.

```typescript
<form className="form">
  <div className="form-group">
    <label htmlFor="name">Navn</label>
    <input id="name" type="text" />
  </div>

  <div className="form-group">
    <label htmlFor="amount">Beløp</label>
    <NumberInput id="amount" value={0} onChange={} />
  </div>

  <div className="form-group">
    <label htmlFor="date">Dato</label>
    <DateInput id="date" value="" onChange={} />
  </div>

  <div className="form-actions">
    <button variant="primary">Lagre</button>
    <button variant="secondary">Avbryt</button>
  </div>
</form>
```

**CSS:**

```css
.form {
  max-width: var(--container-narrow);
}

.form-group {
  margin-bottom: var(--space-lg);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wider);
}

.form-actions {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-2xl);
}
```

**Best Practices:**
- Single column layout (wider fields)
- Clear labels with uppercase styling
- Consistent spacing between fields
- Action buttons at bottom
- Use form components (NumberInput, DateInput, ProgressBar)
- Group related fields with visual separation

---

## Data Display Pattern

Display tabular or list data with hierarchy.

### Stats Row

Horizontal stats for dashboard sections:

```typescript
import { StatsRow } from '@finans/components'

<StatsRow stats={[
  { label: 'Sparing', value: 1000000, change: +2.5 },
  { label: 'Gjeld', value: 500000, change: -1.2 }
]} />
```

### Spreadsheet Table

Complex editable table for portfolio snapshots:

```typescript
import { SpreadsheetTable } from '@finans/components'

<SpreadsheetTable
  columns={columns}
  columnGroups={columnGroups}
  data={data}
  onCellChange={handleCellChange}
  onAddRow={handleAddRow}
  onDeleteRow={handleDeleteRow}
/>
```

**Column Group Pattern:**

```typescript
const columnGroups = [
  {
    title: 'Sparing',
    columns: ['aksjer', 'fond', 'bankkonto']
  },
  {
    title: 'Gjeld',
    columns: ['boliglån', 'studielån']
  }
]
```

**Category Color Coding:**
- Sparing: `--category-sparing` (#6a7a60)
- Gjeld: `--category-gjeld` (#8a7060)
- Pensjon: `--category-pensjon` (#5a6d7a)

---

## Chart Pattern

Visualize financial data with D3.js charts.

### Area Chart (Single Series)

```typescript
import { AreaChart } from '@finans/components'

<AreaChart
  data={[
    { date: '01.01.2024', value: 1000000 },
    { date: '01.02.2024', value: 1050000 }
  ]}
  height={300}
  color={--muted-sage}
/>
```

**Best Practices:**
- Single color for single-series charts
- Use palette colors (muted-sage, pale-blue, etc.)
- Responsive height (300-400px typical)
- Clear axes labels with dates in dd.MM.yyyy format

### Stacked Area Chart (Multi-Series)

```typescript
import { StackedAreaChart } from '@finans/components'

<StackedAreaChart
  data={data}
  series={[
    { key: 'aksjer', label: 'Aksjer', color: '--muted-sage' },
    { key: 'fond', label: 'Fond', color: '--pale-blue' },
    { key: 'krypto', label: 'Krypto', color: '--soft-terracotta' }
  ]}
  height={300}
/>
```

**Color Assignment:**
- Use consistent colors per series
- Max 4-5 series for readability
- Use category colors for sparing/gjeld/pensjon breakdowns

### Donut Chart (Composition)

```typescript
import { DonutChart } from '@finans/components'

<DonutChart
  data={[
    { label: 'Aksjer', value: 50, color: '--muted-sage' },
    { label: 'Fond', value: 30, color: '--pale-blue' },
    { label: 'Krypto', value: 20, color: '--soft-terracotta' }
  ]}
  height={300}
/>
```

**Best Practices:**
- Show percentages or values on hover
- Limit to 5-6 slices max
- Order by size (largest first)
- Use palette colors consistently

---

## Navigation Pattern

### Primary Navigation

Typically in header or sidebar. Keep to main sections:

- Oversikt (Dashboard)
- Portefølje (Portfolio)
- Sparing (Savings)
- Gjeld (Debt)
- Pensjon (Pension)
- Kalkulatorer (Calculators)
- Innstillinger (Settings)

### Breadcrumb Navigation

Show hierarchy for deep pages:

```typescript
import { Breadcrumb } from '@finans/components'

<Breadcrumb items={[
  { label: 'Oversikt', href: '/' },
  { label: 'Kalkulatorer', href: '/calculators' },
  { label: 'Rentekalkulator' }
]} />
```

**Best Practices:**
- Current page is not clickable (last item)
- Use > or / separators
- Show 3-4 levels max
- Mobile: show abbreviated paths

---

## Empty State Pattern

When no data is available:

```typescript
import { Placeholder } from '@finans/components'

<Placeholder
  title="Ingen kontoer"
  description="Opprett din første konto for å komme i gang"
  icon={<PlusIcon />}
  action={{ label: 'Opprett konto', onClick: handleCreate }}
/>
```

**Best Practices:**
- Friendly, helpful message
- Suggest next action
- Include optional icon or illustration
- Action button to resolve empty state

---

## Loading Pattern

While data is fetching:

```typescript
import { Skeleton } from '@finans/components'

<div className="dashboard-grid">
  <Skeleton height={120} />
  <Skeleton height={120} />
  <Skeleton height={120} />
  <Skeleton height={120} />
</div>
```

**Best Practices:**
- Match shape of loaded content
- Stagger animations for visual interest
- Show skeletons instead of spinners
- Faster perceived load time

---

## Spacing Rules

Follow these spacing rules consistently:

```
Page Padding:      var(--space-4xl) (48px)
Section Gap:       var(--space-5xl) (64px)
Component Gap:     var(--space-lg) (20px)
Element Spacing:   var(--space-md) (16px)
Tight Spacing:     var(--space-xs) (8px)
```

**Example:**

```css
.page {
  padding: var(--space-4xl);
}

.section {
  margin-bottom: var(--space-5xl);
}

.section-title {
  margin-bottom: var(--space-2xl);
}

.component {
  margin-right: var(--space-lg);
}
```

---

## Color Application Patterns

### Semantic Color Usage

```
Positive Values:     var(--muted-sage)      // Savings, gains
Negative Values:     var(--negative)        // Debt, losses
Milestones:          var(--gold)            // Achievements
Focus/Active:        var(--muted-sage)      // Interactive states
Text:                var(--charcoal)        // Primary text
Secondary Text:      var(--text-secondary)  // Labels, captions
Borders:             var(--border)          // Dividers
```

### Category Color Patterns

For SpreadsheetTable and category displays:

```
Sparing:     var(--category-sparing)      // #6a7a60
Gjeld:       var(--category-gjeld)        // #8a7060
Pensjon:     var(--category-pensjon)      // #5a6d7a
```

---

*Last updated: December 2024*
