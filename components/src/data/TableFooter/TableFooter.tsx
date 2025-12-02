import './TableFooter.css';

/**
 * TableFooter Component
 *
 * Footer section for tables with info text, column visibility toggles, and pagination.
 * Used primarily in the portfolio table to navigate through monthly snapshots.
 *
 * Based on Nordic Minimal design system.
 */

export interface ColumnToggle {
  id: string;
  label: string;
  visible: boolean;
}

export interface TableFooterProps {
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
  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages: number[] = [];

    // If total pages is small, show all
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first page
    pages.push(1);

    // Show pages around current page
    if (page > 3) {
      pages.push(-1); // Ellipsis marker
    }

    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Show ellipsis before last page if needed
    if (page < totalPages - 2) {
      pages.push(-1); // Ellipsis marker
    }

    // Always show last page
    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="table-footer">
      <div className="table-footer__info">
        Viser {showing} av {total} {unit}
      </div>

      {columnToggles && columnToggles.length > 0 && (
        <div className="table-footer__toggles">
          {columnToggles.map((toggle) => (
            <label key={toggle.id} className="table-footer__toggle">
              <input
                type="checkbox"
                checked={toggle.visible}
                onChange={() => onToggleColumn?.(toggle.id)}
                className="table-footer__checkbox"
              />
              <span className="table-footer__toggle-label">{toggle.label}</span>
            </label>
          ))}
        </div>
      )}

      <div className="table-footer__pagination">
        <button
          className="table-footer__page-btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          ← Forrige
        </button>

        {getPageNumbers().map((pageNum, index) => {
          if (pageNum === -1) {
            return (
              <span key={`ellipsis-${index}`} className="table-footer__ellipsis">
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNum}
              className={`table-footer__page-btn ${
                pageNum === page ? 'table-footer__page-btn--active' : ''
              }`}
              onClick={() => onPageChange(pageNum)}
              aria-label={`Go to page ${pageNum}`}
              aria-current={pageNum === page ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          className="table-footer__page-btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          Neste →
        </button>
      </div>
    </div>
  );
}
