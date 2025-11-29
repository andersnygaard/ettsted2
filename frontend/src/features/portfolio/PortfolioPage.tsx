import { useState, useMemo } from 'react';
import {
  Breadcrumb,
  PageHeader,
  Button,
  SpreadsheetTable,
  TableHeader,
  TableFooter,
} from '@/shared/components';
import type { ColumnGroup, ColumnToggle } from '@/shared/components';
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

// Define column groups structure
const columnGroups: ColumnGroup[] = [
  {
    id: 'sparing',
    label: 'Sparing',
    color: '#5a6d7a',
    columns: [
      { id: 'nordnetAsk', label: 'Nordnet ASK' },
      { id: 'bouvetAsk', label: 'Bouvet ASK' },
      { id: 'yolo', label: 'Yolo' },
      { id: 'firi', label: 'Firi' },
      { id: 'kron', label: 'Kron' },
      { id: 'skattKjop', label: 'Skatt/Kjøp' },
      { id: 'sumSparing', label: 'Sum sparing', isTotal: true },
    ],
  },
  {
    id: 'gjeld',
    label: 'Gjeld',
    color: '#8a7060',
    columns: [
      { id: 'sbanken', label: 'SBanken' },
      { id: 'sumGjeld', label: 'Sum gjeld', isTotal: true },
    ],
  },
  {
    id: 'pensjon',
    label: 'Pensjon',
    color: '#6a7a60',
    columns: [
      { id: 'arbeidsgiver', label: 'Arbeidsgiver' },
      { id: 'sumPensjon', label: 'Sum pensjon', isTotal: true },
    ],
  },
];

// Mock data for portfolio table (12 months)
const mockPortfolioData = [
  {
    date: '01.03.2025',
    nordnetAsk: 218037,
    bouvetAsk: 144566,
    yolo: 86890,
    firi: 2634,
    kron: 344371,
    skattKjop: null,
    sumSparing: 796498,
    sbanken: 798450,
    sumGjeld: 798450,
    arbeidsgiver: 2850000,
    sumPensjon: 3920000,
  },
  {
    date: '01.02.2025',
    nordnetAsk: 214137,
    bouvetAsk: 164404,
    yolo: 81225,
    firi: 2077,
    kron: 351156,
    skattKjop: null,
    sumSparing: 812999,
    sbanken: 805200,
    sumGjeld: 805200,
    arbeidsgiver: 2820000,
    sumPensjon: 3890000,
  },
  {
    date: '01.01.2025',
    nordnetAsk: 208716,
    bouvetAsk: 155588,
    yolo: 76878,
    firi: 981,
    kron: 330720,
    skattKjop: null,
    sumSparing: 772883,
    sbanken: 811900,
    sumGjeld: 811900,
    arbeidsgiver: 2790000,
    sumPensjon: 3848757,
  },
  {
    date: '01.12.2024',
    nordnetAsk: 231399,
    bouvetAsk: 116131,
    yolo: 77931,
    firi: null,
    kron: 326450,
    skattKjop: null,
    sumSparing: 751911,
    sbanken: 818600,
    sumGjeld: 818600,
    arbeidsgiver: 2760000,
    sumPensjon: 3810000,
  },
  {
    date: '01.11.2024',
    nordnetAsk: 236088,
    bouvetAsk: 109575,
    yolo: 77207,
    firi: null,
    kron: 310177,
    skattKjop: null,
    sumSparing: 733047,
    sbanken: 823751,
    sumGjeld: 823751,
    arbeidsgiver: 2730000,
    sumPensjon: 3780000,
  },
  {
    date: '01.10.2024',
    nordnetAsk: 228329,
    bouvetAsk: 112133,
    yolo: 73112,
    firi: null,
    kron: 294773,
    skattKjop: null,
    sumSparing: 708347,
    sbanken: 830400,
    sumGjeld: 830400,
    arbeidsgiver: 2700000,
    sumPensjon: 3750000,
  },
  {
    date: '01.09.2024',
    nordnetAsk: 224695,
    bouvetAsk: 113412,
    yolo: 75380,
    firi: null,
    kron: 281367,
    skattKjop: 12500,
    sumSparing: 707354,
    sbanken: 837100,
    sumGjeld: 837100,
    arbeidsgiver: 2670000,
    sumPensjon: 3720000,
  },
  {
    date: '01.08.2024',
    nordnetAsk: 226863,
    bouvetAsk: 102059,
    yolo: 75868,
    firi: null,
    kron: 280155,
    skattKjop: 10000,
    sumSparing: 694945,
    sbanken: 843800,
    sumGjeld: 843800,
    arbeidsgiver: 2640000,
    sumPensjon: 3690000,
  },
  {
    date: '01.07.2024',
    nordnetAsk: 223008,
    bouvetAsk: 101420,
    yolo: 70837,
    firi: null,
    kron: 256441,
    skattKjop: 5000,
    sumSparing: 656706,
    sbanken: 850500,
    sumGjeld: 850500,
    arbeidsgiver: 2610000,
    sumPensjon: 3660000,
  },
  {
    date: '01.06.2024',
    nordnetAsk: 212896,
    bouvetAsk: 80499,
    yolo: 69197,
    firi: null,
    kron: 246964,
    skattKjop: null,
    sumSparing: 609556,
    sbanken: 857200,
    sumGjeld: 857200,
    arbeidsgiver: 2580000,
    sumPensjon: 3630000,
  },
  {
    date: '01.01.2024',
    nordnetAsk: 201170,
    bouvetAsk: 75682,
    yolo: 67698,
    firi: null,
    kron: 78728,
    skattKjop: null,
    sumSparing: 423278,
    sbanken: 920000,
    sumGjeld: 920000,
    arbeidsgiver: 2400000,
    sumPensjon: 3400000,
  },
  {
    date: '01.10.2022',
    nordnetAsk: 168831,
    bouvetAsk: null,
    yolo: 51809,
    firi: null,
    kron: 23975,
    skattKjop: null,
    sumSparing: 244615,
    sbanken: 1050000,
    sumGjeld: 1050000,
    arbeidsgiver: 1800000,
    sumPensjon: 2600000,
  },
];

// Extract unique years from mock data
const getAvailableYears = (data: typeof mockPortfolioData): number[] => {
  const years = new Set<number>();
  data.forEach((row) => {
    const parts = row.date.split('.');
    const year = parseInt(parts[2], 10);
    years.add(year);
  });
  return Array.from(years).sort((a, b) => b - a); // Descending order
};

const ITEMS_PER_PAGE = 12;

export default function PortfolioPage() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleGroups, setVisibleGroups] = useState<Set<string>>(
    new Set(['sparing', 'gjeld', 'pensjon'])
  );

  // Get available years
  const availableYears = useMemo(() => getAvailableYears(mockPortfolioData), []);

  // Filter data by year and search
  const filteredData = useMemo(() => {
    let filtered = [...mockPortfolioData];

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
  }, [selectedYear, searchValue]);

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

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting portfolio data...');
  };

  const handleAddNewMonth = () => {
    // TODO: Implement add new month modal/form
    console.log('Adding new month...');
  };

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
          <SpreadsheetTable
            columnGroups={visibleColumnGroups}
            data={paginatedData}
            dateKey="date"
          />

          {/* Table footer with pagination and column toggles */}
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
        </div>
      </div>
    </main>
  );
}
