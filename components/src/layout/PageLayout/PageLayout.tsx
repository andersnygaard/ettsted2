import { PageHeader } from '../PageHeader/PageHeader';
import { Breadcrumb } from '../../ui/Breadcrumb';
import type { BreadcrumbItem } from '../../ui/Breadcrumb';
import './PageLayout.css';

/**
 * PageLayout Component
 *
 * Provides consistent page structure across the application.
 * Wraps page content with standard container, breadcrumb, and header layout.
 *
 * Based on Nordic Minimal design system.
 */
export interface PageLayoutProps {
  children: React.ReactNode;
  breadcrumb?: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  className?: string;
  width?: 'default' | 'narrow' | 'wide';
  'aria-busy'?: boolean;
}

export function PageLayout({
  children,
  breadcrumb,
  title,
  subtitle,
  className = '',
  width = 'narrow',
  'aria-busy': ariaBusy
}: PageLayoutProps) {
  const containerClass = `container container--${width}`;

  return (
    <div className={`page-layout ${className}`} aria-busy={ariaBusy}>
      <div className={containerClass}>
        {breadcrumb && breadcrumb.length > 0 && (
          <Breadcrumb items={breadcrumb} />
        )}

        <PageHeader
          title={title}
          subtitle={subtitle}
        />

        <div className="page-layout__content">
          {children}
        </div>
      </div>
    </div>
  );
}
