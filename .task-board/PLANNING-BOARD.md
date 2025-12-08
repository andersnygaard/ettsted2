# Planning Board - Finans

**Current Focus**: Due Diligence Improvements (Tasks 225-231 remaining)

---

## Due Diligence Summary (2025-12-07)

**Report**: [.docs/DUE-DILIGENCE-REPORT.md](../.docs/DUE-DILIGENCE-REPORT.md)

| Score | Area | Status |
|-------|------|--------|
| 82/100 | Design | Good |
| 87/100 | Code Quality | Good |
| 85/100 | Security | Good |
| **85/100** | **Overall** | Good - Production Ready |

---

## Top Priorities

### 1. Task 225 - Calculation Accuracy Tests
**File**: `backlog/225-TEST-calculation-accuracy-tests.md`
**Effort**: Medium

### 2. Task 226 - Fix Skipped Tests
**File**: `backlog/226-TEST-fix-skipped-tests.md`
**Effort**: Low

### 3. Task 227 - HTTP Timeout Constants
**File**: `backlog/227-QUALITY-http-timeout-constants.md`
**Effort**: Low

### 4. Task 228 - Fix Touch Targets
**File**: `backlog/228-DESIGN-fix-touch-targets.md`
**Effort**: Medium

### 5. Task 229 - Use CSS Variables Everywhere
**File**: `backlog/229-DESIGN-use-css-variables-everywhere.md`
**Effort**: Medium

---

## Backlog Summary

**Due Diligence Tasks (225-231)**: 7 remaining
- 2 Tests (225, 226)
- 2 Design (228, 229)
- 1 Quality (227)
- 2 Docs/Refactor (230, 231)

**Design Polish Tasks (232-237)**: 6 tasks — Elevate 6/10 → 8/10
- 232: Micro-interaction variety (High)
- 233: Replace emoji icons with SVG (High)
- 234: Skeleton shimmer animation (Medium)
- 235: SpreadsheetTable visual polish (Medium)
- 236: Modal backdrop blur (Low)
- 237: Dashboard milestone lightening (Low)

---

## Recently Completed

### 210 - Norwegian Validation Messages (2025-12-07)
Translated all user-facing validation error messages to Norwegian. Backend logs remain in English.

### 209 - SpreadsheetTable Accessibility (2025-12-07)
Added caption, scope attributes, aria-live region for screen readers. WCAG compliant.

### 208 - Form Select Focus States (2025-12-07)
Added focus-visible styling to TableHeader select dropdown.

### 207 - Button Focus States (2025-12-07)
Added focus-visible styling to Button component. WCAG 2.4.7 compliant.

### 206 - E2E Data Entry Tests (2025-12-07)
Added Playwright tests for portfolio CRUD operations: create, edit, delete, export.

### 205 - OnboardingWizard Storybook Stories (2025-12-07)
Added 21 comprehensive Storybook stories covering all wizard steps and modes.

### 204 - Schema Field Name Consistency (2025-12-07)
Fixed username→nickname mismatch in userSetupSchema.

### 203 - Standardize English Variable Names (2025-12-07)
Renamed Norwegian variable names and API fields to English across backend and frontend.

### 202 - Add CSP Headers (2025-12-07)
Added explicit Content Security Policy via Helmet.

### 201 - Fix CORS No-Origin (2025-12-07)
Requests without Origin header now rejected in production.

---

## Recently Completed (2025-12-08)

### 224 - Calculator E2E Tests
Added 25 comprehensive E2E tests for all calculators.

### 223 - Loading Announcements (A11Y)
Added aria-busy and live region announcements for screen readers.

### 222 - Form ARIA Labels (A11Y)
Added aria-labels to TableHeader, ImportPage, SpreadsheetTable, LoginPage.

### 221 - Remove Dead Code
Deleted duplicate Container, test files, demo components, deprecated exports.

### 220 - Standardize Breakpoints
Unified 53 media queries to use CSS custom properties.

### 219 - Memoize Portfolio Calculations
Added useMemo to detectMilestones and calculateTotals.

### 218 - Console ESLint Rules
Added no-console rule, created isDevelopment helper.

### 217 - Skip-to-Content Link (A11Y)
Added keyboard skip link to PageSkeleton.

### 216 - Dynamic Page Titles (A11Y)
Added usePageTitle hook to all 16 pages.

### 215 - Division by Zero Guards
Added 13 division guards across frontend and backend.

### 214 - Implement Business Validators
Implemented validateSnapshotOwnership and validateUniqueDateForUser.

### 213 - Param Validation Account Routes
Added validateParams to PATCH/DELETE account routes.

### 212 - Enable Trust Proxy
Added app.set('trust proxy', true) for Azure.

### 211 - Validate Demo JWT Secret
Added production validation for DEMO_JWT_SECRET.

---

## Statistics

| Status | Count |
|--------|-------|
| Done | 224 |
| Backlog | 13 |
| In Progress | 0 |

**Last Updated**: 2025-12-08
