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
 * - Inline cell editing
 */

import { useState, useRef, useEffect } from 'react';
import { formatNumber } from '../../utils/numberFormat';
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

export interface CellChangeEvent {
  rowId: string; // Snapshot ID
  columnId: string; // Account ID
  value: number;
}

export type RowData = Record<string, string | number | null | undefined>;

export interface SpreadsheetTableProps {
  columnGroups: ColumnGroup[];
  data: RowData[];
  dateKey: string;
  rowIdKey?: string; // Key for row identifier (snapshot ID), defaults to 'id'
  milestones?: Record<string, number[]>; // Map of column ID -> array of milestone values crossed
  initialCollapsedGroups?: string[]; // Group IDs to collapse by default
  onCellChange?: (event: CellChangeEvent) => void; // Callback when cell value changes
  editingDisabled?: boolean; // Disable inline editing
}

/**
 * Format a cell value with optional milestone highlighting
 *
 * @param value - The value to format
 * @param milestones - Array of milestone thresholds crossed in this cell
 * @returns Formatted value with optional milestone star
 */
function formatCell(value: string | number | null | undefined, milestones?: number[]): JSX.Element | string {
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
  rowIdKey = 'id',
  milestones = {},
  initialCollapsedGroups = [],
  onCellChange,
  editingDisabled = false,
}: SpreadsheetTableProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    () => new Set(initialCollapsedGroups)
  );

  // Editing state: { rowIndex, columnId } or null
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; columnId: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

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

  /**
   * Start editing a cell
   */
  const startEditing = (rowIndex: number, columnId: string, currentValue: string | number | null | undefined) => {
    if (editingDisabled || !onCellChange) return;

    setEditingCell({ rowIndex, columnId });
    // Convert value to string for input, handle undefined/null
    const valueStr = currentValue !== undefined && currentValue !== null
      ? String(currentValue)
      : '';
    setEditValue(valueStr);
  };

  /**
   * Save the edited value
   */
  const saveEdit = () => {
    if (!editingCell || !onCellChange) return;

    const row = data[editingCell.rowIndex];
    const rowId = row[rowIdKey];
    const newValue = parseFloat(editValue) || 0;
    const oldValue = row[editingCell.columnId];

    // Only save if value changed
    if (newValue !== oldValue) {
      onCellChange({
        rowId,
        columnId: editingCell.columnId,
        value: newValue,
      });
    }

    setEditingCell(null);
    setEditValue('');
  };

  /**
   * Cancel editing
   */
  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  /**
   * Get all editable cells as flat array of { rowIndex, columnId }
   */
  const getEditableCells = () => {
    const cells: { rowIndex: number; columnId: string }[] = [];

    data.forEach((_, rowIndex) => {
      columnGroups.forEach((group) => {
        if (collapsedGroups.has(group.id)) return; // Skip collapsed groups
        group.columns.forEach((col) => {
          if (!col.isTotal) {
            cells.push({ rowIndex, columnId: col.id });
          }
        });
      });
    });

    return cells;
  };

  /**
   * Navigate to next/previous editable cell
   */
  const navigateToCell = (direction: 'next' | 'prev') => {
    if (!editingCell) return;

    const cells = getEditableCells();
    const currentIndex = cells.findIndex(
      (c) => c.rowIndex === editingCell.rowIndex && c.columnId === editingCell.columnId
    );

    if (currentIndex === -1) return;

    let nextIndex: number;
    if (direction === 'next') {
      nextIndex = currentIndex + 1;
      if (nextIndex >= cells.length) return; // At end, just save
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) return; // At start, just save
    }

    const nextCell = cells[nextIndex];
    const nextRow = data[nextCell.rowIndex];
    const nextValue = nextRow[nextCell.columnId];

    // Save current edit first
    saveEdit();

    // Start editing next cell
    setEditingCell(nextCell);
    const valueStr = nextValue !== undefined && nextValue !== null
      ? String(nextValue)
      : '';
    setEditValue(valueStr);
  };

  /**
   * Handle keyboard events in edit mode
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      navigateToCell(e.shiftKey ? 'prev' : 'next');
    }
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
                  const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === col.id;
                  const isEditable = !col.isTotal && onCellChange && !editingDisabled;

                  return (
                    <td
                      key={col.id}
                      className={`col-${group.id} ${col.isTotal ? 'col-total' : ''} ${
                        isLastInGroup ? 'col-group-end' : ''
                      } ${isEditable ? 'cell-editable' : ''} ${isEditing ? 'cell-editing' : ''}`}
                      onClick={() => !col.isTotal && startEditing(rowIndex, col.id, row[col.id])}
                    >
                      {isEditing ? (
                        <input
                          ref={inputRef}
                          type="number"
                          className="cell-input"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={handleKeyDown}
                        />
                      ) : (
                        formatCell(row[col.id], milestones[col.id])
                      )}
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
