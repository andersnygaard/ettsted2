# Planning Board - Finans

**Current Focus**: Due Diligence Fixes

---

## Due Diligence Summary (2025-12-09)

**Report**: [.docs/DUE-DILIGENCE-REPORT.md](../.docs/DUE-DILIGENCE-REPORT.md)

| Score | Area | Status |
|-------|------|--------|
| 85/100 | Design | Good |
| 88/100 | Code Quality | Good |
| 82/100 | Security | Good |
| **85/100** | **Overall** | Good - Production Ready |

---

## Top Priorities

### High Priority
| # | Task | Type | Effort |
|---|------|------|--------|
| 250 | AppHeader Focus Indicators | A11Y | Low |
| 251 | Update esbuild Dependencies | Security | Medium |
| 252 | Parallel Account Cascade | Performance | Low |
| 258 | Unit Tests for Custom Hooks | Test | Medium |

### Medium Priority
| # | Task | Type | Effort |
|---|------|------|--------|
| 253 | Consolidate Error Interfaces | Refactor | Low |
| 254 | Standardize Focus Colors | A11Y | Low |
| 255 | SpreadsheetTable Group Header Focus | A11Y | Low |
| 259 | Calculator Endpoint Authentication | Security | Low |

### Low Priority
| # | Task | Type | Effort |
|---|------|------|--------|
| 256 | Feature-Level Error Boundaries | Refactor | Medium |
| 257 | Modal Focus Handling Fix | A11Y | Low |

---

## Backlog Summary

| Priority | Count |
|----------|-------|
| High | 5 |
| Medium | 4 |
| Low | 2 |
| **Total** | **11** |

---

## Recently Completed (2025-12-09)

### 249 - Demo Login Rate Limiting ✅
Added dedicated rate limiter (5 req/15min) to `/auth/demo-login` endpoint with Norwegian error messages.

### 238 - Mobile-First Foundation Refactor
Refactored CSS architecture to mobile-first. Base styles target mobile, breakpoints add desktop complexity.

### 237 - Dashboard Milestone Lightening
Lightened milestone card backgrounds for better readability.

### 236 - Modal Backdrop Blur
Added backdrop-filter blur effect to modals.

### 235 - SpreadsheetTable Visual Polish
Enhanced table styling with better borders, hover states, and alignment.

### 234 - Skeleton Shimmer Animation
Added shimmer animation to loading skeletons.

### 233 - Replace Emoji Icons with SVG
Replaced emoji icons with proper SVG icons throughout the app.

### 232 - Micro-Interaction Variety
Added varied micro-interactions and hover effects across components.

### 231 - Norwegian Route Names
Standardized routes: `/economy` → `/okonomi` with redirect.

---

## Recently Completed (2025-12-08)

### 230 - Workspace READMEs
Added documentation to frontend, backend, and components workspaces.

### 229 - CSS Variables Everywhere
Converted remaining hardcoded values to CSS custom properties.

### 228 - Touch Target Fixes
Ensured minimum 44x44px touch targets on mobile.

### 227 - HTTP Timeout Constants
Centralized timeout configuration values.

### 226 - Fix Skipped Tests
Resolved skipped E2E tests.

### 225 - Calculation Accuracy Tests
Added tests for financial calculations.

### 224 - Calculator E2E Tests
Added 25 comprehensive E2E tests for all calculators.

### 223 - Loading Announcements (A11Y)
Added aria-busy and live region announcements.

### 222 - Form ARIA Labels (A11Y)
Added aria-labels to forms.

### 221 - Remove Dead Code
Deleted unused components and files.

### 220 - Standardize Breakpoints
Unified media queries to CSS custom properties.

### 219 - Memoize Portfolio Calculations
Added useMemo for performance.

### 218 - Console ESLint Rules
Added no-console rule with isDevelopment helper.

### 217 - Skip-to-Content Link (A11Y)
Added keyboard skip link.

### 216 - Dynamic Page Titles (A11Y)
Added usePageTitle hook to all pages.

### 215 - Division by Zero Guards
Added safety checks for divisions.

### 214 - Business Validators
Implemented ownership and uniqueness validators.

### 213 - Param Validation
Added validateParams to routes.

### 212 - Trust Proxy
Enabled trust proxy for Azure.

### 211 - Demo JWT Secret Validation
Added production validation for secret.

---

## Statistics

| Status | Count |
|--------|-------|
| Done | 239 |
| Backlog | 10 |
| In Progress | 0 |

**Last Updated**: 2025-12-09
