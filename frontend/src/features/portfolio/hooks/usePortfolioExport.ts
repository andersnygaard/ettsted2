import { useCallback } from 'react';
import type { ColumnGroup } from '@finans/components';

export function usePortfolioExport(
  tableData: Record<string, unknown>[],
  columnGroups: ColumnGroup[]
) {
  return useCallback(() => {
    if (!tableData.length || !columnGroups.length) return;

    // Build header row: Dato + all account columns + sum columns
    const headers: string[] = ['Dato'];
    const columnIds: string[] = [];

    columnGroups.forEach((group) => {
      group.columns.forEach((col) => {
        headers.push(col.label);
        columnIds.push(col.id);
      });
    });

    // Build data rows
    const rows: string[][] = tableData.map((row) => {
      const date = row.date as string;
      const values: string[] = [date];
      columnIds.forEach((colId) => {
        const value = row[colId];
        // Format numbers with Norwegian locale for CSV export
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

    // Build CSV with semicolon delimiter (Norwegian Excel)
    const csvContent = [
      headers.join(';'),
      ...rows.map((row) => row.join(';')),
    ].join('\r\n');

    // Add UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // Trigger download
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
