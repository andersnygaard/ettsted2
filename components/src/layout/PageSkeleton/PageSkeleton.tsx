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
  className?: string;
  width?: 'default' | 'narrow' | 'wide';
  'aria-busy'?: boolean;
}

export function PageSkeleton({
  children,
  breadcrumb,
  title,
  subtitle,
  className = '',
  width = 'narrow',
  'aria-busy': ariaBusy
}: PageSkeletonProps) {
  const containerClass = `container container--${width}`;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Hopp til hovedinnhold
      </a>
      <main id="main-content" className={`page-skeleton ${className}`} aria-busy={ariaBusy}>
        <div className={containerClass}>
          {breadcrumb && breadcrumb.length > 0 && (
            <Breadcrumb items={breadcrumb} />
          )}

          <PageHeader
            title={title}
            subtitle={subtitle}
          />

          <div className="page-skeleton__content">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
