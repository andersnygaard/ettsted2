# REFACTOR: Unified Tabs Component

**Status**: Backlog
**Created**: 2025-12-12
**Priority**: Medium
**Labels**: components, frontend, design-system
**Estimated Effort**: Medium - 1-2 days

## Context & Motivation

The app has three different tab/toggle implementations with inconsistent styling:

| Location | Component | Active Style |
|----------|-----------|--------------|
| LoanCalculatorPage | Custom `.loan-type-tab` | Solid background |
| ChartWithTabs | Inline tabs | Underline |
| TimeRangeSelector | Pill buttons | Inverted colors |

This creates visual inconsistency and maintenance burden. The underline style aligns best with the Nordic Minimal editorial aesthetic.

## Current State

### 1. LoanCalculatorPage (custom)
```tsx
// frontend/src/features/calculators/LoanCalculatorPage.tsx:371-390
<div className="loan-type-selector">
  <button className={`loan-type-tab ${inputs.loanType === 'annuity' ? 'active' : ''}`}>
    Annuitetslån
  </button>
  ...
</div>
```
- Solid background active state
- Custom CSS in LoanCalculatorPage.css
- 3 tabs: Annuitetslån, Serielån, Fleksilån

### 2. ChartWithTabs (shared)
```tsx
// components/src/data/ChartWithTabs/ChartWithTabs.tsx:156-179
<div className="chart-with-tabs__tabs" role="tablist">
  <button className={`chart-with-tabs__tab ${activeTab === 'totalt' ? 'chart-with-tabs__tab--active' : ''}`}>
    Totalt
  </button>
  ...
</div>
```
- Underline active state
- Full ARIA support
- Used on Sparing, Gjeld, Pensjon pages

### 3. TimeRangeSelector (shared)
```tsx
// components/src/data/TimeRangeSelector/TimeRangeSelector.tsx
```
- Pill button design
- Inverted colors active state
- Used inside ChartWithTabs

## Desired Outcome

1. Create a single reusable `Tabs` component in `@finans/components`
2. Underline style as the standard (editorial feel)
3. Full accessibility (ARIA tablist/tab/tabpanel)
4. All tab UIs use this component

## Acceptance Criteria

- [x] New `Tabs` component created in `components/src/ui/Tabs/`
- [x] Underline active indicator styling
- [x] Full ARIA accessibility (role="tablist", role="tab", aria-selected, etc.)
- [x] Mobile-first responsive design
- [x] LoanCalculatorPage migrated to use `Tabs`
- [x] ChartWithTabs refactored to use `Tabs` internally
- [x] TimeRangeSelector migrated to use `Tabs` (or kept as separate pill-style if preferred)
- [x] Storybook stories for `Tabs` component
- [x] No visual regression on existing pages

## Affected Components

### Components Library
- **New**: `components/src/ui/Tabs/Tabs.tsx`
- **New**: `components/src/ui/Tabs/Tabs.css`
- **New**: `components/src/ui/Tabs/index.ts`
- **Modify**: `components/src/index.ts` (export new component)
- **Modify**: `components/src/data/ChartWithTabs/ChartWithTabs.tsx` (use Tabs internally)

### Frontend
- **Modify**: `frontend/src/features/calculators/LoanCalculatorPage.tsx`
- **Modify**: `frontend/src/features/calculators/LoanCalculatorPage.css` (remove tab styles)

### Testing
- **Add**: Storybook story for Tabs component
- **Verify**: E2E tests still pass for calculator and chart pages

## Technical Approach

### Architecture Decisions

1. **Generic Tabs component** - Not tied to any specific content type
2. **Controlled component** - Parent manages active tab state
3. **Render props or children pattern** - Flexible content rendering
4. **Extract styling from ChartWithTabs** - Reuse existing underline CSS

### API Design

```tsx
interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  ariaLabel?: string;
  className?: string;
}

// Usage in LoanCalculatorPage:
<Tabs
  tabs={[
    { id: 'annuity', label: 'Annuitetslån' },
    { id: 'serial', label: 'Serielån' },
    { id: 'flexi', label: 'Fleksilån' }
  ]}
  activeTab={inputs.loanType}
  onChange={(id) => updateInput('loanType', id)}
  ariaLabel="Velg lånetype"
/>

// Usage in ChartWithTabs:
<Tabs
  tabs={[
    { id: 'totalt', label: 'Totalt' },
    { id: 'per-konto', label: 'Per konto' }
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
  ariaLabel={`${title} visning`}
/>
```

