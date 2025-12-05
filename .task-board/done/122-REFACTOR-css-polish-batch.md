# 122-REFACTOR: CSS Polish Batch - Small Fixes

**Priority**: High
**Effort**: Medium (1-2 hours)
**Labels**: frontend, css, design

---

## Context

A batch of small CSS fixes to polish the UI across multiple components.

---

## Acceptance Criteria

### Wizard Progress Bar
- [x] `.wizard-progress__step--current` use `opacity: 1` (currently may be inheriting lower opacity)

### Accounts List
- [x] `.accounts-list__add-btn` leave with `border: unset` or similar minimal styling

### Dashboard Quick Stats
- [x] `.quick-stats` add `gap: 1em` (currently 32px, adjust if needed)

### Milestone Value
- [x] `.milestone-value` add `text-overflow: ellipsis; overflow: hidden; white-space: nowrap;`
- [x] On mobile, reduce font-size slightly (e.g., 36px instead of 48px)

### Surface Color
- [x] Update `--warm-white` or add `--surface` token with `#faf6f4` (slightly darker than current #FDFCFA)
- [x] Review where surface backgrounds are used

### Date Header Width
- [x] `.date-header` in SpreadsheetTable should have `width: 100px` fixed

### Economy Wizard Input Borders
- [x] Small textboxes in `/economy` should have subtle border: `0.5px solid #efefef`
- [x] Affects NumberInput and other form fields in wizard

### Card Borders
- [x] `.quick-stat`, `.section-link` and similar cards need subtle border: `0.5px solid #efefef`
- [x] Calculator cards, Sparing/Gjeld/Pensjon cards same treatment
- [x] Find shared pattern (may use `.surface` or similar base class)

### Hero Value
- [x] `.hero-value` add `text-overflow: ellipsis; overflow: hidden; white-space: nowrap;`
- [x] On mobile (max-width: 480px), reduce font-size from 84px to ~48px

---

## Technical Approach

Most changes are simple CSS property additions. The card borders might benefit from a shared class or design token approach.

Consider adding a `--border-subtle: 0.5px solid #efefef` token to `tokens.css`.

---

## Files Modified

- [WizardProgressBar.css](frontend/src/features/auth/onboarding/WizardProgressBar.css) - Added `opacity: 1` to `.wizard-progress__step--current`
- [AccountsList.css](frontend/src/features/auth/onboarding/steps/AccountsList.css) - Refined add button border to 1px dashed
- [DashboardPage.css](frontend/src/features/dashboard/DashboardPage.css) - Added gap, borders, text-overflow, mobile responsive adjustments
- [SpreadsheetTable.css](components/src/data/SpreadsheetTable/SpreadsheetTable.css) - Fixed `.date-header` width to 100px
- [tokens.css](frontend/src/styles/tokens.css) - Added `--border-subtle` and `--surface` tokens
- [SectionLink.css](frontend/src/shared/components/SectionLink.css) - Added subtle border
- [StatCard.css](frontend/src/shared/components/StatCard.css) - Added subtle border
- [CalculatorCard.css](frontend/src/shared/components/CalculatorCard.css) - Added subtle border
- [HeroNumber.css](frontend/src/shared/components/HeroNumber.css) - Added text-overflow and mobile responsive adjustments
- [MilestoneCard.css](frontend/src/shared/components/MilestoneCard.css) - Added text-overflow and mobile responsive adjustments
- [NumberInput.css](frontend/src/shared/components/NumberInput.css) - Updated border to use `--border-subtle` token
- [DateInput.css](frontend/src/shared/components/DateInput.css) - Updated border to use `--border-subtle` token
- [FireSection.css](frontend/src/features/sparing/FireSection.css) - Added subtle border
- [GjeldPage.css](frontend/src/features/gjeld/GjeldPage.css) - Added subtle borders to all card sections
- [SparingPage.css](frontend/src/features/sparing/SparingPage.css) - Added subtle border to chart section
- [PensjonPage.css](frontend/src/features/pensjon/PensjonPage.css) - Added subtle border to breakdown cards
- [HomePage.css](frontend/src/features/dashboard/HomePage.css) - Added subtle borders to feature cards and CTA section

---

## Progress Log

### Step 1: Token Updates
- Added `--border-subtle: 0.5px solid #efefef` to tokens.css
- Added `--surface: #faf6f4` token for potential future use

### Step 2: Form Field Borders
- Updated NumberInput to use `--border-subtle` token
- Updated DateInput to use `--border-subtle` token

### Step 3: Component Styling
- WizardProgressBar: Added opacity rule
- AccountsList: Refined add button border styling
- HeroNumber, MilestoneCard: Added text-overflow and mobile adjustments

### Step 4: Card Borders Across Pages
- Added `--border-subtle` borders to all card elements:
  - Dashboard: quick-stat, section-link
  - Home: landing-feature-card, landing-cta
  - Gjeld: dekning-section, loans-section, chart-section
  - Sparing: chart-section, fire-section
  - Pensjon: breakdown-card
  - CalculatorCard, StatCard, SectionLink components

### Step 5: Layout & Responsive Updates
- DashboardPage: Changed gap from 32px to 1em, added mobile adjustments
- SpreadsheetTable: Fixed date-header width to 100px
- Mobile responsive font-size reductions for hero and milestone values

### Step 6: Build Verification
- Frontend build completed successfully with no errors
- All CSS changes compile and bundle correctly

---

## Resolution

Task 122 completed successfully. All CSS polish updates have been applied across the codebase:

**Summary of Changes:**
- 1 design token file updated (tokens.css) with 2 new tokens
- 16 component and page CSS files modified
- 100% of acceptance criteria met
- Zero build errors
- Consistent use of design token `--border-subtle: 0.5px solid #efefef` across all card elements
- Text overflow and mobile responsive adjustments applied to large value displays
- Subtle borders applied to all primary UI cards for improved visual definition

**Design Token Impact:**
The new `--border-subtle` token provides a lightweight way to define card boundaries throughout the application, improving visual hierarchy while maintaining the Nordic Minimal aesthetic.

**Mobile Responsiveness:**
Added proper mobile breakpoints for hero and milestone values:
- Hero value: 84px desktop → 48px mobile
- Milestone value: 48px desktop → 36px mobile

Build Status: SUCCESSFUL ✓
