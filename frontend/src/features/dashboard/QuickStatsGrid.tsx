import { StatCard } from '@/shared/components';
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
 *
 * Features:
 * - 4 columns on desktop
 * - 2 columns on tablet (max-width: 1024px)
 * - 1 column on mobile (max-width: 600px)
 * - Staggered fade-up animations
 */
export function QuickStatsGrid({ stats }: QuickStatsGridProps) {
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
            href={stat.href}
          />
        </div>
      ))}
    </div>
  );
}
