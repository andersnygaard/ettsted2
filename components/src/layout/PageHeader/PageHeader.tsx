import './PageHeader.css';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  reduced?: boolean;
  centered?: boolean;
}

export function PageHeader({ title, subtitle, reduced, centered = false }: PageHeaderProps) {
  return (
    <header className={`page-header ${centered ? 'page-header--centered' : ''}`}>
      <h1 className={`page-header__title ${reduced ? 'reduced' : ''}`}>{title}</h1>
      {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
    </header>
  );
}
