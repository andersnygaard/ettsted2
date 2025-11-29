import React from 'react';
import './PageHeader.css';

/**
 * Page Header Component
 *
 * Flexible header for page titles with optional subtitle and actions.
 * Supports centered layout (for Oversikt) or left-aligned with right-side actions (for Portefølje).
 *
 * Based on Nordic Minimal design system.
 */

export interface PageHeaderProps {
  /**
   * Page title (required)
   */
  title: string;

  /**
   * Optional subtitle or description text
   */
  subtitle?: string;

  /**
   * If true, centers the title and subtitle (Oversikt style)
   * If false, left-aligns title with optional actions on the right (default, Portefølje style)
   */
  centered?: boolean;

  /**
   * Optional actions to display on the right (buttons, links, etc.)
   * Only used when centered={false}
   */
  actions?: React.ReactNode;
}

/**
 * PageHeader Component
 *
 * Usage:
 * - Centered: <PageHeader title="God morgen, Anders" subtitle="November 2024" centered />
 * - With actions: <PageHeader title="Portefølje" subtitle="Alle data samlet" actions={<button>+ Ny måned</button>} />
 */
export function PageHeader({
  title,
  subtitle,
  centered = false,
  actions,
}: PageHeaderProps) {
  return (
    <div className={`page-header ${centered ? 'page-header--centered' : 'page-header--default'}`}>
      <div className="page-header__content">
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {actions && !centered && <div className="page-header__actions">{actions}</div>}
    </div>
  );
}
