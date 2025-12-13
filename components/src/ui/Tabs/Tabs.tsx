import './Tabs.css'

/**
 * Tabs Component
 *
 * A reusable, accessible tabs component with underline active indicator.
 * Features:
 * - Controlled component (parent manages active state)
 * - Full ARIA accessibility (tablist, tab, aria-selected, etc.)
 * - Mobile-first responsive design
 * - Underline active indicator (editorial style)
 *
 * Based on Nordic Minimal design system.
 */

export interface Tab {
  id: string
  label: string
}

export interface TabsProps {
  /**
   * Array of tab objects with id and label
   */
  tabs: Tab[]

  /**
   * Currently active tab id
   */
  activeTab: string

  /**
   * Callback fired when tab changes
   */
  onChange: (tabId: string) => void

  /**
   * ARIA label for the tablist
   */
  ariaLabel?: string

  /**
   * Optional CSS class name for custom styling
   */
  className?: string
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  ariaLabel,
  className = ''
}: TabsProps) {
  return (
    <div
      className={`tabs ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`tab-${tab.id}`}
          aria-selected={activeTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          className={`tabs__tab ${activeTab === tab.id ? 'tabs__tab--active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
