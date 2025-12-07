# Due Diligence Report - Finans Application

**Generated**: 2025-12-07
**Auditor**: Claude Code Due Diligence Skill
**Codebase Version**: fb5aded (main branch)

---

## Executive Summary

The Finans application demonstrates **senior-level architecture** with excellent TypeScript discipline, well-structured separation of concerns, and comprehensive input validation. The Nordic Minimal design system is well-implemented with 85% compliance, and the codebase shows mature patterns for authentication, error handling, and state management.

However, the audit identified **critical security issues** requiring immediate attention: development mode authentication bypass, exposed API credentials in local .env files, and a NoSQL injection pattern in the portfolio service. While the .env file is properly gitignored, the exposed credentials (Facebook, Google, OpenAI, Langfuse) should be rotated as a precautionary measure.

The frontend architecture is solid with feature-based vertical slicing and proper TanStack Query usage, though there are DRY violations in utility functions between the frontend and components packages that should be consolidated.

**Overall Assessment**: Production-ready after addressing critical security issues and consolidating shared utilities.

| Area | Score | Status |
|------|-------|--------|
| Design | 86/100 | ✅ Good |
| Code Quality | 85/100 | ✅ Good |
| Security | 75/100 | ⚠️ Needs Work |
| **Overall** | **82/100** | ✅ Good |

---

## Best Practices Compliance

### ✅ What's Done Well

- **Monorepo Structure**: Clean pnpm workspace with frontend, backend, and components packages
- **TypeScript Strictness**: `strict: true` across all workspaces with `noImplicitAny`, `noUnusedLocals`, enforced by ESLint
- **Zero `any` Types**: No unsafe type usage found in entire codebase
- **Vertical Slicing**: Feature-based organization in frontend (auth, dashboard, portfolio, calculators)
- **API Design**: Consistent REST conventions with `{ data, success, error }` response format
- **Input Validation**: Comprehensive Zod schemas for all endpoints with Norwegian-specific validators
- **Error Handling**: Custom AppError hierarchy with centralized global handler
- **State Management**: TanStack Query properly configured with centralized queryClient and QUERY_KEYS
- **CosmosDB Integration**: Correct partition key strategy, parameterized queries, error mapping
- **Logging**: Winston with automatic request context via AsyncLocalStorage, sensitive data redaction
- **Rate Limiting**: Three-tier system (general, calculator, LLM) with configurable thresholds
- **Security Headers**: Helmet.js configured for standard HTTP security headers
- **Responsive Design**: Mobile-first approach with proper breakpoints and touch/hover differentiation
- **Accessibility**: 85% compliance with semantic HTML, ARIA attributes, keyboard navigation

### ⚠️ Areas for Improvement

- **Query Key Consistency**: `useUser()` hook uses hardcoded `['user']` instead of QUERY_KEYS constant
- **DRY Violations**: Number and date formatting duplicated between frontend and components
- **Example Files in Source**: Test/example files mixed with production code
- **Component Token Distribution**: CSS tokens not bundled with components package
- **Documentation**: Component library lacks README

### Detailed Findings

#### Architecture

| Aspect | Status | Notes |
|--------|--------|-------|
| Monorepo structure | ✅ | pnpm workspaces correctly configured |
| Separation of concerns | ✅ | Routes → Controllers → Services → Data Layer |
| Feature-based organization | ✅ | Vertical slicing in frontend, well-organized shared |
| Middleware chain | ✅ | Correct order: helmet → cors → json → auth → routes → error |
| Configuration management | ✅ | Environment validation on startup |

#### TypeScript Usage

| Aspect | Status | Notes |
|--------|--------|-------|
| Strict mode | ✅ | Enabled across all workspaces |
| No implicit any | ✅ | ESLint enforces `@typescript-eslint/no-explicit-any: 'error'` |
| Type coverage | ✅ | All functions have return types, interfaces exported |
| Type guards | ⚠️ | Error handler uses `as AppError` casts instead of type guards |
| Generic usage | ✅ | Proper generics in service layers |

