# FEATURE: Table Header Controls Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: component, table, portfolio
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

The portfolio table has a header bar with title, year filter dropdown, and search input.

## Reference

Design file: `.docs/design-drafts/draft-1-portfolio.html` (lines 176-203, 447-458)

## Desired Outcome

Table header with title and filter controls.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/TableHeader.tsx`
- [ ] Props: `title`, `yearFilter`, `onYearChange`, `searchValue`, `onSearchChange`
- [ ] Title in Cormorant Garamond
- [ ] Year filter dropdown (Alle år, 2025, 2024, etc.)
- [ ] Search input with placeholder
- [ ] Flex layout with space-between

## Technical Approach

```tsx
// TableHeader.tsx
interface TableHeaderProps {
  title: string;
  years?: number[];
  selectedYear?: number | null;
  onYearChange?: (year: number | null) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function TableHeader({
  title,
  years = [],
  selectedYear,
  onYearChange,
  searchValue,
  onSearchChange
}: TableHeaderProps) {
  return (
    <div className="table-header">
      <div className="table-title">{title}</div>
      <div className="table-controls">
        {years.length > 0 && (
          <select
            className="filter-select"
            value={selectedYear ?? ''}
            onChange={e => onYearChange?.(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Alle år</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        )}
        {onSearchChange && (
          <input
            type="text"
            className="search-input"
            placeholder="Søk..."
            value={searchValue}
            onChange={e => onSearchChange(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`

---

**Next Steps**: Implement with spreadsheet table
