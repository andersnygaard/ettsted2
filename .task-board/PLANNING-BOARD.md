# Planning Board - Finans

**Current Focus**: Calculator Sub-pages & Data Integration

---

## Top Priorities

### 1. Loan Calculator Page (Effort: Medium - 2-3 timer)
**File**: `backlog/062-FEATURE-loan-calculator-page.md`
**Why Now**: Complete the calculator trio
**Status**: Ready - follows same pattern as Compound/F.I.R.E.

### 2. Dashboard Data Hook (Effort: Simple - 1-2 timer)
**File**: `backlog/065-FEATURE-dashboard-data-hook.md`
**Why Now**: Connect dashboard to real API data
**Status**: Ready - Portfolio API complete

### 3. Login Redirect to Dashboard (Effort: Simple - 15 min)
**File**: `backlog/072-FEATURE-login-redirect-to-dashboard.md`
**Why Now**: Quick UX improvement - users land on dashboard after login
**Status**: Ready for implementation

### 4. Monte Carlo Backend + Page (Effort: Complex - 8 timer)
**Files**: `backlog/064-FEATURE-monte-carlo-backend.md`, `backlog/063-FEATURE-monte-carlo-page.md`
**Why Now**: Complete all 4 calculators
**Status**: Backend first, then frontend page

---

## All Backlog Tasks (Ordered by Priority)

### Calculator Pages (062-063)
| # | Task | Effort | Dependencies |
|---|------|--------|--------------|
| 062 | Loan Calculator Page | Medium | ✅ All ready |
| 063 | Monte Carlo Page | Complex | Needs 064 |

### Backend (064)
| # | Task | Effort | Dependencies |
|---|------|--------|--------------|
| 064 | Monte Carlo Backend Endpoint | Medium | ✅ All ready |

### Data Integration (065-068)
| # | Task | Effort | Dependencies |
|---|------|--------|--------------|
| 065 | Dashboard Data Hook | Simple | ✅ All ready |
| 066 | Sparing Data Hook | Simple | ✅ All ready |
| 067 | Update Routes | Simple | After pages |
| 068 | Update Layout | Simple | After pages |

### Components (069-070)
| # | Task | Effort | Dependencies |
|---|------|--------|--------------|
| 069 | Container Component | Simple | ✅ All ready |
| 070 | Loading Skeleton | Simple | ✅ All ready |

### Auth & Navigation (071-072)
| # | Task | Effort | Dependencies |
|---|------|--------|--------------|
| 071 | Authenticated Home Redirect | Simple | ✅ All ready |
| 072 | Login Redirect to Dashboard | Simple | ✅ All ready |

---

## Recently Completed

### ✅ 061 - F.I.R.E. Calculator Page (2025-11-30)
Interactive F.I.R.E. calculator with inputs for savings, income, expenses, age, and return rate. Calculates F.I.R.E. number (25x expenses), years to F.I.R.E., retirement age, and savings rate. Includes progress bar and projection chart.

### ✅ 060 - Compound Interest Calculator Page (2025-11-30)
Interactive compound interest calculator with Norwegian formatting. Shows how savings grow over time with inputs for initial amount, monthly deposit, interest rate, and years. Includes area chart visualization.

### ✅ 054-056 - Pensjon Components (2025-11-30)
BreakdownCards, OtpSection, and StackedAreaChart components already implemented as part of Pensjon page.

### ✅ 047-053 - Sparing, Gjeld, Pensjon Pages (2025-11-29)
StatsRow, AreaChart, DekningCircle, DekningSection, LoansList components and complete pages.

### ✅ 046, 058-059 - FireSection, CalculatorCard, Kalkulatorer Page (2025-11-29)
FireSection component for F.I.R.E. tracking, CalculatorCard component, and Kalkulatorer page.

### ✅ 041-045 - Portfolio Page + Components (2025-11-29)
SpreadsheetTable, NewMonthModal, Modal, NumberInput, DateInput components and Portfolio page.

### ✅ 021-036 - Design System + Core Components (2025-11-29)
Design tokens, typography, grain texture, animations, and all core UI components.

### ✅ 001-015 - Backend & Frontend Foundation (2025-11-28/29)
Backend server, CosmosDB, frontend init, localization, auth, user API, Portfolio API, Dashboard.

---

## On-Hold

- **016**: LLM Data Import (advanced feature, post-MVP)
- **017**: Playwright E2E tests (after MVP complete)
- **019**: Storybook setup (documentation, post-MVP)

---

**Last Updated**: 2025-11-30

**Statistics**:
- Ferdig: 47
- Backlog: 11
- On-Hold: 3
- In Progress: 0

**Milestone**: 2 of 4 calculator sub-pages complete (Compound Interest, F.I.R.E.)! Next: Loan Calculator, then Monte Carlo.
