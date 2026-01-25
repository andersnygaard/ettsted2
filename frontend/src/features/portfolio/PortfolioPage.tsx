import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageLayout,
  Button,
  SpreadsheetTable,
  TableHeader,
  TableFooter,
  useToast,
} from '@finans/components';
import type { ColumnToggle, CellChangeEvent } from '@finans/components';
import { useAuth } from '@/features/auth/useAuth';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { usePortfolioData, useUpdateSnapshot, useDeleteSnapshot } from './usePortfolioData';
import { usePortfolioColumns, usePortfolioExport } from './hooks';
import { NewMonthModal } from './NewMonthModal';
import { DeleteSnapshotModal } from './DeleteSnapshotModal';
import { PortfolioPageSkeleton } from './PortfolioPageSkeleton';
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

export default function PortfolioPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: portfolioDataWithMilestones, isLoading, error } = usePortfolioData();
  const updateSnapshot = useUpdateSnapshot();
  const deleteSnapshot = useDeleteSnapshot();
  const { showSuccess, showError } = useToast();
  usePageTitle('Portefølje');

  // Extract rows and milestones from the fetched data
  const portfolioData = portfolioDataWithMilestones?.rows ?? [];
  const milestones = portfolioDataWithMilestones?.milestones ?? {};

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleGroups, setVisibleGroups] = useState<Set<string>>(
    new Set(['sparing', 'gjeld', 'pensjon'])
  );
  const [isNewMonthModalOpen, setIsNewMonthModalOpen] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{
    isOpen: boolean;
    snapshotId: string | null;
    snapshotDate: string | null;
  }>({
    isOpen: false,
    snapshotId: null,
    snapshotDate: null,
  });

  // Items per page: 24 for "Alle år", 12 for specific year
  const itemsPerPage = selectedYear === null ? 24 : 12;

  // Generate column groups from user accounts
  const columnGroups = usePortfolioColumns(user?.accounts);

  // Transform portfolio data for table display
  const tableData = useMemo(() => {
    if (!portfolioData || !user?.accounts) return [];

    return portfolioData.map((row) => {
      const rowData: Record<string, string | number | null | undefined> = {
        id: row.id,
        date: row.date,
      };

      // Map each account value
      row.accounts.forEach((acc) => {
        const accountConfig = user.accounts!.find(
          (cfg) => cfg.name.toLowerCase() === acc.name.toLowerCase()
        );
        if (accountConfig) {
          rowData[accountConfig.id] = accountConfig.category === 'gjeld'
            ? Math.abs(acc.value)
            : acc.value;
        }
      });

      // Add category totals
      rowData.sumSavings = row.totals.sparing;
      rowData.sumGjeld = row.totals.gjeld;
      rowData.sumPensjon = row.totals.pensjon;

      return rowData;
    });
  }, [portfolioData, user?.accounts]);

  // Transform milestone keys
  const transformedMilestones = useMemo(() => {
    if (!user?.accounts) return {};

    const transformed: Record<string, number[]> = {};

    Object.entries(milestones).forEach(([key, thresholds]) => {
      const [snapshotId, accountName] = key.split('-');
      const accountConfig = user.accounts!.find(
        (cfg) => cfg.name.toLowerCase() === accountName.toLowerCase()
      );

      if (accountConfig && snapshotId) {
        const newKey = `${snapshotId}-${accountConfig.id}`;
        transformed[newKey] = thresholds;
      }
    });

    return transformed;
  }, [milestones, user?.accounts]);

  // Get available years from data
  const availableYears = useMemo(() => {
    if (!tableData.length) return [];
    const years = new Set<number>();
    tableData.forEach((row) => {
      const date = row.date as string;
      const parts = date.split('.');
      const year = parseInt(parts[2], 10);
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [tableData]);

  // Filter data by year
  const filteredData = useMemo(() => {
    let filtered = [...tableData];
    if (selectedYear !== null) {
      filtered = filtered.filter((row) => {
        const date = row.date as string;
        const parts = date.split('.');
        const year = parseInt(parts[2], 10);
        return year === selectedYear;
      });
    }
    return filtered;
  }, [tableData, selectedYear]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  const handleYearChange = (year: number | null) => {
    setSelectedYear(year);
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

  // Export handler
  const handleExport = usePortfolioExport(tableData, columnGroups);

  // Delete modal handlers
  const handleDeleteClick = useCallback((snapshotId: string, snapshotDate: string) => {
    setDeleteConfirmModal({
      isOpen: true,
      snapshotId,
      snapshotDate,
    });
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirmModal({
      isOpen: false,
      snapshotId: null,
      snapshotDate: null,
    });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteConfirmModal.snapshotId) return;

    deleteSnapshot.mutate(deleteConfirmModal.snapshotId, {
      onSuccess: () => {
        showSuccess('Måned slettet');
        setDeleteConfirmModal({
          isOpen: false,
          snapshotId: null,
          snapshotDate: null,
        });
      },
      onError: () => {
        showError('Kunne ikke slette måned');
      },
    });
  }, [deleteConfirmModal.snapshotId, deleteSnapshot, showSuccess, showError]);

  const handleAddNewMonth = () => {
    setIsNewMonthModalOpen(true);
  };

  const handleNewMonthSuccess = () => {
    // Data refreshes automatically
  };

  /**
   * Handle inline cell edit
   */
  const handleCellChange = useCallback(
    (event: CellChangeEvent) => {
      if (!portfolioData || !user?.accounts) return;

      const snapshot = portfolioData.find((s) => s.id === event.rowId);
      if (!snapshot) return;

      const accountConfig = user.accounts.find((acc) => acc.id === event.columnId);
      if (!accountConfig) return;

      const updatedAccounts = snapshot.accounts.map((acc) => {
        if (acc.name.toLowerCase() === accountConfig.name.toLowerCase()) {
          const newValue = accountConfig.category === 'gjeld'
            ? -Math.abs(event.value)
            : event.value;
          return { ...acc, value: newValue };
        }
        return acc;
      });

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

      const totalNetWorth = updatedAccounts.reduce((sum, acc) => sum + acc.value, 0);

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

  if (isLoading) {
    return <PortfolioPageSkeleton />;
  }

  if (error) {
    return (
      <PageLayout
        breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Portefølje' }]}
        title="Portefølje"
        subtitle="Kunne ikke laste data"
        width="wide"
        className="portfolio-page"
      >
        <div className="portfolio-page__error">
          En feil oppstod ved lasting av porteføljedata. Prøv igjen senere.
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Portefølje' }]}
      title="Portefølje"
      subtitle="Alle data samlet — klikk på gruppeoverskrifter for å utvide/kollapse"
      width="wide"
      className="portfolio-page"
    >
      <div className="portfolio-page__actions">
        <Button variant="secondary" onClick={handleExport}>
          Eksporter
        </Button>
        <Button variant="secondary" onClick={() => navigate('/import')}>
          Importer data
        </Button>
        <Button variant="primary" onClick={handleAddNewMonth}>
          + Ny måned
        </Button>
      </div>

      <div className="table-container">
        <TableHeader
          title="Månedlig historikk"
          years={availableYears}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
        />

        {tableData.length > 0 ? (
          <SpreadsheetTable
            columnGroups={visibleColumnGroups}
            data={paginatedData}
            dateKey="date"
            rowIdKey="id"
            milestones={transformedMilestones}
            initialCollapsedGroups={['gjeld', 'pensjon']}
            onCellChange={handleCellChange}
            onRowDelete={(rowData) => {
              const snapshotId = rowData.id as string;
              const snapshotDate = rowData.date as string;
              handleDeleteClick(snapshotId, snapshotDate);
            }}
          />
        ) : (
          <div className="portfolio-page__empty">
            <p>Ingen data ennå. Klikk "+ Ny måned" for å legge til din første måned.</p>
          </div>
        )}

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

      <NewMonthModal
        isOpen={isNewMonthModalOpen}
        onClose={() => setIsNewMonthModalOpen(false)}
        onSuccess={handleNewMonthSuccess}
        latestSnapshot={portfolioData[0]}
      />

      <DeleteSnapshotModal
        isOpen={deleteConfirmModal.isOpen}
        snapshotDate={deleteConfirmModal.snapshotDate}
        isPending={deleteSnapshot.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </PageLayout>
  );
}
