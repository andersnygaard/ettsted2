import { useState, useMemo, useCallback } from 'react';
import {
  Breadcrumb,
  PageHeader,
  Button,
  SpreadsheetTable,
  TableHeader,
  TableFooter,
  PortfolioSkeleton,
} from '@/shared/components';
import type { Column, ColumnGroup, ColumnToggle, CellChangeEvent } from '@/shared/components';
import { useAuth } from '@/features/auth/useAuth';
import { usePortfolioData, useUpdateSnapshot } from './usePortfolioData';
import { NewMonthModal } from './NewMonthModal';
import './PortfolioPage.css';

/**
 * Portfolio Page (Portefølje)
 *
 * Main data entry and viewing page showing all monthly snapshots in a spreadsheet-style table.
 * Features:
 * - Collapsible column groups (Sparing, Gjeld, Pensjon)
 * - Year filtering and search
 * - Pagination
 * - Column visibility toggles
 * - Export and add new month actions
 *
 * Based on Nordic Minimal design system.
 */

// Category colors for column groups
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

const ITEMS_PER_PAGE = 12;

export default function PortfolioPage() {
  const { user } = useAuth();
  const { data: portfolioData, isLoading, error } = usePortfolioData();
  const updateSnapshot = useUpdateSnapshot();

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleGroups, setVisibleGroups] = useState<Set<string>>(
    new Set(['sparing', 'gjeld', 'pensjon'])
  );
  const [isNewMonthModalOpen, setIsNewMonthModalOpen] = useState(false);

  // Generate column groups from user accounts
  const columnGroups = useMemo((): ColumnGroup[] => {
    if (!user?.accounts) return [];

    const categories: ('sparing' | 'gjeld' | 'pensjon')[] = ['sparing', 'gjeld', 'pensjon'];

    return categories.map((category) => {
      const categoryAccounts = user.accounts!
        .filter((acc) => acc.category === category && acc.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const columns: Column[] = categoryAccounts.map((acc) => ({
        id: acc.id,
        label: acc.name,
      }));

      // Add sum column
      columns.push({
        id: `sum${category.charAt(0).toUpperCase() + category.slice(1)}`,
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
  }, [user?.accounts]);

  // Transform portfolio data for table display
  const tableData = useMemo(() => {
    if (!portfolioData || !user?.accounts) return [];

    return portfolioData.map((row) => {
      const rowData: Record<string, any> = {
        id: row.id, // Snapshot ID for editing
        date: row.date,
      };

      // Map each account value
      row.accounts.forEach((acc) => {
        // Find matching account config by name (accounts in snapshots use name, not id)
        const accountConfig = user.accounts!.find(
          (cfg) => cfg.name.toLowerCase() === acc.name.toLowerCase()
        );
        if (accountConfig) {
          // Display gjeld as positive (stored as negative in DB)
          rowData[accountConfig.id] = accountConfig.category === 'gjeld'
            ? Math.abs(acc.value)
            : acc.value;
        }
      });

      // Add category totals
      rowData.sumSparing = row.totals.sparing;
      rowData.sumGjeld = row.totals.gjeld;
      rowData.sumPensjon = row.totals.pensjon;

      return rowData;
    });
  }, [portfolioData, user?.accounts]);

  // Get available years from data
  const availableYears = useMemo(() => {
    if (!tableData.length) return [];
    const years = new Set<number>();
    tableData.forEach((row) => {
      const parts = row.date.split('.');
      const year = parseInt(parts[2], 10);
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [tableData]);

  // Filter data by year and search
  const filteredData = useMemo(() => {
    let filtered = [...tableData];

    // Filter by year
    if (selectedYear !== null) {
      filtered = filtered.filter((row) => {
        const parts = row.date.split('.');
        const year = parseInt(parts[2], 10);
        return year === selectedYear;
      });
    }

    // Filter by search (searches date column)
    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase().trim();
      filtered = filtered.filter((row) =>
        row.date.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [tableData, selectedYear, searchValue]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  // Reset to page 1 when filters change
  const handleYearChange = (year: number | null) => {
    setSelectedYear(year);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setCurrentPage(1);
  };

  // Column toggles for table footer
  const columnToggles: ColumnToggle[] = columnGroups.map((group) => ({
    id: group.id,
    label: group.label,
    visible: visibleGroups.has(group.id),
  }));

  const handleToggleColumn = (groupId: string) => {
    setVisibleGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Filter column groups based on visibility
  const visibleColumnGroups = columnGroups.filter((group) =>
    visibleGroups.has(group.id)
  );

  /**
   * Export portfolio data as CSV for Excel
   * Uses semicolon delimiter for Norwegian Excel compatibility
   */
  const handleExport = useCallback(() => {
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
      const values: string[] = [row.date];
      columnIds.forEach((colId) => {
        const value = row[colId];
        // Format numbers: replace . with , for Norwegian Excel
        if (typeof value === 'number') {
          values.push(value.toString().replace('.', ','));
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

  const handleAddNewMonth = () => {
    setIsNewMonthModalOpen(true);
  };

  const handleNewMonthSuccess = () => {
    // Data refreshes automatically via TanStack Query invalidation
  };

  /**
   * Handle inline cell edit
   * Updates the snapshot with the new account value
   */
  const handleCellChange = useCallback(
    (event: CellChangeEvent) => {
      if (!portfolioData || !user?.accounts) return;

      // Find the snapshot
      const snapshot = portfolioData.find((s) => s.id === event.rowId);
      if (!snapshot) return;

      // Find the account config to get the name
      const accountConfig = user.accounts.find((acc) => acc.id === event.columnId);
      if (!accountConfig) return;

      // Update the accounts array
      const updatedAccounts = snapshot.accounts.map((acc) => {
        if (acc.name.toLowerCase() === accountConfig.name.toLowerCase()) {
          // Handle gjeld: store as negative
          const newValue = accountConfig.category === 'gjeld'
            ? -Math.abs(event.value)
            : event.value;
          return { ...acc, value: newValue };
        }
        return acc;
      });

      // Check if account exists, if not add it
      const accountExists = updatedAccounts.some(
        (acc) => acc.name.toLowerCase() === accountConfig.name.toLowerCase()
      );
      if (!accountExists) {
        updatedAccounts.push({
          id: accountConfig.id,
          name: accountConfig.name,
          assetClass: accountConfig.category,
          value: accountConfig.category === 'gjeld' ? -Math.abs(event.value) : event.value,
        });
      }

      // Calculate new total
      const totalNetWorth = updatedAccounts.reduce((sum, acc) => sum + acc.value, 0);

      // Update snapshot
      updateSnapshot.mutate({
        id: event.rowId,
        data: {
          accounts: updatedAccounts,
          totalNetWorth,
        },
      });
    },
    [portfolioData, user?.accounts, updateSnapshot]
  );

  // Show loading state
  if (isLoading) {
    return (
      <main className="portfolio-page">
        <div className="container container--wide">
          <PortfolioSkeleton />
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="portfolio-page">
        <div className="container container--wide">
          <Breadcrumb
            items={[
              { label: 'Oversikt', path: '/' },
              { label: 'Portefølje' },
            ]}
          />
          <PageHeader title="Portefølje" subtitle="Kunne ikke laste data" />
          <div className="portfolio-page__error">
            En feil oppstod ved lasting av porteføljedata. Prøv igjen senere.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="portfolio-page">
      <div className="container container--wide">
        {/* Breadcrumb navigation */}
        <Breadcrumb
          items={[
            { label: 'Oversikt', path: '/' },
            { label: 'Portefølje' },
          ]}
        />

        {/* Page header with title and actions */}
        <PageHeader
          title="Portefølje"
          subtitle="Alle data samlet — klikk på gruppeoverskrifter for å utvide/kollapse"
          actions={
            <>
              <Button variant="secondary" onClick={handleExport}>
                Eksporter
              </Button>
              <Button variant="primary" onClick={handleAddNewMonth}>
                + Ny måned
              </Button>
            </>
          }
        />

        {/* Table container */}
        <div className="table-container">
          {/* Table header with year filter and search */}
          <TableHeader
            title="Månedlig historikk"
            years={availableYears}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            searchValue={searchValue}
            onSearchChange={handleSearchChange}
          />

          {/* Spreadsheet table */}
          {tableData.length > 0 ? (
            <SpreadsheetTable
              columnGroups={visibleColumnGroups}
              data={paginatedData}
              dateKey="date"
              rowIdKey="id"
              initialCollapsedGroups={['gjeld', 'pensjon']}
              onCellChange={handleCellChange}
            />
          ) : (
            <div className="portfolio-page__empty">
              <p>Ingen data ennå. Klikk "+ Ny måned" for å legge til din første måned.</p>
            </div>
          )}

          {/* Table footer with pagination and column toggles */}
          {tableData.length > 0 && (
            <TableFooter
              showing={paginatedData.length}
              total={filteredData.length}
              unit="måneder"
              columnToggles={columnToggles}
              onToggleColumn={handleToggleColumn}
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      {/* New month modal */}
      <NewMonthModal
        isOpen={isNewMonthModalOpen}
        onClose={() => setIsNewMonthModalOpen(false)}
        onSuccess={handleNewMonthSuccess}
      />
    </main>
  );
}