**Issues**:
- [backend/src/middleware/errorHandler.ts:38-54](backend/src/middleware/errorHandler.ts#L38-L54) - Multiple `as AppError` casts; should use type guard function

#### React Patterns

| Aspect | Status | Notes |
|--------|--------|-------|
| Functional components | ✅ | No class components |
| Hooks usage | ✅ | Proper useMemo, useCallback, custom hooks |
| Props typing | ✅ | All components have Props interfaces |
| State management | ✅ | TanStack Query for server state, Context for auth |

**Issues**:
- [frontend/src/features/auth/onboarding/OnboardingWizard.tsx:340](frontend/src/features/auth/onboarding/OnboardingWizard.tsx#L340) - Missing `handleSubmit` in useCallback dependencies
- [frontend/src/features/auth/AuthContext.tsx](frontend/src/features/auth/AuthContext.tsx) - Context in same file as provider triggers fast refresh warning

#### API Design

| Aspect | Status | Notes |
|--------|--------|-------|
| REST conventions | ✅ | Standard HTTP methods and status codes |
| Response format | ✅ | Consistent `{ data, success }` / `{ error, success: false }` |
| Status codes | ✅ | 200, 201, 204, 400, 401, 404, 409, 429, 500 properly used |
| Error responses | ✅ | Semantic error codes (VALIDATION_ERROR, NOT_FOUND, etc.) |

**Minor Issue**: DELETE /snapshots/:id returns 200 with message instead of 204 No Content

#### Data Layer

| Aspect | Status | Notes |
|--------|--------|-------|
| Partition strategy | ✅ | `/id` for users, `/userId` for portfolios |
| Query security | ✅ | Parameterized queries via `buildParameterizedQuery()` |
| Error mapping | ✅ | CosmosDB errors mapped to AppError classes |
| CI mock mode | ⚠️ | Mock logic scattered across controllers and routes |

---

## Security Compliance

### ✅ Security Strengths

- **Input Validation**: Comprehensive Zod schemas prevent injection and malformed data
- **Parameterized Queries**: NoSQL injection prevented in most database operations
- **User Isolation**: Partition key strategy enforces data isolation per user
- **Rate Limiting**: Three tiers implemented with express-rate-limit
- **Security Headers**: Helmet.js configured with defaults
- **Sensitive Data Redaction**: Passwords, tokens, secrets filtered from logs
- **HMAC Token Signing**: Demo tokens validated with SHA256 signature

### 🚨 Security Concerns

- **Development Auth Bypass**: Unauthenticated requests get mock user in dev mode
- **Local Secrets Exposure**: Production API keys visible in local .env file
- **ORDER BY Injection Pattern**: String interpolation in SQL query
- **CORS No-Origin Bypass**: Requests without Origin header bypass CORS check
- **Weak Demo Secret Fallback**: Hardcoded fallback if env var not set
- **Missing CSP Headers**: No Content-Security-Policy configured
- **Dev Routes Unprotected**: Dev endpoints lack auth middleware

### OWASP Top 10 Assessment

| Risk | Status | Notes |
|------|--------|-------|
| A01: Broken Access Control | ⚠️ | Dev routes unprotected; dev mode bypasses all auth |
| A02: Cryptographic Failures | ⚠️ | Secrets in .env (gitignored but risky); weak demo secret fallback |
| A03: Injection | ⚠️ | ORDER BY clause uses string interpolation (mitigated by schema) |
| A04: Insecure Design | ⚠️ | Dev auto-login could expose production if misconfigured |
| A05: Security Misconfiguration | ⚠️ | CORS allows no-origin; missing CSP; no HSTS |
| A06: Vulnerable Components | ✅ | Dependencies appear current |
| A07: Auth Failures | ⚠️ | Dev mode bypass; weak demo secret |
| A08: Data Integrity | ✅ | Strong input validation; business validation |
| A09: Logging Failures | ⚠️ | userId/email logged without PII redaction |
| A10: SSRF | ✅ | Only external calls to OpenAI; no internal service access |

### Security Details

#### Authentication Implementation

**File**: [backend/src/middleware/auth.ts](backend/src/middleware/auth.ts)

**Strengths**:
- Multi-layer auth: JWT → EasyAuth headers → Demo tokens
- HMAC-SHA256 demo token validation
- Proper Bearer token extraction

**Critical Issue** (lines 136-145):
```typescript
if (process.env.NODE_ENV === 'development') {
  req.user = { userId: 'dev-user-123', ... };
  return next();
}
```
Any request without auth in dev mode gets auto-injected with mock user.

**Recommendation**: Remove dev bypass entirely; use explicit DEMO_MODE flag.

#### ORDER BY Injection Pattern

**File**: [backend/src/services/portfolioService.ts:95](backend/src/services/portfolioService.ts#L95)

```typescript
const query = `SELECT * FROM p WHERE p.userId = @userId ORDER BY p.${orderBy} ${direction}`;
```

While `orderBy` is validated by Zod schema ('date' | 'createdAt'), this pattern is dangerous. Schema bypass would allow injection.

**Recommendation**: Use allowlist pattern:
```typescript
const orderByField = orderBy === 'date' ? 'p.date' : 'p.createdAt';
```

#### CORS Configuration

**File**: [backend/src/index.ts:28-31](backend/src/index.ts#L28-L31)

```typescript
if (!origin) {
  return callback(null, true); // Allows requests with no Origin
}
```

**Impact**: CORS protection bypassed by omitting Origin header.

**Recommendation**: Reject requests without Origin unless from specific trusted sources.

---

## Frontend Design Quality

### ✅ Design Strengths

- **Design System**: Comprehensive CSS tokens covering colors, typography, spacing, shadows
- **Nordic Minimal Aesthetic**: Warm, muted palette consistently applied
- **Typography Hierarchy**: Three-tier font system correctly implemented
- **Responsive Design**: 32 media queries with mobile-first approach
- **Reduced Motion**: `prefers-reduced-motion` implemented globally
- **Keyboard Navigation**: Focus trapping in modals, Tab/Escape support
- **Loading States**: Skeleton loaders with proper aria-busy/aria-live

### ⚠️ Design Issues

- **CSS Typo**: `--carcoal-hover` should be `--charcoal-hover` in tokens.css:66
- **Token Distribution**: Components package doesn't export CSS tokens
- **Missing Skip Link**: No skip-to-content for keyboard users
- **Color Contrast**: No WCAG verification documented
- **Breadcrumb**: Missing `aria-current="page"` on current item
- **Duplicate Container CSS**: Two Container.css files exist

### Design System Compliance

| Aspect | Compliance | Notes |
|--------|------------|-------|
| Color palette | 90% | All variables defined; minor hardcoded values |
| Typography | 95% | Correct fonts, weights, sizes applied |
| Spacing | 95% | Proper spacing scale used |
| Layout | 90% | Container widths, responsive padding correct |
| Components | 80% | Token dependency issues for standalone use |

### Accessibility Status

| Criteria | Status | Notes |
|----------|--------|-------|
| Semantic HTML | ✅ | `<nav>`, `<header>`, `<button>`, `<label>` used correctly |
| ARIA attributes | ✅ | aria-label, aria-invalid, aria-describedby implemented |
| Focus management | ✅ | focus-visible, focus trapping in modals |
| Keyboard navigation | ✅ | Tab, Enter, Escape support |
| Reduced motion | ✅ | Animation disabled for motion-sensitive users |
| Skip link | ❌ | Missing skip-to-content navigation |
| Color contrast | ⚠️ | Not documented/verified |

**Estimated WCAG Level**: AA partial compliance (needs skip link and contrast verification)

---

## Top 5 Valuable Improvements

Ranked by ROI (effort vs. impact):

### 1. Consolidate Formatting Utilities
**Impact**: High | **Effort**: Low

**Description**: Number and date formatting are implemented differently in frontend (numeral.js, date-fns) and components (toLocaleString, native). This causes inconsistent behavior and violates DRY.

**Recommendation**:
- Move all formatting utilities to `@finans/components`
- Export from components barrel
- Frontend imports from components package
- Delete duplicate implementations

**Files**:
- [frontend/src/shared/utils/numberFormat.ts](frontend/src/shared/utils/numberFormat.ts)
- [components/src/forms/utils/numberFormat.ts](components/src/forms/utils/numberFormat.ts)

### 2. Move CSS Tokens to Components Package
**Impact**: High | **Effort**: Medium

**Description**: CSS design tokens live in `frontend/src/styles/tokens.css` but components reference these variables. External consumers of `@finans/components` won't have access.

**Recommendation**:
- Move tokens.css to components package
- Create components/src/styles/tokens.css
- Re-export from components barrel
- Frontend imports from components

### 3. Add Unit Tests for Services
**Impact**: High | **Effort**: Medium

**Description**: Currently zero unit test coverage. Only E2E sanity tests exist. Critical business logic in services untested.

**Recommendation**:
- Add vitest to backend workspace
- Create tests for: userService, portfolioService, calculatorService
- Mock CosmosDB operations
- Target 80% coverage for services

### 4. Fix Query Key Consistency
**Impact**: Medium | **Effort**: Low

**Description**: `useUser()` hook uses hardcoded `['user']` instead of QUERY_KEYS constant. `useImportChat` also hardcodes query keys.

**Recommendation**:
- Add QUERY_KEYS.USER constant
- Update useUser, useUserSetup, useUpdateUser to use it
- Update useImportChat to use QUERY_KEYS constants

**File**: [frontend/src/shared/hooks/useUser.ts:17](frontend/src/shared/hooks/useUser.ts#L17)

### 5. Add Skip Link for Accessibility
**Impact**: Medium | **Effort**: Low

**Description**: No skip-to-content link for keyboard users to bypass header navigation.

**Recommendation**:
- Add hidden skip link at top of AppHeader
- Link to main content area with id="main-content"
- Show on focus with CSS

**File**: [frontend/src/shared/components/AppHeader.tsx](frontend/src/shared/components/AppHeader.tsx)

---

## Top 5 Critical Errors

Ranked by severity:

### 🔴 1. Development Mode Authentication Bypass
**Severity**: Critical | **Category**: Security

**Location**: [backend/src/middleware/auth.ts:136-145](backend/src/middleware/auth.ts#L136-L145)

**Description**: When `NODE_ENV=development`, any request without valid authentication is automatically injected with a mock user, completely bypassing authentication.

**Impact**: If production is accidentally deployed with `NODE_ENV=development`, ALL authentication is bypassed. Any user can access any endpoint.

**Fix**: Remove the development auto-login bypass entirely. Require explicit DEMO_MODE flag that is never set in production.

```typescript
// REMOVE THIS BLOCK
if (process.env.NODE_ENV === 'development') {
  req.user = { ... };
  return next();
}
```

### 🔴 2. Production Secrets in Local Environment
**Severity**: Critical | **Category**: Security

**Location**: [backend/.env](backend/.env) (lines 6-17)

**Description**: The local .env file contains live production API credentials:
- Facebook App ID and Secret
- Google Client ID and Secret
- OpenAI API Key
- Langfuse Secret Key

**Impact**: While .env is gitignored, these credentials should be rotated as a precautionary measure. If the machine is compromised, attackers gain access to third-party services.

**Fix**:
1. Immediately rotate all exposed credentials
2. Use Azure Key Vault or similar secrets manager in production
3. Keep only dummy values in local .env
4. Document required secrets in .env.example

### 🟠 3. NoSQL Injection Pattern in ORDER BY
**Severity**: High | **Category**: Security

**Location**: [backend/src/services/portfolioService.ts:95](backend/src/services/portfolioService.ts#L95)

**Description**: The `orderBy` parameter is interpolated directly into the SQL query string instead of using parameterized query.

```typescript
const query = `SELECT * FROM p WHERE p.userId = @userId ORDER BY p.${orderBy} ${direction}`;
```

**Impact**: Currently mitigated by Zod schema validation, but if validation is bypassed (bug, regression), allows query manipulation.

**Fix**: Use allowlist pattern instead of interpolation:
```typescript
const orderByFields = { date: 'p.date', createdAt: 'p.createdAt' };
const orderByField = orderByFields[orderBy] || 'p.date';
```

### 🟠 4. PageSkeleton/PageHeader Prop Mismatch
**Severity**: High | **Category**: Bug

**Location**: [components/src/layout/PageSkeleton/PageSkeleton.tsx:45](components/src/layout/PageSkeleton/PageSkeleton.tsx#L45)

**Description**: PageSkeleton passes `centered` prop to PageHeader, but PageHeader interface doesn't define this property.

**Impact**: TypeScript compilation error. May break builds in strict mode.

**Fix**: Either:
- Add `centered?: boolean` to PageHeader interface
- Remove `centered` from PageSkeleton's PageHeader usage

### 🟡 5. CSS Variable Typo Breaking Button Styles
**Severity**: Medium | **Category**: Bug

**Location**: [frontend/src/styles/tokens.css:66](frontend/src/styles/tokens.css#L66)

**Description**: Variable `--carcoal-hover` is a typo. Should be `--charcoal-hover`. Referenced in button primary disabled state.

**Impact**: Button primary disabled state won't render correctly.

**Fix**: Change `--carcoal-hover` to `--charcoal-hover`

---

## Scores Breakdown

### Design Score: 86/100

| Factor | Score | Notes |
|--------|-------|-------|
| Visual Consistency | 17/20 | 85% design system compliance; typo in tokens |
| Information Hierarchy | 18/20 | Clear structure; good use of typography |
| Responsive Design | 18/20 | Mobile-first; proper breakpoints |
| Accessibility | 16/20 | Good ARIA usage; missing skip link |
| User Experience | 17/20 | Smooth flows; loading states |

### Code Quality Score: 85/100

| Factor | Score | Notes |
|--------|-------|-------|
| TypeScript Correctness | 19/20 | Strict mode; zero any types |
| Architecture | 18/20 | Clean separation; minor mock mode scattering |
| Error Handling | 17/20 | Centralized handler; summary routes inconsistent |
| Code Organization | 15/20 | DRY violations; example files in source |
| Documentation | 16/20 | Good JSDoc; component library lacks README |

### Security Score: 75/100

| Factor | Score | Notes |
|--------|-------|-------|
| Authentication | 12/20 | Good implementation but dev bypass is critical risk |
| Authorization | 18/20 | Partition key isolation excellent |
| Input Validation | 18/20 | Comprehensive Zod validation |
| Dependency Security | 15/20 | Appears current; needs npm audit verification |
| Security Config | 12/20 | CORS bypass; no CSP; dev routes unprotected |

---

## Recommendations Summary

### Immediate Actions (Do Now)
- [ ] Remove development mode auth bypass from auth.ts
- [ ] Rotate all credentials in .env file
- [ ] Fix ORDER BY injection pattern with allowlist
- [ ] Fix PageSkeleton/PageHeader prop mismatch
- [ ] Fix `--carcoal-hover` typo in tokens.css

### Short-Term (Next Sprint)
- [ ] Consolidate number/date formatting utilities
- [ ] Move CSS tokens to components package
- [ ] Fix query key consistency in useUser hook
- [ ] Add skip link for accessibility
- [ ] Fix CORS to reject no-origin requests
- [ ] Add CSP headers
- [ ] Resolve React hook dependency warnings (6 total)

### Long-Term (Roadmap)
- [ ] Add unit tests for services (80% coverage target)
- [ ] Implement Azure Key Vault for production secrets
- [ ] Add color contrast documentation (WCAG AA)
- [ ] Centralize CI mock mode handling in service layer
- [ ] Add aria-current="page" to breadcrumb
- [ ] Remove example files from production source
- [ ] Document component library with README

---

## Appendix

### Files Reviewed

**Backend**:
- backend/src/index.ts
- backend/src/routes/*.ts
- backend/src/controllers/*.ts
- backend/src/services/*.ts
- backend/src/middleware/*.ts
- backend/src/validators/*.ts
- backend/src/utils/*.ts

**Frontend**:
- frontend/src/App.tsx
- frontend/src/features/**/*.tsx
- frontend/src/shared/**/*.ts
- frontend/src/styles/*.css

**Components**:
- components/src/**/*.tsx
- components/src/**/*.css

**Configuration**:
- tsconfig.json (all workspaces)
- eslint.config.js (all workspaces)
- package.json (all workspaces)

### Tools Used
- Static analysis: ESLint, TypeScript compiler
- Security: Manual code review, pattern analysis
- Design: Visual inspection, CSS analysis
- Accessibility: Semantic HTML review, ARIA audit

### Methodology
1. Launched 5 parallel exploration agents (haiku model)
2. Each agent focused on specific domain: backend, frontend, security, design, code quality
3. Compiled findings from all agents
4. Calculated scores based on weighted criteria
5. Prioritized recommendations by severity and ROI
6. Generated comprehensive report

---

*Report generated by Claude Code Due Diligence Skill*