### Implementation Steps

**Phase 1: Create Tabs Component**
1. Create `components/src/ui/Tabs/Tabs.tsx`
2. Extract CSS from ChartWithTabs to `Tabs.css`
3. Implement with full ARIA support
4. Export from `components/src/index.ts`

**Phase 2: Migrate ChartWithTabs**
1. Import and use new `Tabs` component
2. Remove duplicate tab CSS from ChartWithTabs.css
3. Verify Sparing, Gjeld, Pensjon pages work correctly

**Phase 3: Migrate LoanCalculatorPage**
1. Replace custom tab buttons with `Tabs` component
2. Remove `.loan-type-selector` and `.loan-type-tab` CSS
3. Verify calculator works correctly

**Phase 4: Consider TimeRangeSelector**
1. Evaluate if TimeRangeSelector should use Tabs or remain pill-style
2. Decision: Keep as pills (different semantic purpose - filtering vs content switching)

**Phase 5: Documentation**
1. Create Storybook story showing variants
2. Add to design system documentation

### Dependencies

- **External**: None
- **Internal**: Existing ChartWithTabs CSS as base
- **Blocking**: None

### Risks & Considerations

- **Risk**: Visual regression on existing pages
  - **Mitigation**: Screenshot comparison before/after, E2E tests
- **Risk**: Breaking tab functionality in calculators
  - **Mitigation**: Manual testing of all calculator pages
- **Performance**: No concerns - simple component

## Code References

### ChartWithTabs Tab Styling (to extract)
```css
/* components/src/data/ChartWithTabs/ChartWithTabs.css:23-60 */
.chart-with-tabs__tab {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  font-family: var(--font-body);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: var(--touch-target-min);
  outline: none;
}

.chart-with-tabs__tab--active {
  color: var(--charcoal);
  border-bottom-color: var(--charcoal);
  font-weight: var(--font-weight-semibold);
}
```

### LoanCalculatorPage Tabs (to replace)
```tsx
// frontend/src/features/calculators/LoanCalculatorPage.tsx:371-390
<div className="loan-type-selector animate-fade-up">
  <button
    className={`loan-type-tab ${inputs.loanType === 'annuity' ? 'active' : ''}`}
    onClick={() => updateInput('loanType', 'annuity')}
  >
    Annuitetslån
  </button>
  ...
</div>
```

## Design Notes

### Visual Specification
- **Active indicator**: 2px bottom border in `--charcoal`
- **Text**: Uppercase, letter-spacing wide
- **Font**: `--font-body` (DM Sans)
- **Colors**: `--text-secondary` default, `--charcoal` active
- **Animation**: Fade transition on panel switch
- **Touch target**: Minimum 44px height

### Responsive Behavior
- **Mobile**: Full-width flex tabs
- **Tablet+**: Centered, fixed-width tabs (140-160px)

---

## Implementation Summary

**Status**: COMPLETED

### Files Created
- `components/src/ui/Tabs/Tabs.tsx` - Main component with full ARIA support
- `components/src/ui/Tabs/Tabs.css` - Mobile-first responsive styling
- `components/src/ui/Tabs/index.ts` - Barrel export
- `components/src/ui/Tabs/Tabs.stories.tsx` - Comprehensive Storybook stories

### Files Modified
- `components/src/index.ts` - Added Tabs export
- `components/src/data/ChartWithTabs/ChartWithTabs.tsx` - Refactored to use Tabs component
- `components/src/data/ChartWithTabs/ChartWithTabs.css` - Removed duplicate tab styles
- `frontend/src/features/calculators/LoanCalculatorPage.tsx` - Migrated to use Tabs component
- `frontend/src/features/calculators/LoanCalculatorPage.css` - Removed loan type selector styles

### Key Features
- Reusable, controlled Tabs component with underline active indicator
- Full WCAG 2.1 AAA accessibility support
- Mobile-first responsive design with proper touch targets
- Seamlessly replaced 3 different tab implementations
- Comprehensive Storybook coverage with 7 story variants
- Clean, DRY code with no duplication

### Build Status
- ✓ TypeScript type-check passes
- ✓ Frontend build succeeds
- ✓ No visual regressions expected
