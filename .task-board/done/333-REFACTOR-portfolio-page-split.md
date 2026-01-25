# 333 - REFACTOR: Split Large PortfolioPage Component

**Status**: Backlog
**Created**: 2025-12-29
**Priority**: Low
**Labels**: refactor, frontend, code-quality
**Estimated Effort**: Medium (2-3 hours)

## Context & Motivation

`PortfolioPage.tsx` is 596 lines with multiple responsibilities. Splitting improves maintainability and testability.

## Current State

The file contains:
- **Lines 36-54**: Constants (CATEGORY_COLORS, CATEGORY_LABELS, CATEGORY_SUM_IDS)
- **Lines 69-83**: Multiple useState declarations
- **Lines 88-129**: Delete modal handlers (handleDeleteClick, handleDeleteCancel, handleDeleteConfirm)
- **Lines 131-161**: Column group generation (columnGroups useMemo)
- **Lines 163-217**: Data transformation (tableData, transformedMilestones useMemos)
- **Lines 219-267**: Filtering and pagination logic
- **Lines 286-342**: Export functionality (handleExport)
- **Lines 356-406**: Cell change handler
- **Lines 408-467**: Loading skeleton
- **Lines 563-592**: Delete confirmation modal JSX

## Desired Outcome

Main component reduced to ~200 lines, with extracted hooks and components.

## Acceptance Criteria

- [ ] PortfolioPage.tsx reduced to <300 lines
- [ ] DeleteSnapshotModal extracted as component
- [ ] usePortfolioExport hook extracted
- [ ] usePortfolioColumns hook extracted
- [ ] No functionality regression
- [ ] E2E tests still pass

## Technical Approach

### 1. Extract DeleteSnapshotModal Component

**Create**: `frontend/src/features/portfolio/DeleteSnapshotModal.tsx`

```tsx
import { Modal, Button } from '@finans/components';

interface DeleteSnapshotModalProps {
  isOpen: boolean;
  snapshotDate: string | null;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteSnapshotModal({
  isOpen,
  snapshotDate,
  isPending,
  onConfirm,
  onCancel,
}: DeleteSnapshotModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Slett måned"
      footer={
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onCancel}>
            Avbryt
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Sletter...' : 'Slett'}
          </Button>
        </div>
      }
    >
      <p>Er du sikker på at du vil slette {snapshotDate}?</p>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '12px' }}>
        Denne handlingen kan ikke angres.
      </p>
    </Modal>
  );
}
```

### 2. Extract usePortfolioExport Hook

**Create**: `frontend/src/features/portfolio/hooks/usePortfolioExport.ts`

```tsx
import { useCallback } from 'react';
import type { ColumnGroup } from '@finans/components';

export function usePortfolioExport(
  tableData: Record<string, unknown>[],
  columnGroups: ColumnGroup[]
) {
  return useCallback(() => {
    if (!tableData.length || !columnGroups.length) return;

    const headers: string[] = ['Dato'];
    const columnIds: string[] = [];

    columnGroups.forEach((group) => {
      group.columns.forEach((col) => {
        headers.push(col.label);
        columnIds.push(col.id);
      });
    });

    const rows: string[][] = tableData.map((row) => {
      const date = row.date as string;
      const values: string[] = [date];
      columnIds.forEach((colId) => {
        const value = row[colId];
        if (typeof value === 'number') {
          values.push(value.toLocaleString('nb-NO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }));
        } else {
          values.push(value?.toString() ?? '');
        }
      });
      return values;
    });

    const csvContent = [
      headers.join(';'),
      ...rows.map((row) => row.join(';')),
    ].join('\r\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `portefolje-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [tableData, columnGroups]);
}
```

### 3. Extract usePortfolioColumns Hook

**Create**: `frontend/src/features/portfolio/hooks/usePortfolioColumns.ts`

```tsx
import { useMemo } from 'react';
import type { ColumnGroup, Column } from '@finans/components';
import type { AccountConfig } from '@/features/auth/types';

const CATEGORY_COLORS: Record<string, string> = {
  sparing: '#5a6d7a',
  gjeld: '#8a7060',
  pensjon: '#6a7a60',
};

const CATEGORY_LABELS: Record<string, string> = {
  sparing: 'Sparing',
  gjeld: 'Gjeld',
  pensjon: 'Pensjon',
};

const CATEGORY_SUM_IDS: Record<string, string> = {
  sparing: 'sumSavings',
  gjeld: 'sumGjeld',
  pensjon: 'sumPensjon',
};

export function usePortfolioColumns(accounts: AccountConfig[] | undefined): ColumnGroup[] {
  return useMemo(() => {
    if (!accounts) return [];

    const categories: ('sparing' | 'gjeld' | 'pensjon')[] = ['sparing', 'gjeld', 'pensjon'];

    return categories.map((category) => {
      const categoryAccounts = accounts
        .filter((acc) => acc.category === category && acc.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const columns: Column[] = categoryAccounts.map((acc) => ({
        id: acc.id,
        label: acc.name,
      }));

      columns.push({
        id: CATEGORY_SUM_IDS[category],
        label: `Sum ${CATEGORY_LABELS[category].toLowerCase()}`,
        isTotal: true,
      });

      return {
        id: category,
        label: CATEGORY_LABELS[category],
        color: CATEGORY_COLORS[category],
        columns,
      };
    });
  }, [accounts]);
}

export { CATEGORY_SUM_IDS };
```

### 4. Move Loading Skeleton

**Create**: `frontend/src/features/portfolio/PortfolioPageSkeleton.tsx`

Extract lines 408-467 (the loading skeleton JSX) into a separate component.

## Proposed File Structure

```
frontend/src/features/portfolio/
├── PortfolioPage.tsx              # ~250 lines (orchestrator)
├── PortfolioPage.css
├── PortfolioPageSkeleton.tsx      # Loading state
├── DeleteSnapshotModal.tsx        # Delete confirmation
├── NewMonthModal.tsx              # Existing
├── hooks/
│   ├── index.ts                   # Barrel export
│   ├── usePortfolioColumns.ts     # Column generation
│   └── usePortfolioExport.ts      # CSV export
└── usePortfolioData.ts            # Existing data hook
```

## Refactored PortfolioPage Usage

```tsx
// PortfolioPage.tsx (after refactor)
import { usePortfolioColumns, usePortfolioExport } from './hooks';
import { DeleteSnapshotModal } from './DeleteSnapshotModal';
import { PortfolioPageSkeleton } from './PortfolioPageSkeleton';

export default function PortfolioPage() {
  const { user } = useAuth();
  const { data, isLoading, error } = usePortfolioData();

  const columnGroups = usePortfolioColumns(user?.accounts);
  const handleExport = usePortfolioExport(tableData, columnGroups);

  if (isLoading) return <PortfolioPageSkeleton />;

  // ... rest of component (~200 lines)
}
```

## Files to Create/Modify

| File | Action | Lines |
|------|--------|-------|
| `PortfolioPage.tsx` | Refactor | 596 → ~250 |
| `DeleteSnapshotModal.tsx` | Create | ~50 |
| `PortfolioPageSkeleton.tsx` | Create | ~60 |
| `hooks/usePortfolioColumns.ts` | Create | ~50 |
| `hooks/usePortfolioExport.ts` | Create | ~55 |
| `hooks/index.ts` | Create | ~5 |

## Testing

After each extraction:
1. Run `pnpm --filter frontend type-check`
2. Run `pnpm --filter frontend build`
3. Run `pnpm --filter e2e test:smoke`
4. Manually verify portfolio page functionality

---

**Next Steps**: Lower priority refactor. Execute incrementally when working in this area.
