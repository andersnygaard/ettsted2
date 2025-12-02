import { Link } from 'react-router-dom';
import './SectionLink.css';

/**
 * SectionLink Component
 *
 * Navigation card with title, subtitle, and arrow indicator.
 * Used for high-level navigation between major application sections.
 *
 * Based on Nordic Minimal design system.
 */
export interface SectionLinkProps {
  title: string;
  subtitle: string;
  href: string;
}

export function SectionLink({ title, subtitle, href }: SectionLinkProps) {
  return (
    <Link to={href} className="section-link">
      <div className="section-link__content">
        <div className="section-link__title">{title}</div>
        <div className="section-link__subtitle">{subtitle}</div>
      </div>
      <span className="section-link__arrow">→</span>
    </Link>
  );
}
