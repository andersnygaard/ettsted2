import { useNavigate } from 'react-router-dom';
import { StatCard } from '@finans/components';
import './QuickStatsGrid.css';

interface QuickStat {
  value: string;
  label: string;
  href: string;
}

interface QuickStatsGridProps {
  stats: QuickStat[];
}

/**
 * QuickStatsGrid Component
 *
 * Displays 4 quick stat cards in a responsive grid layout.
 * Based on Nordic Minimal design system.
 */
export function QuickStatsGrid({ stats }: QuickStatsGridProps) {
  const navigate = useNavigate();

  return (
    <div className="quick-stats-grid">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`quick-stats-grid__item animate-fade-up animate-delay-${index + 1}`}
        >
          <StatCard
            value={stat.value}
            label={stat.label}
            onClick={() => navigate(stat.href)}
          />
        </div>
      ))}
    </div>
  );
}
