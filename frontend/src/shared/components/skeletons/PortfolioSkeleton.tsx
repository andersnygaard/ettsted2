/**
 * Portfolio Page Skeleton Loader
 *
 * Matches the layout of PortfolioPage:
 * - Breadcrumb
 * - Page header with title and buttons
 * - Table header with filters
 * - Spreadsheet table rows
 * - Table footer with pagination
 */

import { Skeleton } from '@finans/components';
import './PageSkeletons.css';

export function PortfolioSkeleton() {
  return (
    <div className="skeleton-container">
      {/* Breadcrumb */}
      <div className="skeleton-breadcrumb">
        <Skeleton width={120} height={14} />
      </div>

      {/* Page Header */}
      <div className="skeleton-page-header">
        <Skeleton width={200} height={36} style={{ marginBottom: '8px' }} />
        <Skeleton width={280} height={14} />
      </div>

      {/* Page Actions */}
      <div className="skeleton-page-actions">
        <Skeleton width={120} height={36} />
        <Skeleton width={140} height={36} />
      </div>

      {/* Table Header */}
      <div className="skeleton-table-header">
        <Skeleton width={160} height={16} style={{ marginBottom: '12px' }} />
        <div style={{ display: 'flex', gap: '16px' }}>
          <Skeleton width={120} height={32} />
          <Skeleton width={200} height={32} />
        </div>
      </div>

      {/* Table Rows */}
      <div className="skeleton-table-body">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-table-row">
            <Skeleton height={24} />
          </div>
        ))}
      </div>

      {/* Table Footer */}
      <div className="skeleton-table-footer">
        <Skeleton width={150} height={14} style={{ marginBottom: '12px' }} />
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
          <Skeleton width={100} height={24} />
          <Skeleton width={150} height={24} />
        </div>
      </div>
    </div>
  );
}
