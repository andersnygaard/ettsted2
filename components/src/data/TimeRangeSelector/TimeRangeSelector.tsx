import './TimeRangeSelector.css';

export type TimeRange = 'ytd' | '1yr' | '3yr' | '5yr' | 'all';

export interface TimeRangeOption {
  key: TimeRange;
  label: string;
  months: number | null; // null for 'all'
}

export interface TimeRangeSelectorProps {
  /**
   * Currently selected time range
   */
  selected: TimeRange;

  /**
   * Callback when time range changes
   */
  onChange: (range: TimeRange) => void;

  /**
   * Number of months of available data
   * Used to determine which options to show
   */
  dataMonthsCount: number;
}

/**
 * TimeRangeSelector Component
 *
 * Time range selector buttons for financial charts (YTD, 1 år, 3 år, 5 år, Alle).
 * Only shows options where sufficient data exists.
 *
 * Mobile-first design with touch-friendly buttons.
 */
export function TimeRangeSelector({ selected, onChange, dataMonthsCount }: TimeRangeSelectorProps) {
  // All possible time range options
  const allOptions: TimeRangeOption[] = [
    { key: 'ytd', label: 'YTD', months: getYTDMonths() },
    { key: '1yr', label: '1 år', months: 12 },
    { key: '3yr', label: '3 år', months: 36 },
    { key: '5yr', label: '5 år', months: 60 },
    { key: 'all', label: 'Alle', months: null },
  ];

  // Filter options based on available data
  const availableOptions = allOptions.filter((option) => {
    if (option.months === null) return true; // 'Alle' always available
    return dataMonthsCount >= option.months;
  });

  return (
    <div className="time-range-selector" role="group" aria-label="Velg tidsperiode">
      {availableOptions.map((option) => (
        <button
          key={option.key}
          type="button"
          className={`time-range-selector__button ${
            selected === option.key ? 'time-range-selector__button--active' : ''
          }`}
          onClick={() => onChange(option.key)}
          aria-pressed={selected === option.key}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Calculate how many months YTD represents
 */
function getYTDMonths(): number {
  const now = new Date();
  return now.getMonth() + 1; // 0-indexed, so add 1
}
