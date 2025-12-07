# SpreadsheetTable Component

A complex spreadsheet-style table component for displaying portfolio data with collapsible column groups, sticky positioning, and milestone highlighting.

## Features

- **Collapsible Column Groups**: Click group headers to collapse/expand groups
- **Sticky Positioning**: Date column and headers remain visible during scrolling
- **Color-Coded Groups**: Visual distinction between Sparing, Gjeld, and Pensjon
- **Milestone Highlighting**: Gold stars (★) for threshold crossings (10k, 100k, 1M, etc.)
- **Norwegian Formatting**: Space as thousands separator
- **Row Hover Effects**: Visual feedback on row hover
- **Responsive**: Horizontal scrolling for wide tables

## Props

```typescript
interface SpreadsheetTableProps {
  columnGroups: ColumnGroup[];
  data: Record<string, any>[];
  dateKey: string;
  milestones?: Record<string, number[]>;
}

interface ColumnGroup {
  id: string;              // Unique identifier (e.g., 'sparing', 'gjeld')
  label: string;           // Display name (e.g., 'Sparing')
  color: string;           // CSS color for group header (e.g., '#5a6d7a')
  columns: Column[];       // Columns in this group
}

interface Column {
  id: string;              // Unique identifier (matches data key)
  label: string;           // Display name (e.g., 'Nordnet ASK')
  isTotal?: boolean;       // Whether this is a total/sum column
}
```

## Usage Example

```tsx
import { SpreadsheetTable } from '@/shared/components';

function PortfolioPage() {
  // Define column groups
  const columnGroups = [
    {
      id: 'sparing',
      label: 'Sparing',
      color: '#5a6d7a',
      columns: [
        { id: 'nordnetAsk', label: 'Nordnet ASK' },
        { id: 'bouvetAsk', label: 'Bouvet ASK' },
        { id: 'yolo', label: 'Yolo' },
        { id: 'firi', label: 'Firi' },
        { id: 'kron', label: 'Kron' },
        { id: 'skattKjop', label: 'Skatt/Kjøp' },
        { id: 'sumSavings', label: 'Sum sparing', isTotal: true },
      ],
    },
    {
      id: 'gjeld',
      label: 'Gjeld',
      color: '#8a7060',
      columns: [
        { id: 'sbanken', label: 'SBanken' },
        { id: 'sumGjeld', label: 'Sum gjeld', isTotal: true },
      ],
    },
    {
      id: 'pensjon',
      label: 'Pensjon',
      color: '#6a7a60',
      columns: [
        { id: 'arbeidsgiver', label: 'Arbeidsgiver' },
        { id: 'sumPensjon', label: 'Sum pensjon', isTotal: true },
      ],
    },
  ];

  // Sample data
  const data = [
    {
      date: '01.03.2025',
      nordnetAsk: 218037,
      bouvetAsk: 144566,
      yolo: 86890,
      firi: 2634,
      kron: 344371,
      skattKjop: null,
      sumSavings: 796498,
      sbanken: 798450,
      sumGjeld: 798450,
      arbeidsgiver: 2850000,
      sumPensjon: 3920000,
    },
    {
      date: '01.02.2025',
      nordnetAsk: 214137,
      bouvetAsk: 164404,
      yolo: 81225,
      firi: 2077,
      kron: 351156,
      skattKjop: null,
      sumSavings: 812999,
      sbanken: 805200,
      sumGjeld: 805200,
      arbeidsgiver: 2820000,
      sumPensjon: 3890000,
    },
    // ... more rows
  ];

  // Define milestones (values that crossed thresholds)
  const milestones = {
    yolo: [80000], // Crossed 80k threshold
    sumSavings: [800000], // Crossed 800k threshold
  };

  return (
    <div className="table-container">
      <SpreadsheetTable
        columnGroups={columnGroups}
        data={data}
        dateKey="date"
        milestones={milestones}
      />
    </div>
  );
}
```

## Milestone Detection Logic

Milestones are detected when a value crosses a threshold for the first time. Common thresholds:

- **10k increments**: 10,000 → 20,000 → ... → 90,000
- **100k increments**: 100,000 → 200,000 → ... → 900,000
- **1M increments**: 1,000,000 → 2,000,000 → ...

Example milestone detection function:

```typescript
function detectMilestone(currentValue: number, previousValue: number): number | null {
  const thresholds = [
    // 10k increments up to 100k
    10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000,
    // 100k increments up to 1M
    100000, 200000, 300000, 400000, 500000, 600000, 700000, 800000, 900000,
    // 1M increments
    1000000, 2000000, 3000000, 4000000, 5000000,
  ];

  for (const threshold of thresholds) {
    if (previousValue < threshold && currentValue >= threshold) {
      return threshold; // First crossing of this threshold
    }
  }

  return null;
}
```

## Styling Notes

### Column Group Colors

The component supports three predefined group colors:
- **Sparing** (blue-gray): `#5a6d7a`
- **Gjeld** (brown): `#8a7060`
- **Pensjon** (green): `#6a7a60`

You can customize group colors by passing a different `color` value in the `ColumnGroup` configuration.

### CSS Variables Used

The component uses the following CSS variables from the design system:

```css
--bone          /* Background color */
--warm-white    /* Card/cell background */
--charcoal      /* Primary text */
--text-secondary /* Muted text */
--border        /* Light borders */
--border-strong /* Strong borders */
--gold          /* Milestone highlighting */
```

Ensure these are defined in your root CSS or design tokens file.

## Behavior

### Collapsing Groups

- Click any group header to toggle collapse/expand
- When collapsed, only the total column is visible
- The arrow indicator (▼) rotates 90° when collapsed
- Multiple groups can be collapsed independently

### Sticky Positioning

- **Header rows**: Both group and column headers stick to the top
- **Date column**: First column sticks to the left
- **Z-index layering**: Headers have higher z-index than data cells

### Number Formatting

- Uses Norwegian number formatting (space as thousands separator)
- No decimal places for portfolio values (values rounded to whole numbers)
- Null/undefined/empty values display as "-"

## Accessibility

- Semantic HTML table structure
- Keyboard accessible (tab navigation)
- Screen reader friendly with proper headers and scope

## Performance Considerations

- Uses CSS `position: sticky` for better performance than JavaScript scrolling
- Minimal re-renders with React state for collapsed groups only
- Large datasets should be paginated (component does not include pagination)

## Browser Support

- Modern browsers with CSS `position: sticky` support
- Fallback: Headers remain static if sticky is not supported
- Tested in Chrome, Firefox, Safari, Edge
