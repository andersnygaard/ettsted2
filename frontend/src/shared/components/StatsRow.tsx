import './StatsRow.css';

export interface Stat {
  value: string;
  label: string;
}

export interface StatsRowProps {
  stats: Stat[];
}

/**
 * StatsRow Component
 *
 * A 3-column responsive grid of stat items with JetBrains Mono values.
 * Used on feature pages (Sparing, etc.) for key metrics.
 *
 * Based on Nordic Minimal design from draft-1-sparing.html
 */
export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="stats-row">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="stats-row__item"
          style={{ animationDelay: `${0.1 + index * 0.05}s` }}
        >
          <div className="stats-row__value">{stat.value}</div>
          <div className="stats-row__label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
