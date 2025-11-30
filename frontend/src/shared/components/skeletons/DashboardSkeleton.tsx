/**
 * Dashboard Page Skeleton Loader
 *
 * Matches the layout of DashboardPage:
 * - Page header (title + subtitle)
 * - Hero section (net worth value + change)
 * - Quick stats grid (4 stat cards)
 * - Milestone section (progress bar)
 * - Section links (3 navigation cards)
 */

import { Skeleton } from '../Skeleton';
import './PageSkeletons.css';

export function DashboardSkeleton() {
  return (
    <div className="skeleton-container">
      {/* Page Header */}
      <div className="skeleton-page-header">
        <Skeleton width={250} height={36} />
        <Skeleton width={180} height={20} />
      </div>

      {/* Hero Section */}
      <div className="skeleton-hero-section">
        <Skeleton width={120} height={14} />
        <Skeleton width={300} height={72} style={{ marginTop: '16px' }} />
        <Skeleton width={200} height={28} style={{ marginTop: '12px' }} />
      </div>

      {/* Quick Stats Grid */}
      <div className="skeleton-quick-stats">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-stat-card">
            <Skeleton height={40} />
            <Skeleton height={12} style={{ marginTop: '8px' }} />
          </div>
        ))}
      </div>

      {/* Milestone Section */}
      <div className="skeleton-milestone-section">
        <Skeleton width={150} height={14} style={{ marginBottom: '8px' }} />
        <Skeleton width={200} height={48} style={{ marginBottom: '16px' }} />
        <Skeleton height={12} style={{ marginBottom: '8px' }} />
        <div style={{ display: 'flex', gap: '16px' }}>
          <Skeleton width={200} height={14} />
          <Skeleton width={50} height={14} />
        </div>
      </div>

      {/* Section Links */}
      <div className="skeleton-section-links">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-section-link">
            <div>
              <Skeleton width={120} height={16} style={{ marginBottom: '8px' }} />
              <Skeleton width={180} height={14} />
            </div>
            <Skeleton width={20} height={20} variant="rectangular" />
          </div>
        ))}
      </div>
    </div>
  );
}
