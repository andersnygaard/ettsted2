import { PageHeader } from '../PageHeader/PageHeader';
import { Breadcrumb } from '../../ui/Breadcrumb';
import type { BreadcrumbItem } from '../../ui/Breadcrumb';
import './PageSkeleton.css';

/**
 * PageSkeleton Component
 *
 * Provides consistent page structure across the application.
 * Wraps page content with standard container, breadcrumb, and header layout.
 *
 * Based on Nordic Minimal design system.
 */
export interface PageSkeletonProps {
  children: React.ReactNode;
  breadcrumb?: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  width?: 'default' | 'narrow' | 'wide';
}

export function PageSkeleton({
  children,
  breadcrumb,
  title,
  subtitle,
  centered = false,
  className = '',
  width = 'narrow'
}: PageSkeletonProps) {
  const containerClass = `container container--${width}`;

  return (
    <main className={`page-skeleton ${className}`}>
      <div className={containerClass}>
        {breadcrumb && breadcrumb.length > 0 && (
          <Breadcrumb items={breadcrumb} />
        )}

        <PageHeader
          title={title}
          subtitle={subtitle}
          centered={centered}
        />

        <div className="page-skeleton__content">
          {children}
        </div>
      </div>
    </main>
  );
}
