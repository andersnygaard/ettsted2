/**
 * PensionSplitSection Component
 *
 * Progress bar section showing private pension as percentage of total.
 *
 * Based on Nordic Minimal design from draft-1-pensjon.html
 */

import { ProgressBar } from '@finans/components';

export interface OtpSectionProps {
  percentage: number;
  trend?: 'up' | 'down' | 'stable';
}

export function OtpSection({ percentage, trend = 'up' }: OtpSectionProps) {
  const trendText: Record<string, string> = {
    up: 'Trenden er stigende',
    down: 'Trenden er synkende',
    stable: 'Trenden er stabil',
  };

  return (
    <section className="otp-section">
      <div className="otp-header">
        <span className="otp-title">Privat pensjon av total</span>
        <span className="otp-value">{percentage}%</span>
      </div>
      <ProgressBar
        value={percentage}
        variant="default"
        height={12}
        leftLabel="Arbeidsgiver, IPS, egen sparing"
        rightLabel={trendText[trend]}
      />
    </section>
  );
}
