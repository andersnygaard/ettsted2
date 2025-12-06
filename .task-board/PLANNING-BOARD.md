# Planning Board - Finans

**Current Focus**: Code quality and accessibility from due diligence audit (2025-12-06)

---

## Due Diligence Findings

**Report**: [.docs/DUE-DILIGENCE-REPORT.md](../.docs/DUE-DILIGENCE-REPORT.md)

| Score | Area | Status |
|-------|------|--------|
| 85/100 | Design | Good |
| 80/100 | Code Quality | Good |
| 85/100 | Security | Good (corrected) |
| **83/100** | **Overall** | Production-ready |

> **Note**: Tasks 164-165 (secrets exposure) were false positives - .env files properly gitignored.

---

## Top Priorities

| # | Task | Type | Priority | Effort |
|---|------|------|----------|--------|
| 166 | Update jws vulnerability (CVE-2025-65945) | Security | HIGH | Simple |
| 168 | Consolidate parseDate() duplication | Refactor | HIGH | Simple |
| 167 | Add safeguard for dev routes | Security | MODERATE | Simple |
| 169 | Fix SpreadsheetTable color swap | Bug | MEDIUM | Simple |
| 170-172 | Accessibility fixes (3 items) | A11Y | MEDIUM | Simple |

---

## Full Backlog

### Security (HIGH)
- 166-SECURITY-update-jws-vulnerability (CVE-2025-65945)
- 167-SECURITY-dev-routes-safeguard

### Code Quality (HIGH)
- 168-REFACTOR-consolidate-parsedate (5 duplications → shared util)
- 156-REFACTOR-controller-dry-pattern (backend error handling)
- 173-REFACTOR-sparing-gjeld-api-service (raw fetch → axios)

### Bugs (MEDIUM)
- 169-BUG-spreadsheet-color-swap (Sparing/Pensjon colors wrong)
- 176-BUG-main-padding-gap (main element padding artifacts)
- 178-BUG-delete-modal-icon-alignment (warning icon misaligned)

### Accessibility (MEDIUM)
- 170-A11Y-avatar-aria-label
- 171-A11Y-statcard-keyboard
- 172-A11Y-modal-close-label

### Refactors (MEDIUM)
- 177-REFACTOR-consolidate-settings-economy (delete duplicate SettingsPage)
- 174-REFACTOR-extract-constants (magic numbers)
- 175-REFACTOR-query-invalidation-helper

### Design (MEDIUM)
- 179-DESIGN-buttons-white-background (solid backgrounds)
- 180-DESIGN-surface-color-consistency (use #faf6f4 for cards)

### Features/Animations (BACKLOG)
- 145-FEATURE-enhanced-hover-animations
- 146-FEATURE-page-transition-animations
- 147-FEATURE-hero-number-counting-animation
- 151-FEATURE-chart-entry-animations
- 152-REFACTOR-animation-utility-consolidation
- 153-FEATURE-progress-bar-animations
- 154-FEATURE-modal-transition-improvements
- 155-FEATURE-skeleton-loading-consistency
- 157-FEATURE-input-focus-animations
- 158-FEATURE-navigation-active-indicator
- 159-FEATURE-responsive-animation-adjustments

---

## Recently Completed

### 149 - Year Badge "+-" Format (2025-12-06)
Fixed hardcoded "+" prefix in SparingPage.

### 148 - Settings Route Broken (2025-12-06)
Created SettingsPage with profile editing.

### 150 - Milestone Shows Achieved Value (2025-12-06)
Fixed milestone calculation to use sumSparing.

### 143 - Monte Carlo Results Empty (2025-12-06)
Moved simulation to client-side useMemo.

### 142 - Gjeld Chart Shows No Data (2025-12-06)
Fixed useGjeldData hook to use aggregated endpoint.

### 141 - Dashboard vs Sparing Data Mismatch (2025-12-06)
Fixed asset class categorization in backend.

---

## Statistics

| Status | Count |
|--------|-------|
| Done | 156 |
| Backlog | 18 |
| In Progress | 1 |

**Last Updated**: 2025-12-06 (Task Discovery)
