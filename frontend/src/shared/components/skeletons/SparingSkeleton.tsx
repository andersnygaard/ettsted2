/**
 * Sparing Page Skeleton Loader
 *
 * Matches the layout of SparingPage:
 * - Page header (title + subtitle)
 * - Hero section (total savings + change)
 * - Stats row (3 stat cards)
 * - Fire section (progress tracking)
 * - Area chart
 */

import { Skeleton } from '@finans/components';
import './PageSkeletons.css';

export function SparingSkeleton() {
  return (
    <div className="skeleton-container">
      {/* Page Header */}
      <div className="skeleton-page-header">
        <Skeleton width={200} height={36} />
        <Skeleton width={200} height={14} style={{ marginTop: '8px' }} />
      </div>

      {/* Hero Section */}
      <div className="skeleton-hero-section">
        <Skeleton width={100} height={14} />
        <Skeleton width={280} height={72} style={{ marginTop: '16px' }} />
        <Skeleton width={220} height={24} style={{ marginTop: '12px' }} />
      </div>

      {/* Stats Row */}
      <div className="skeleton-stats-row">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-stat-card">
            <Skeleton height={36} />
            <Skeleton height={12} style={{ marginTop: '8px' }} />
          </div>
        ))}
      </div>

      {/* Fire Section */}
      <div className="skeleton-fire-section">
        <Skeleton width={150} height={16} style={{ marginBottom: '12px' }} />
        <Skeleton height={12} style={{ marginBottom: '16px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Skeleton height={14} style={{ marginBottom: '8px' }} />
              <Skeleton height={24} />
            </div>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="skeleton-chart-section">
        <Skeleton width={180} height={16} style={{ marginBottom: '8px' }} />
        <Skeleton height={200} style={{ marginTop: '12px' }} />
      </div>
    </div>
  );
}
