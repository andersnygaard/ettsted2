import { useState } from 'react';
import { TableFooter, type ColumnToggle } from '@finans/components';

/**
 * TableFooter Usage Example
 *
 * This file demonstrates how to use the TableFooter component
 * in different scenarios.
 */

export function TableFooterExample() {
  const [page, setPage] = useState(1);
  const [columnToggles, setColumnToggles] = useState<ColumnToggle[]>([
    { id: 'sparing', label: 'Sparing', visible: true },
    { id: 'gjeld', label: 'Gjeld', visible: true },
    { id: 'pensjon', label: 'Pensjon', visible: true }
  ]);

  const handleToggleColumn = (id: string) => {
    setColumnToggles((prev) =>
      prev.map((toggle) =>
        toggle.id === id ? { ...toggle, visible: !toggle.visible } : toggle
      )
    );
  };

  return (
    <div style={{ padding: '40px', background: '#F5F2ED' }}>
      <h2 style={{ marginBottom: '20px' }}>TableFooter Examples</h2>

      {/* Example 1: Full featured footer */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Full Featured Footer</h3>
        <div style={{ background: 'white', borderRadius: '2px' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
            <p>Table content would go here...</p>
          </div>
          <TableFooter
            showing={12}
            total={35}
            unit="måneder"
            columnToggles={columnToggles}
            onToggleColumn={handleToggleColumn}
            page={page}
            totalPages={3}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Example 2: Footer without column toggles */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Without Column Toggles</h3>
        <div style={{ background: 'white', borderRadius: '2px' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
            <p>Table content would go here...</p>
          </div>
          <TableFooter
            showing={10}
            total={50}
            unit="items"
            page={1}
            totalPages={5}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Example 3: Many pages with ellipsis */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Many Pages (Ellipsis Demo)</h3>
        <div style={{ background: 'white', borderRadius: '2px' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
            <p>Table content would go here...</p>
          </div>
          <TableFooter
            showing={20}
            total={200}
            page={5}
            totalPages={10}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Example 4: Single page (no pagination needed) */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Single Page</h3>
        <div style={{ background: 'white', borderRadius: '2px' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #ccc' }}>
            <p>Table content would go here...</p>
          </div>
          <TableFooter
            showing={5}
            total={5}
            page={1}
            totalPages={1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Integration Example with Portfolio Table
 */
export function PortfolioTableFooterExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleGroups, setVisibleGroups] = useState<ColumnToggle[]>([
    { id: 'sparing', label: 'Sparing', visible: true },
    { id: 'gjeld', label: 'Gjeld', visible: true },
    { id: 'pensjon', label: 'Pensjon', visible: true }
  ]);

  // Simulate portfolio data
  const totalSnapshots = 35;
  const snapshotsPerPage = 12;
  const totalPages = Math.ceil(totalSnapshots / snapshotsPerPage);
  const showing = Math.min(snapshotsPerPage, totalSnapshots - (currentPage - 1) * snapshotsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Here you would also fetch new data for the page
    console.log(`Fetching data for page ${newPage}`);
  };

  const handleToggleColumn = (groupId: string) => {
    setVisibleGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, visible: !group.visible } : group
      )
    );
    // Here you would also update the table to show/hide columns
    console.log(`Toggling column group: ${groupId}`);
  };

  return (
    <div style={{ padding: '40px', background: '#F5F2ED' }}>
      <h2>Portfolio Table Integration</h2>
      <div style={{ background: 'white', borderRadius: '2px', marginTop: '20px' }}>
        {/* Table would go here */}
        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
          Portfolio spreadsheet table content (SpreadsheetTable component)
        </div>

        <TableFooter
          showing={showing}
          total={totalSnapshots}
          unit="måneder"
          columnToggles={visibleGroups}
          onToggleColumn={handleToggleColumn}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <div style={{ marginTop: '20px', padding: '20px', background: 'white', borderRadius: '2px' }}>
        <h3>Current State:</h3>
        <pre>
          {JSON.stringify(
            {
              currentPage,
              showing,
              total: totalSnapshots,
              totalPages,
              visibleGroups
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
