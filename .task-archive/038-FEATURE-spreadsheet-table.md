# FEATURE: Spreadsheet Table Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, table, portfolio
**Estimated Effort**: Complex - 4-5 hours

## Context & Motivation

The portfolio page has a complex spreadsheet-style table with collapsible column groups, sticky headers, and milestone highlighting. This is a core data display component.

## Reference

Design file: `.docs/design-drafts/draft-1-portfolio.html` (lines 205-657)

## Desired Outcome

Fully functional spreadsheet table matching the design.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/SpreadsheetTable.tsx`
- [ ] Collapsible column groups (Sparing, Gjeld, Pensjon)
- [ ] Sticky first column (date)
- [ ] Sticky header row
- [ ] Color-coded column groups
- [ ] Milestone highlighting (gold star for threshold crossings)
- [ ] Norwegian number formatting
- [ ] Hover highlighting on rows
- [ ] Horizontal scrolling for many columns

## Technical Approach

```tsx
// SpreadsheetTable.tsx
interface ColumnGroup {
  id: string;
  label: string;
  color: string;
  columns: Column[];
}

interface Column {
  id: string;
  label: string;
  isTotal?: boolean;
}

interface SpreadsheetTableProps {
  columnGroups: ColumnGroup[];
  data: Record<string, any>[];
  dateKey: string;
  milestones?: Record<string, number[]>; // column -> thresholds crossed
}

export function SpreadsheetTable({ columnGroups, data, dateKey, milestones }: SpreadsheetTableProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  return (
    <div className="spreadsheet-wrapper">
      <table className="spreadsheet">
        <thead>
          <tr className="group-header-row">
            <th rowSpan={2}>Dato</th>
            {columnGroups.map(group => (
              <th
                key={group.id}
                colSpan={collapsedGroups.has(group.id) ? 1 : group.columns.length}
                className={`group-${group.id}`}
                onClick={() => toggleGroup(group.id)}
              >
                {group.label}
                <span className="group-toggle">▼</span>
              </th>
            ))}
          </tr>
          <tr>
            {columnGroups.flatMap(group =>
              collapsedGroups.has(group.id)
                ? [<th key={`${group.id}-total`} className={`col-${group.id} col-total`}>Sum</th>]
                : group.columns.map(col => (
                    <th key={col.id} className={`col-${group.id} ${col.isTotal ? 'col-total' : ''}`}>
                      {col.label}
                    </th>
                  ))
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="date-cell">{row[dateKey]}</td>
              {columnGroups.flatMap(group =>
                collapsedGroups.has(group.id)
                  ? [<td key={`${group.id}-total`} className={`col-${group.id} col-total`}>{formatNumber(row[`${group.id}Total`])}</td>]
                  : group.columns.map(col => (
                      <td key={col.id} className={`col-${group.id} ${col.isTotal ? 'col-total' : ''}`}>
                        {formatCell(row[col.id], milestones?.[col.id])}
                      </td>
                    ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- Norwegian localization utilities

---

**Next Steps**: Core portfolio component, implement carefully
