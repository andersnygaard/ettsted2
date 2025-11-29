import { Link } from 'react-router-dom';
import './Breadcrumb.css';

/**
 * Breadcrumb Component
 *
 * Displays a breadcrumb navigation trail with links.
 * Each item in the path is separated by an arrow.
 * The last item (current page) is not clickable.
 *
 * Based on Nordic Minimal design system.
 */

export interface BreadcrumbItem {
  label: string;
  path?: string; // Optional - last item has no path
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="breadcrumb__item">
            {item.path && !isLast ? (
              <>
                <Link to={item.path} className="breadcrumb__link">
                  {item.label}
                </Link>
                {!isLast && <span className="breadcrumb__separator">→</span>}
              </>
            ) : (
              <span className="breadcrumb__current">{item.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
