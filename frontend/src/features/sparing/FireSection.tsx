import { ProgressBar, formatCurrency, formatNumber } from '@finans/components';
import './FireSection.css';

export interface FireSectionProps {
  /** Target F.I.R.E. number (total needed for financial independence) */
  fireNumber: number;
  /** Current savings toward F.I.R.E. goal */
  current: number;
  /** Minimum age user can retire based on projections */
  minRetireAge: number;
  /** Years until savings equals one year's salary */
  yearsToSalary: number;
  /** Annual withdrawal amount at 4% rule */
  annualWithdrawal: number;
}

/**
 * FireSection Component
 *
 * Displays F.I.R.E. (Financial Independence, Retire Early) progress
 * with a progress bar and 4 key metrics.
 *
 * Based on Nordic Minimal design from draft-1-sparing.html
 */
export function FireSection({
  fireNumber,
  current,
  minRetireAge,
  yearsToSalary,
  annualWithdrawal,
}: FireSectionProps) {
  const percentage = (current / fireNumber) * 100;
  const fireNumberInMillions = fireNumber / 1000000;

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
          leftLabel={`${percentage.toFixed(2).replace('.', ',')}% oppnådd`}
          rightLabel={`${formatNumber(current)} / ${formatCurrency(fireNumber)}`}
        />
      </div>

      <div className="fire-stats">
        <div className="fire-stat">
          <div className="fire-stat__value fire-stat__value--highlight">
            {fireNumberInMillions.toFixed(1).replace('.', ',')}M
          </div>
          <div className="fire-stat__label">Firetall</div>
        </div>
        <div className="fire-stat">
          <div className="fire-stat__value">
            {minRetireAge.toFixed(1).replace('.', ',')}
          </div>
          <div className="fire-stat__label">Min. pensjonsalder</div>
        </div>
        <div className="fire-stat">
          <div className="fire-stat__value">
            {yearsToSalary.toFixed(1).replace('.', ',')}
          </div>
          <div className="fire-stat__label">År til årslønn</div>
        </div>
        <div className="fire-stat">
          <div className="fire-stat__value">{formatNumber(annualWithdrawal)}</div>
          <div className="fire-stat__label">Årlig uttak (4%)</div>
        </div>
      </div>
    </section>
  );
}
