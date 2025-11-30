/**
 * Pensjon Page Skeleton Loader
 *
 * Matches the layout of PensjonPage:
 * - Page header (title + subtitle)
 * - Hero section (total pension + change)
 * - Breakdown cards (2 side-by-side)
 * - OTP section (progress bar)
 * - Stacked area chart
 */

import { Skeleton } from '../Skeleton';
import './PageSkeletons.css';

export function PensjonSkeleton() {
  return (
    <div className="skeleton-container">
      {/* Page Header */}
      <div className="skeleton-page-header">
        <Skeleton width={180} height={36} />
        <Skeleton width={240} height={14} style={{ marginTop: '8px' }} />
      </div>

      {/* Hero Section */}
      <div className="skeleton-hero-section">
        <Skeleton width={100} height={14} />
        <Skeleton width={300} height={72} style={{ marginTop: '16px' }} />
        <Skeleton width={240} height={20} style={{ marginTop: '12px' }} />
      </div>

      {/* Breakdown Cards */}
      <div className="skeleton-breakdown-cards">
        {[1, 2].map((i) => (
          <div key={i} className="skeleton-breakdown-card">
            <Skeleton width={40} height={40} variant="circular" style={{ marginBottom: '12px' }} />
            <Skeleton width={120} height={14} style={{ marginBottom: '8px' }} />
            <Skeleton width={180} height={28} style={{ marginBottom: '8px' }} />
            <Skeleton width={80} height={12} />
          </div>
        ))}
      </div>

      {/* OTP Section */}
      <div className="skeleton-otp-section">
        <Skeleton width={150} height={14} style={{ marginBottom: '12px' }} />
        <Skeleton height={12} style={{ marginBottom: '8px' }} />
        <Skeleton width={80} height={16} style={{ marginTop: '8px' }} />
      </div>

      {/* Chart Area */}
      <div className="skeleton-chart-section">
        <Skeleton width={180} height={16} style={{ marginBottom: '8px' }} />
        <Skeleton height={200} style={{ marginTop: '12px' }} />
      </div>
    </div>
  );
}
