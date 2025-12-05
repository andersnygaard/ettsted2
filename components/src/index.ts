// @finans/components
// Barrel export for all shared components

// UI Components
export { Button } from './ui/Button'
export type { ButtonProps } from './ui/Button'

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

// Form Components
export { NumberInput } from './forms/NumberInput'
export type { NumberInputProps } from './forms/NumberInput'

export { DateInput } from './forms/DateInput'
export type { DateInputProps } from './forms/DateInput'

export { ProgressBar } from './forms/ProgressBar'
export type { ProgressBarProps } from './forms/ProgressBar'

// Form Utilities
export { formatNumber, parseNumber } from './forms/utils/numberFormat'
export { formatDate, parseNorwegianDate, getFirstDayOfMonth } from './forms/utils/dateFormat'

// Data Display Components
export { HeroNumber } from './data/HeroNumber'
export type { HeroNumberProps } from './data/HeroNumber'

export { StatCard } from './data/StatCard'
export type { StatCardProps } from './data/StatCard'

export { MilestoneCard } from './data/MilestoneCard'
export type { MilestoneCardProps } from './data/MilestoneCard'

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

// Layout Components
export { SectionLink } from './layout/SectionLink'
export type { SectionLinkProps } from './layout/SectionLink'

export { CalculatorCard } from './layout/CalculatorCard'
export type { CalculatorCardProps } from './layout/CalculatorCard'

export { PageHeader } from './layout/PageHeader/PageHeader'
export type { PageHeaderProps } from './layout/PageHeader/PageHeader'

// System Components
export { ToastProvider, useToast } from './system/Toast'
export type { Toast, ToastType } from './system/Toast'

export { ErrorBoundary } from './system/ErrorBoundary'

// Base Utilities
export { formatCurrency } from './utils/format'
export { formatNumber as formatNumberUtil, parseNumber as parseNumberUtil, formatPercentage } from './utils/numberFormat'
