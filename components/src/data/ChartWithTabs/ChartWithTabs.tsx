import { useState, useMemo } from 'react';
import { AreaChart } from '../../charts/AreaChart/AreaChart';
import { StackedAreaChart } from '../../charts/StackedAreaChart/StackedAreaChart';
import { TimeRangeSelector, type TimeRange } from '../TimeRangeSelector/TimeRangeSelector';
import { Tabs } from '../../ui/Tabs';
import type { DataPoint } from '../../charts/AreaChart/AreaChart';
import type { StackedDataPoint, Series } from '../../charts/StackedAreaChart/StackedAreaChart';
import './ChartWithTabs.css';

export interface ChartAccount {
  id: string;
  name: string;
}

export interface ChartWithTabsProps {
  /**
   * Historical snapshot data with per-account values
   */
  data: StackedDataPoint[];

  /**
   * List of accounts to display in Per Konto view
   */
  accounts: ChartAccount[];

  /**
   * Chart title
   */
  title: string;

  /**
   * Subtitle for Totalt view (optional)
   */
  subtitle?: string;

  /**
   * Chart height in pixels
   */
  height?: number;

  /**
   * Color for Totalt view (single line)
   */
  totalColor?: string;

  /**
   * Color palette for Per Konto view (stacked areas)
   * If not provided, uses default palette
   */
  accountColors?: Record<string, string>;

  /**
   * Optional: Use stacked area for Totalt view instead of single line
   * Requires totalStackedSeries to be provided
   */
  totalStacked?: boolean;

  /**
   * Series configuration for stacked Totalt view
   * Only used when totalStacked is true
   */
  totalStackedSeries?: Series[];
}

/**
 * ChartWithTabs Component
 *
 * Reusable wrapper for historical charts with tab switching:
 * - "Totalt" tab: Shows aggregated single-line chart
 * - "Per konto" tab: Shows stacked area chart with per-account breakdown
 *
 * Used on Sparing, Gjeld, and Pensjon pages.
 */
export function ChartWithTabs({
  data,
  accounts,
  title,
  subtitle,
  height = 200,
  totalColor = 'var(--muted-sage)',
  accountColors,
  totalStacked = false,
  totalStackedSeries
}: ChartWithTabsProps) {
  const [activeTab, setActiveTab] = useState<'totalt' | 'per-konto'>('totalt');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');

  // Generate default color palette if not provided
  const defaultColors = [
    'var(--pale-blue)',
    'var(--muted-sage)',
    'var(--soft-terracotta)',
    'var(--orange)',
    'var(--gold)'
  ];

  // Build color map for accounts
  const colorMap = accountColors || accounts.reduce((map, account, index) => {
    map[account.id] = defaultColors[index % defaultColors.length];
    return map;
  }, {} as Record<string, string>);

  // Filter data based on time range
  const filteredData = useMemo(() => {
    if (timeRange === 'all' || data.length === 0) return data;

    const now = new Date();
    let cutoffDate: Date;

    if (timeRange === 'ytd') {
      // Year to date: from Jan 1st of current year
      cutoffDate = new Date(now.getFullYear(), 0, 1);
    } else {
      // Calculate cutoff date based on months
      const months = timeRange === '1yr' ? 12 : timeRange === '3yr' ? 36 : 60;
      cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - months);
    }

    return data.filter((point) => point.date >= cutoffDate);
  }, [data, timeRange]);

  // Calculate number of months of available data
  const dataMonthsCount = useMemo(() => {
    if (data.length === 0) return 0;
    const earliest = data[0].date;
    const latest = data[data.length - 1].date;
    const diffTime = Math.abs(latest.getTime() - earliest.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  }, [data]);

  // Calculate total values for Totalt view (using filtered data)
  const totalData: DataPoint[] = filteredData.map((point) => {
    // Sum all account values for this date
    const total = accounts.reduce((sum, account) => {
      const value = point[account.id] as number;
      return sum + (value || 0);
    }, 0);

    return {
      date: point.date,
      value: total
    };
  });

  // Build series config for Per Konto view
  const series: Series[] = accounts.map((account) => ({
    key: account.id,
    color: colorMap[account.id] || 'var(--charcoal)',
    label: account.name
  }));

  return (
    <section className="chart-with-tabs">
      {/* Tab buttons */}
      <Tabs
        tabs={[
          { id: 'totalt', label: 'Totalt' },
          { id: 'per-konto', label: 'Per konto' }
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
        ariaLabel={`${title} visning`}
      />

      {/* Tab panels */}
      <div className="chart-with-tabs__content">
        {/* Totalt view */}
        {activeTab === 'totalt' && (
          <div
            role="tabpanel"
            id="chart-totalt"
            aria-labelledby="tab-totalt"
            className="chart-with-tabs__panel"
          >
            {totalStacked && totalStackedSeries ? (
              <StackedAreaChart
                data={filteredData}
                series={totalStackedSeries}
                title={title}
                height={height}
              />
            ) : (
              <AreaChart
                data={totalData}
                title={title}
                subtitle={subtitle}
                color={totalColor}
                height={height}
              />
            )}
          </div>
        )}

        {/* Per konto view */}
        {activeTab === 'per-konto' && (
          <div
            role="tabpanel"
            id="chart-per-konto"
            aria-labelledby="tab-per-konto"
            className="chart-with-tabs__panel"
          >
            <StackedAreaChart
              data={filteredData}
              series={series}
              title={title}
              height={height}
            />
          </div>
        )}
      </div>

      {/* Time range selector - positioned below chart */}
      <TimeRangeSelector
        selected={timeRange}
        onChange={setTimeRange}
        dataMonthsCount={dataMonthsCount}
      />
    </section>
  );
}
