# FEATURE: Table Footer with Pagination

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: component, table, portfolio
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

The portfolio table has a footer with info text, column visibility toggles, and pagination.

## Reference

Design file: `.docs/design-drafts/draft-1-portfolio.html` (lines 342-397, 658-678)

## Desired Outcome

Table footer with info, toggles, and pagination controls.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/TableFooter.tsx`
- [ ] Props: `total`, `showing`, `columnToggles`, `page`, `totalPages`, `onPageChange`
- [ ] Info text: "Viser X av Y måneder"
- [ ] Column visibility checkboxes
- [ ] Pagination buttons (Previous, page numbers, Next)
- [ ] Active page styling

## Technical Approach

```tsx
// TableFooter.tsx
interface ColumnToggle {
  id: string;
  label: string;
  visible: boolean;
}

interface TableFooterProps {
  showing: number;
  total: number;
  unit?: string;
  columnToggles?: ColumnToggle[];
  onToggleColumn?: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TableFooter({
  showing,
  total,
  unit = 'måneder',
  columnToggles,
  onToggleColumn,
  page,
  totalPages,
  onPageChange
}: TableFooterProps) {
  return (
    <div className="table-footer">
      <div className="table-info">
        Viser {showing} av {total} {unit}
      </div>

      {columnToggles && (
        <div className="column-toggles">
          {columnToggles.map(toggle => (
            <label key={toggle.id} className="column-toggle">
              <input
                type="checkbox"
                checked={toggle.visible}
                onChange={() => onToggleColumn?.(toggle.id)}
              />
              {toggle.label}
            </label>
          ))}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          ← Forrige
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            className={p === page ? 'active' : ''}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Neste →
        </button>
      </div>
    </div>
  );
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`

---

**Next Steps**: Implement with spreadsheet table
