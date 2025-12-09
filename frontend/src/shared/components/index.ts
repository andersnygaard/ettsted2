/**
 * Shared Components Export
 *
 * This barrel export provides backward compatibility by re-exporting from @finans/components.
 * New code should import directly from @finans/components.
 *
 * Components that are frontend-specific (not in @finans/components) are exported directly below.
 */

// Re-export from @finans/components (consolidated components)
export {
  AreaChart,
  type AreaChartProps,
  type DataPoint,
  Button,
  type ButtonProps,
  Card,
  type CardProps,
  Container,
  type ContainerProps,
  Avatar,
  type AvatarProps,
  HeroNumber,
  type HeroNumberProps,
  MilestoneCard,
  type MilestoneCardProps,
  ProgressBar,
  type ProgressBarProps,
  SectionLink,
  type SectionLinkProps,
  StatsRow,
  type Stat,
  type StatsRowProps,
  ToastProvider,
  useToast,
  type Toast,
  type ToastType,
  SpreadsheetTable,
  type SpreadsheetTableProps,
  type ColumnGroup,
  type Column,
  type CellChangeEvent,
  TableHeader,
  type TableHeaderProps,
  TableFooter,
  type TableFooterProps,
  type ColumnToggle,
  NumberInput,
  type NumberInputProps,
  DateInput,
  type DateInputProps,
  CalculatorCard,
  type CalculatorCardProps,
  DonutChart,
  type DonutChartProps,
  StackedAreaChart,
  type StackedAreaChartProps,
  type Series,
  type StackedDataPoint,
  Skeleton,
  type SkeletonProps,
  ErrorBoundary,
} from '@finans/components';

// Frontend-specific components (not in @finans/components)
export { default as AppHeader } from './AppHeader';
export { default as Layout } from './Layout';
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as FeatureErrorFallback } from './FeatureErrorFallback';
export { AvatarMenu } from './AvatarMenu';
export type { AvatarMenuProps } from './AvatarMenu';
export { DashboardSkeleton, PortfolioSkeleton, SparingSkeleton, GjeldSkeleton, PensjonSkeleton } from './skeletons';
