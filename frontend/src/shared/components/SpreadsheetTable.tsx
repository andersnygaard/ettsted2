/**
 * Spreadsheet Table Component
 *
 * A complex table component for displaying portfolio data with:
 * - Collapsible column groups
 * - Sticky header and first column
 * - Color-coded column groups
 * - Milestone highlighting (gold stars for threshold crossings)
 * - Norwegian number formatting
 * - Row hover effects
 */

import { useState } from 'react';
import { formatNumber } from '@/shared/utils/numberFormat';
import './SpreadsheetTable.css';

export interface Column {
  id: string;
  label: string;
  isTotal?: boolean;
}

export interface ColumnGroup {
  id: string;
  label: string;
  color: string; // CSS color value or variable (e.g., '#5a6d7a', 'var(--muted-sage)')
  columns: Column[];
}

export interface SpreadsheetTableProps {
  columnGroups: ColumnGroup[];
  data: Record<string, any>[];
  dateKey: string;
  milestones?: Record<string, number[]>; // Map of column ID -> array of milestone values crossed
}

/**
 * Format a cell value with optional milestone highlighting
 *
 * @param value - The value to format
 * @param milestones - Array of milestone thresholds crossed in this cell
 * @returns Formatted value with optional milestone star
 */
function formatCell(value: any, milestones?: number[]): JSX.Element | string {
  // Handle null, undefined, or empty values
  if (value === null || value === undefined || value === '' || value === '-') {
    return '-';
  }

  // Format numeric values
  if (typeof value === 'number') {
    const formatted = formatNumber(value, 0); // No decimals for portfolio values

    // Check if this value crossed a milestone threshold
    const hasMilestone = milestones && milestones.length > 0;

    if (hasMilestone) {
      return (
        <span className="value-milestone">
          {formatted}
        </span>
      );
    }

    return formatted;
  }

  // Return string values as-is
  return String(value);
}

/**
 * Spreadsheet Table Component
 *
 * Displays financial data in a spreadsheet-like table with collapsible column groups,
 * sticky positioning, and milestone highlighting.
 */
export function SpreadsheetTable({
  columnGroups,
  data,
  dateKey,
  milestones = {},
}: SpreadsheetTableProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  /**
   * Toggle the collapsed state of a column group
   */
  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => {
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
          {/* Column Group Headers */}
          <tr className="group-header-row">
            <th
              rowSpan={2}
              className="date-header"
              style={{ background: 'var(--bone)', color: 'var(--charcoal)' }}
            >
              Dato
            </th>
            {columnGroups.map((group) => {
              const isCollapsed = collapsedGroups.has(group.id);
              const colspan = isCollapsed ? 1 : group.columns.length;

              return (
                <th
                  key={group.id}
                  colSpan={colspan}
                  className={`group-${group.id} ${isCollapsed ? 'group-collapsed' : ''}`}
                  onClick={() => toggleGroup(group.id)}
                  style={{ background: group.color }}
                >
                  {group.label}
                  <span className="group-toggle">▼</span>
                </th>
              );
            })}
          </tr>

          {/* Column Headers */}
          <tr>
            {columnGroups.flatMap((group) => {
              const isCollapsed = collapsedGroups.has(group.id);

              if (isCollapsed) {
                // Show only the total column when collapsed
                const totalColumn = group.columns.find((col) => col.isTotal);
                if (totalColumn) {
                  return [
                    <th
                      key={`${group.id}-total`}
                      className={`col-${group.id} col-total col-group-end`}
                    >
                      {totalColumn.label}
                    </th>,
                  ];
                }
                return [];
              }

              // Show all columns when expanded
              return group.columns.map((col, index) => {
                const isLastInGroup = index === group.columns.length - 1;
                return (
                  <th
                    key={col.id}
                    className={`col-${group.id} ${col.isTotal ? 'col-total' : ''} ${
                      isLastInGroup ? 'col-group-end' : ''
                    }`}
                  >
                    {col.label}
                  </th>
                );
              });
            })}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {/* Date column (sticky) */}
              <td className="date-cell">{row[dateKey]}</td>

              {/* Data columns */}
              {columnGroups.flatMap((group) => {
                const isCollapsed = collapsedGroups.has(group.id);

                if (isCollapsed) {
                  // Show only the total column when collapsed
                  const totalColumn = group.columns.find((col) => col.isTotal);
                  if (totalColumn) {
                    return [
                      <td
                        key={`${group.id}-total`}
                        className={`col-${group.id} col-total col-group-end`}
                      >
                        {formatCell(row[totalColumn.id], milestones[totalColumn.id])}
                      </td>,
                    ];
                  }
                  return [];
                }

                // Show all columns when expanded
                return group.columns.map((col, index) => {
                  const isLastInGroup = index === group.columns.length - 1;
                  return (
                    <td
                      key={col.id}
                      className={`col-${group.id} ${col.isTotal ? 'col-total' : ''} ${
                        isLastInGroup ? 'col-group-end' : ''
                      }`}
                    >
                      {formatCell(row[col.id], milestones[col.id])}
                    </td>
                  );
                });
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
