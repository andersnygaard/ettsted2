import { useState } from 'react';
import { ProgressBar, formatCurrency, formatNumber, formatPercentage } from '@finans/components';
import './FireSection.css';

export interface FireSectionProps {
  /** Target F.I.R.E. number (total needed for financial independence) */
  fireNumber: number;
  /** Current savings toward F.I.R.E. goal */
  current: number;
  /** Months of expenses covered by 4% annual withdrawal */
  monthsCovered: number;
  /** Years until savings equals one year's salary */
  yearsToSalary: number;
  /** Annual withdrawal amount at 4% rule */
  annualWithdrawal: number;
}

interface StatConfig {
  id: string;
  value: string;
  label: string;
  explanation: string;
  highlight?: boolean;
}

/**
 * FireStat Component
 *
 * Individual metric card - controlled by parent for single-select behavior
 */
interface FireStatProps {
  stat: StatConfig;
  isActive: boolean;
  onToggle: () => void;
}

function FireStat({ stat, isActive, onToggle }: FireStatProps) {
  return (
    <div className={`fire-stat ${isActive ? 'fire-stat--active' : ''}`}>
      <button
        className="fire-stat__button"
        onClick={onToggle}
        aria-expanded={isActive}
        aria-label={`${stat.label}: ${stat.value}. Trykk for mer informasjon`}
      >
        <div className={`fire-stat__value ${stat.highlight ? 'fire-stat__value--highlight' : ''}`}>
          {stat.value}
        </div>
        <div className="fire-stat__label">{stat.label}</div>
        <svg
          className={`fire-stat__icon ${isActive ? 'fire-stat__icon--expanded' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          aria-hidden="true"
        >
          <path d="M6 8L2 4h8z" fill="currentColor" />
        </svg>
      </button>
      {isActive && <div className="fire-stat__marker" aria-hidden="true" />}
    </div>
  );
}

/**
 * FireSection Component
 *
 * Displays F.I.R.E. (Financial Independence, Retire Early) progress
 * with a progress bar and 4 key metrics. Only one explanation can be
 * expanded at a time, displayed as a full-width dropdown below the stats.
 *
 * Based on Nordic Minimal design from draft-1-sparing.html
 */
export function FireSection({
  fireNumber,
  current,
  monthsCovered,
  yearsToSalary,
  annualWithdrawal,
}: FireSectionProps) {
  const [activeStatId, setActiveStatId] = useState<string | null>(null);

  const percentage = fireNumber > 0 ? (current / fireNumber) * 100 : 0;
  const fireNumberInMillions = fireNumber > 0 ? fireNumber / 1000000 : 0;

  // Format values with proper handling of edge cases
  const monthsCoveredFormatted = monthsCovered === 0 ? '—' : formatNumber(monthsCovered, 1);
  const yearsToSalaryFormatted =
    yearsToSalary === Infinity || yearsToSalary >= 100 ? '—' : formatNumber(yearsToSalary, 1);

  const stats: StatConfig[] = [
    {
      id: 'firetall',
      value: `${formatNumber(fireNumberInMillions, 1)}M`,
      label: 'Firetall',
      explanation:
        '25x årlige utgifter. Ved dette beløpet kan du ta ut 4% årlig i ubegrenset tid (4%-regelen).',
      highlight: true,
    },
    {
      id: 'maneder-dekket',
      value: monthsCoveredFormatted,
      label: 'Måneder dekket/år',
      explanation:
        'Antall måneder av utgifter dekket av årlig 4%-uttak. Ved 12 måneder er du økonomisk uavhengig.',
    },
    {
      id: 'arslonn',
      value: yearsToSalaryFormatted,
      label: 'År til årslønn',
      explanation:
        yearsToSalary === Infinity || yearsToSalary >= 100
          ? 'Kan ikke beregnes med nåværende sparerate. Øk månedlig sparing for å nå målet.'
          : 'Antall år det tar å spare én årslønn med din sparerate. Formel: 1 / sparerate.',
    },
    {
      id: 'uttak',
      value: formatNumber(annualWithdrawal),
      label: 'Årlig uttak (4%)',
      explanation:
        'Beløpet du kan ta ut årlig fra nåværende sparing ved 4%-regelen. Dette er en bærekraftig uttaksrate basert på historiske markedsdata.',
    },
  ];

  const activeStat = stats.find((s) => s.id === activeStatId);

  const handleToggle = (id: string) => {
    setActiveStatId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="fire-section">
      <div className="fire-header">
        <h2>F.I.R.E. Fremgang</h2>
        <p>Financial Independence, Retire Early</p>
      </div>

      <div className="fire-progress">
        <ProgressBar
          value={percentage}
          variant="default"
          height={20}
          leftLabel={`${formatPercentage(percentage / 100)} oppnådd`}
          rightLabel={`${formatNumber(current)} / ${formatCurrency(fireNumber)}`}
        />
      </div>

      <div className="fire-stats">
        {stats.map((stat) => (
          <FireStat
            key={stat.id}
            stat={stat}
            isActive={activeStatId === stat.id}
            onToggle={() => handleToggle(stat.id)}
          />
        ))}
      </div>

      {activeStat && (
        <div className="fire-explanation" role="region" aria-live="polite">
          <div className="fire-explanation__content">{activeStat.explanation}</div>
        </div>
      )}
    </section>
  );
}
