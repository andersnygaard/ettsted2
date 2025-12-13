// @finans/components
// Barrel export for all shared components

// UI Components
export { Button } from './ui/Button'
export type { ButtonProps } from './ui/Button'

export { Icon } from './ui/Icon'
export type { IconProps, IconName } from './ui/Icon'

export { Card } from './ui/Card'
export type { CardProps } from './ui/Card'

export { Container } from './layout/Container'
export type { ContainerProps } from './layout/Container'

export { Avatar } from './ui/Avatar'
export type { AvatarProps } from './ui/Avatar'

export { Modal } from './ui/Modal'
export type { ModalProps } from './ui/Modal'

export { Skeleton } from './ui/Skeleton'
export type { SkeletonProps } from './ui/Skeleton'

export { Breadcrumb } from './ui/Breadcrumb'
export type { BreadcrumbProps, BreadcrumbItem } from './ui/Breadcrumb'

export { Placeholder } from './ui/Placeholder'
export type { PlaceholderProps } from './ui/Placeholder'

export { Tooltip } from './ui/Tooltip'
export type { TooltipProps } from './ui/Tooltip'

export { Tabs } from './ui/Tabs'
export type { TabsProps, Tab } from './ui/Tabs'

// Form Components
export { NumberInput } from './forms/NumberInput'
export type { NumberInputProps } from './forms/NumberInput'

export { DateInput } from './forms/DateInput'
export type { DateInputProps } from './forms/DateInput'

export { ProgressBar } from './forms/ProgressBar'
export type { ProgressBarProps } from './forms/ProgressBar'

// Form Utilities
export { formatCurrency, formatNumber, parseNumber, formatPercentage } from './forms/utils/numberFormat'
export { formatDate, parseDate, parseNorwegianDate, toISOString, fromISOString, formatDateLong, getFirstDayOfMonth } from './forms/utils/dateFormat'

// Cards
export { BreakdownCard } from './cards/BreakdownCard'
export type { BreakdownCardProps } from './cards/BreakdownCard'

export { StatCard } from './cards/StatCard'
export type { StatCardProps } from './cards/StatCard'

export { CalculatorCard } from './cards/CalculatorCard'
export type { CalculatorCardProps } from './cards/CalculatorCard'

export { MilestoneCard } from './cards/MilestoneCard'
export type { MilestoneCardProps } from './cards/MilestoneCard'

// Data Display Components
export { HeroNumber } from './data/HeroNumber'
export type { HeroNumberProps } from './data/HeroNumber'

export { StatsRow } from './data/StatsRow'
export type { StatsRowProps, Stat } from './data/StatsRow'

export { SpreadsheetTable } from './data/SpreadsheetTable'
export type {
  SpreadsheetTableProps,
  Column,
  ColumnGroup,
  CellChangeEvent,
} from './data/SpreadsheetTable'

export { TableHeader } from './data/TableHeader'
export type { TableHeaderProps } from './data/TableHeader'

export { TableFooter } from './data/TableFooter'
export type { TableFooterProps, ColumnToggle } from './data/TableFooter'

export { ChartWithTabs } from './data/ChartWithTabs'
export type { ChartWithTabsProps, ChartAccount } from './data/ChartWithTabs'

export { TimeRangeSelector } from './data/TimeRangeSelector'
export type { TimeRangeSelectorProps, TimeRange, TimeRangeOption } from './data/TimeRangeSelector'

// Chart Components
export { AreaChart } from './charts/AreaChart'
export type { AreaChartProps, DataPoint } from './charts/AreaChart'

export { StackedAreaChart } from './charts/StackedAreaChart'
export type {
  StackedAreaChartProps,
  Series,
  StackedDataPoint,
} from './charts/StackedAreaChart'

export { DonutChart } from './charts/DonutChart'
export type { DonutChartProps } from './charts/DonutChart'

export { ChartTooltip } from './charts/ChartTooltip'
export type { ChartTooltipProps, TooltipValue } from './charts/ChartTooltip'

// Layout Components
export { SectionLink } from './layout/SectionLink'
export type { SectionLinkProps } from './layout/SectionLink'

export { PageHeader } from './layout/PageHeader/PageHeader'
export type { PageHeaderProps } from './layout/PageHeader/PageHeader'

export { PageSkeleton } from './layout/PageSkeleton'
export type { PageSkeletonProps } from './layout/PageSkeleton'

// System Components
export { ToastProvider, useToast } from './system/Toast'
export type { Toast, ToastType } from './system/Toast'

export { ErrorBoundary } from './system/ErrorBoundary'


// Hooks
export { useCountAnimation } from './hooks/useCountAnimation'
export type { UseCountAnimationOptions } from './hooks/useCountAnimation'
