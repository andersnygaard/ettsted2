/**
 * Gjeld Page Skeleton Loader
 *
 * Matches the layout of GjeldPage:
 * - Page header (title + subtitle)
 * - Hero section (total debt + change)
 * - Dekning section (coverage donut + info)
 * - Loans list
 * - Area chart
 */

import { Skeleton } from '../Skeleton';
import './PageSkeletons.css';

export function GjeldSkeleton() {
  return (
    <div className="skeleton-container">
      {/* Page Header */}
      <div className="skeleton-page-header">
        <Skeleton width={150} height={36} />
        <Skeleton width={220} height={14} style={{ marginTop: '8px' }} />
      </div>

      {/* Hero Section */}
      <div className="skeleton-hero-section">
        <Skeleton width={100} height={14} />
        <Skeleton width={260} height={72} style={{ marginTop: '16px' }} />
        <Skeleton width={180} height={24} style={{ marginTop: '12px' }} />
      </div>

      {/* Dekning Section */}
      <div className="skeleton-dekning-section">
        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Donut placeholder */}
          <Skeleton width={120} height={120} variant="circular" />
          {/* Info section */}
          <div style={{ flex: 1 }}>
            <Skeleton width={100} height={14} style={{ marginBottom: '8px' }} />
            <Skeleton width={150} height={20} style={{ marginBottom: '16px' }} />
            <Skeleton height={12} style={{ marginBottom: '8px' }} />
            <Skeleton width={90} height={12} />
          </div>
        </div>
      </div>

      {/* Loans List */}
      <div className="skeleton-loans-list">
        <Skeleton width={120} height={16} style={{ marginBottom: '16px' }} />
        {[1, 2].map((i) => (
          <div key={i} className="skeleton-loan-item">
            <Skeleton height={14} style={{ marginBottom: '8px' }} />
            <Skeleton width={200} height={12} />
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="skeleton-chart-section">
        <Skeleton width={180} height={16} style={{ marginBottom: '8px' }} />
        <Skeleton height={200} style={{ marginTop: '12px' }} />
      </div>
    </div>
  );
}
