import './TableHeader.css';

/**
 * Table Header Component
 *
 * Flexible header for table sections with optional year filter and search functionality.
 * Based on Nordic Minimal design system.
 *
 * Used on Portefølje page for "Månedlig historikk" section with year filtering and search controls.
 */

export interface TableHeaderProps {
  /**
   * Header title (e.g., "Månedlig historikk")
   */
  title: string;

  /**
   * Optional array of years for filtering
   * If provided, displays year dropdown selector
   */
  years?: number[];

  /**
   * Currently selected year, or null for "Alle år"
   */
  selectedYear?: number | null;

  /**
   * Callback when year selection changes
   */
  onYearChange?: (year: number | null) => void;

  /**
   * Current search input value
   */
  searchValue?: string;

  /**
   * Callback when search input changes
   */
  onSearchChange?: (value: string) => void;
}

/**
 * TableHeader Component
 *
 * Usage:
 * <TableHeader
 *   title="Månedlig historikk"
 *   years={[2024, 2023, 2022]}
 *   selectedYear={2024}
 *   onYearChange={(year) => setYear(year)}
 *   searchValue={search}
 *   onSearchChange={(value) => setSearch(value)}
 * />
 */
export function TableHeader({
  title,
  years = [],
  selectedYear,
  onYearChange,
  searchValue = '',
  onSearchChange
}: TableHeaderProps) {
  return (
    <div className="table-header">
      <h2 className="table-header__title">{title}</h2>
      {(years.length > 0 || onSearchChange) && (
        <div className="table-header__controls">
          {years.length > 0 && (
            <select
              className="table-header__select"
              value={selectedYear ?? ''}
              onChange={e => onYearChange?.(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">Alle år</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          )}
          {onSearchChange && (
            <input
              type="text"
              className="table-header__search"
              placeholder="Søk..."
              value={searchValue}
              onChange={e => onSearchChange(e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );
}
