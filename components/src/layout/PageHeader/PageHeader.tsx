import './PageHeader.css';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  reduced?: boolean;
}

export function PageHeader({ title, subtitle, reduced }: PageHeaderProps) {
  return (
    <header className="page-header">
      <h1 className={`page-header__title ${reduced ? 'reduced' : ''}`}>{title}</h1>
      {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
    </header>
  );
}
