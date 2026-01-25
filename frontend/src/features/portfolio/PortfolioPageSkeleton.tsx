import { PageLayout, Skeleton } from '@finans/components';
import '@/shared/styles/PageSkeletons.css';

export function PortfolioPageSkeleton() {
  return (
    <PageLayout
      breadcrumb={[{ label: 'Hjem', path: '/oversikt' }, { label: 'Portefølje' }]}
      title="Portefølje"
      subtitle="Laster..."
      width="wide"
      className="portfolio-page"
      aria-busy={true}
    >
      <div role="status" aria-live="polite" className="sr-only">
        Laster porteføljdata...
      </div>

      {/* Skeleton: Breadcrumb */}
      <div className="skeleton-breadcrumb">
        <Skeleton width={120} height={14} />
      </div>

      {/* Skeleton: Page Header */}
      <div className="skeleton-page-header">
        <Skeleton width={200} height={36} style={{ marginBottom: '8px' }} />
        <Skeleton width={280} height={14} />
      </div>

      {/* Skeleton: Page Actions */}
      <div className="skeleton-page-actions">
        <Skeleton width={120} height={36} />
        <Skeleton width={140} height={36} />
      </div>

      {/* Skeleton: Table Header */}
      <div className="skeleton-table-header">
        <Skeleton width={160} height={16} style={{ marginBottom: '12px' }} />
        <div style={{ display: 'flex', gap: '16px' }}>
          <Skeleton width={120} height={32} />
          <Skeleton width={200} height={32} />
        </div>
      </div>

      {/* Skeleton: Table Rows */}
      <div className="skeleton-table-body">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-table-row">
            <Skeleton height={24} />
          </div>
        ))}
      </div>

      {/* Skeleton: Table Footer */}
      <div className="skeleton-table-footer">
        <Skeleton width={150} height={14} style={{ marginBottom: '12px' }} />
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
          <Skeleton width={100} height={24} />
          <Skeleton width={150} height={24} />
        </div>
      </div>
    </PageLayout>
  );
}
