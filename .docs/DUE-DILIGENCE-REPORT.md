# Due Diligence Report - Finans Application

**Generated**: 2025-12-09
**Auditor**: Claude Code Due Diligence Skill
**Codebase Version**: f532c8b (Security, accessibility, design, and testing improvements)

---

## Executive Summary

The finans application is a **production-grade** portfolio and wealth tracking application built with React, TypeScript, and Azure. The codebase demonstrates senior-level engineering with strong architecture, comprehensive security measures, and a polished design system.

The audit reveals a well-structured monorepo with clear separation of concerns, robust authentication via Azure EasyAuth, and excellent TypeScript strictness (zero explicit `any` types). The Nordic Minimal design system is consistently applied with strong accessibility foundations (WCAG 2.1 Level AA compliance targeted).

Key strengths include comprehensive input validation with Zod, parameterized CosmosDB queries preventing injection attacks, multi-tier rate limiting, and professional state management with TanStack Query. The main gaps are lack of unit tests (E2E only), demo login accessible in production builds, and minor accessibility gaps in keyboard navigation.

**Overall Assessment**: Production-ready with minor improvements recommended before launch.

| Area | Score | Status |
|------|-------|--------|
| Design | 85/100 | ✅ Good |
| Code Quality | 88/100 | ✅ Good |
| Security | 82/100 | ✅ Good |
| **Overall** | **85/100** | ✅ **Good** |

---

## Best Practices Compliance

### ✅ What's Done Well

- **Application factory pattern** - Server startup separated from app creation, enabling testability
- **Comprehensive middleware stack** - Properly ordered: Helmet → CORS → logging → rate limiting → error handling
- **Strong separation of concerns** - Routes → Controllers → Services → Data Layer with clear boundaries
- **Two-layer validation** - Zod schemas (format) + business validators (uniqueness, state)
- **Custom error hierarchy** - `AppError` classes mapping to HTTP status codes
- **Parameterized queries** - NoSQL injection prevention via `buildParameterizedQuery` helper
- **Structured logging** - Winston with automatic context injection (requestId, userId)
- **Multi-auth support** - Azure EasyAuth headers, JWT Bearer tokens, demo tokens
- **Graceful shutdown** - Proper signal handling with Langfuse flush and timeout
- **Vertical feature slicing** - Clean frontend organization by feature domain
- **TanStack Query integration** - Centralized query keys, intelligent invalidation
- **Zero technical debt markers** - No TODO/FIXME comments in codebase
- **Mobile-first CSS** - Consistent `min-width` media queries throughout

### ⚠️ Areas for Improvement

- **No unit tests** - Only E2E coverage exists; custom hooks and utilities untested
- **Duplicate error interfaces** - `ApiError` defined in two places with different structures
- **Date parsing scattered** - Multiple places parse "dd.MM.yyyy" without shared utility
- **Large files** - `snapshotController.ts` (444 lines), `PortfolioPage.tsx` (547 lines)
- **No feature-level error boundaries** - Single top-level ErrorBoundary catches all

### Detailed Findings

#### Architecture

| Aspect | Status | Notes |
|--------|--------|-------|
| Monorepo structure | ✅ Pass | pnpm workspaces with frontend, backend, components |
| Vertical slicing | ✅ Pass | Features organized by domain (auth, portfolio, calculators) |
| Separation of concerns | ✅ Pass | Clean layering in backend and frontend |
| API design | ✅ Pass | REST conventions, consistent response format |

#### TypeScript Usage

| Aspect | Status | Notes |
|--------|--------|-------|
| Strict mode | ✅ Pass | Enabled in all three workspaces |
| Explicit any | ✅ Pass | Zero instances found; ESLint enforces |
| Type coverage | ✅ Pass | All functions typed, generics used properly |
| Type guards | ✅ Pass | Custom guards for error handling |

#### React Patterns

| Aspect | Status | Notes |
|--------|--------|-------|
| Functional components | ✅ Pass | No class components |
| Hooks patterns | ✅ Pass | Custom hooks follow conventions |
| State management | ✅ Pass | TanStack Query (server) + Context (auth) |
| Lazy loading | ✅ Pass | Route-level code splitting |

#### API Design

| Aspect | Status | Notes |
|--------|--------|-------|
| REST conventions | ✅ Pass | Proper HTTP methods and status codes |
| Response format | ✅ Pass | Consistent `{ data, success }` structure |
| Error format | ✅ Pass | `{ error: { message, code }, success: false }` |
| Versioning | ✅ Pass | `/api/v1` prefix on all routes |

#### Data Layer

| Aspect | Status | Notes |
|--------|--------|-------|
| Partition strategy | ✅ Pass | userId partition for user isolation |
| Query patterns | ✅ Pass | Parameterized queries throughout |
| Error mapping | ✅ Pass | CosmosDB errors mapped to AppError |
| Date handling | ⚠️ Warning | JavaScript sorting required (documented) |

---

## Security Compliance

### ✅ Security Strengths

- **Strong authentication** - Azure EasyAuth OAuth2 (Google + Facebook) with JWT validation
- **Comprehensive validation** - Zod schemas on all API inputs with field-level rules
- **NoSQL injection prevention** - Parameterized queries with allowlist patterns
- **User isolation** - Database partitioned by userId; queries scoped to user
- **Security headers** - Helmet.js with explicit CSP configuration
- **Multi-tier rate limiting** - General 100/min, calculator 10/min, LLM 20/min
- **Token security** - HMAC-SHA256 signatures on demo tokens; expiry validation
- **Error sanitization** - Stack traces hidden in production
- **Secrets management** - All credentials in environment variables, not code
- **Dev routes gated** - Require both NODE_ENV=development AND DEV_MODE_ENABLED

### 🚨 Security Concerns

1. **Demo login accessible in production** - `/auth/demo-login` endpoint exists without NODE_ENV check
2. **localStorage JWT storage** - Demo tokens in localStorage vulnerable to XSS
3. **EasyAuth header fallback** - Headers trusted directly if JWT auth fails
4. **Calculator endpoints unauthenticated** - Public access to calculator APIs
5. **esbuild vulnerability** - Moderate severity in dev dependencies (2 vulnerabilities)

### OWASP Top 10 Assessment

| Risk | Status | Notes |
|------|--------|-------|
| A01: Broken Access Control | ✅ Pass | User isolation via partition keys; validateAuth on protected routes |
| A02: Cryptographic Failures | ✅ Pass | HTTPS enforced; tokens signed with HMAC-SHA256 |
| A03: Injection | ✅ Pass | Parameterized queries; Zod validation prevents string injection |
| A04: Insecure Design | ⚠️ Warning | Demo login shouldn't exist in production; calculators should require auth |
| A05: Security Misconfiguration | ✅ Pass | Helmet configured; CORS allowlist; dev routes gated |
| A06: Vulnerable Components | ⚠️ Warning | 2 moderate esbuild vulnerabilities in dev dependencies |
| A07: Auth Failures | ✅ Pass | EasyAuth provides strong OAuth2; token expiry validated |
| A08: Data Integrity | ✅ Pass | Zod validation; CosmosDB ACID guarantees per partition |
| A09: Logging Failures | ✅ Pass | Winston logger; sensitive data not logged |
| A10: SSRF | ✅ Pass | No user-controlled URLs in HTTP requests |

---

## Frontend Design Quality

### ✅ Design Strengths

- **Comprehensive design tokens** - CSS custom properties for colors, typography, spacing, shadows
- **Strong mobile-first CSS** - Base styles mobile, `@media (min-width)` for larger screens
- **Consistent typography** - Cormorant Garamond (headings), DM Sans (body), JetBrains Mono (numbers)
- **Excellent accessibility foundation** - WCAG 2.1 Level AA compliance documented
- **Touch target compliance** - 44px minimum throughout components
- **Semantic HTML** - Proper elements with ARIA attributes where needed
- **Focus indicators** - Consistent focus-visible styling with outline-offset
- **Color contrast documented** - Approved combinations meeting WCAG AA
- **Motion accessibility** - `prefers-reduced-motion` support in Modal and Toast
- **Complex component polish** - SpreadsheetTable with sticky headers, milestone highlighting

### ⚠️ Design Issues

1. **Focus indicator color inconsistency** - AppHeader uses `--pale-blue`, Button uses `--charcoal`, StatCard uses `--muted-sage`
2. **AppHeader nav missing focus-visible** - Keyboard users cannot see focused nav item
3. **PageHeader uses max-width query** - Violates mobile-first principle
4. **SpreadsheetTable group headers no focus** - Clickable but no focus indicator
5. **Modal close button focus handling** - `:focus` clears outline before `:focus-visible` adds it

### Design System Compliance

| Aspect | Status | Notes |
|--------|--------|-------|
| Color palette | ✅ Pass | All approved colors consistently used |
| Typography | ✅ Pass | Proper font hierarchy throughout |
| Spacing/Layout | ✅ Pass | Consistent use of space tokens |
| Responsive (mobile-first) | ⚠️ Partial | PageHeader.css uses max-width query |

### Accessibility Status

| Aspect | Status | Notes |
|--------|--------|-------|
| Semantic HTML | ✅ Pass | Proper elements and landmarks |
| ARIA usage | ✅ Pass | Labels, roles, states implemented |
| Keyboard navigation | ⚠️ Warning | AppHeader nav, SpreadsheetTable headers missing focus |
| Color contrast | ✅ Pass | Documented and tested combinations |

---

## Top 5 Valuable Improvements

Ranked by ROI (effort vs. impact):

### 1. Add Unit Tests for Custom Hooks

**Impact**: High
**Effort**: Medium
**Description**: The codebase has zero unit tests. Custom hooks like `usePortfolioData`, `useDashboardData`, and `useApiError` contain critical business logic that should be tested in isolation.
**Recommendation**: Add Jest + React Testing Library. Start with hooks in `frontend/src/features/*/hooks/` and utilities in `frontend/src/shared/utils/`. Target 70% coverage on business logic.

### 2. Disable Demo Login in Production

**Impact**: High
**Effort**: Low
**Description**: The `/auth/demo-login` endpoint is accessible in production, creating a demo-user-001 account. While data is isolated, this is unnecessary attack surface.
**Recommendation**: Add `if (config.nodeEnv === 'production') return res.status(404).json({ error: 'Not found' })` at the start of the demo-login route handler.

### 3. Consolidate Error Interfaces

**Impact**: Medium
**Effort**: Low
**Description**: `ApiError` is defined in both `shared/utils/errorTypes.ts` and `shared/api/client.ts` with different structures, causing type confusion.
**Recommendation**: Keep the class in `client.ts`, export from `errorTypes.ts`, remove duplication. Add runtime type guards for all error scenarios.

### 4. Standardize Focus Indicators

**Impact**: Medium
**Effort**: Low
**Description**: Focus indicators use different colors across components (pale-blue, charcoal, muted-sage), creating inconsistent accessibility experience.
**Recommendation**: Define `--focus-color: var(--charcoal)` in tokens.css and use consistently. Update AppHeader.css, Button.css, StatCard.css.

### 5. Create Shared Date Utility

**Impact**: Medium
**Effort**: Low
**Description**: Date parsing for "dd.MM.yyyy" format is scattered across multiple files in frontend and backend without a shared utility.
**Recommendation**: Create `parseDdMmYyyy()` in `backend/src/utils/dateUtils.ts` (already has date utils) and export from `@finans/components` for frontend use.

---

## Top 5 Critical Errors

Ranked by severity:

### 🔴 1. Demo Login Accessible in Production

**Severity**: High
**Category**: Security
**Location**: [authRoutes.ts:95-126](backend/src/routes/authRoutes.ts#L95-L126)
**Description**: The demo-login endpoint has no environment check, allowing anyone to create a demo user in production.
**Impact**: Creates predictable user (demo-user-001) with known ID; potential for demo data pollution; unnecessary attack surface.
**Fix**: Add environment check at route handler start:
```typescript
if (config.nodeEnv === 'production') {
  return res.status(404).json({ error: { message: 'Not found' } });
}
```

### 🔴 2. Missing Unit Test Coverage

**Severity**: High
**Category**: Quality
**Location**: `frontend/src/` (no `__tests__` directories)
**Description**: Zero unit tests exist. All testing relies on E2E tests which are slower and less granular.
**Impact**: Regressions in business logic may go undetected; refactoring is risky; CI feedback loop is slow.
**Fix**: Add Jest + React Testing Library. Prioritize testing hooks with calculations: `usePortfolioData`, `useDashboardData`, `useSparing`, `useGjeld`.

### 🟠 3. AppHeader Navigation Missing Focus Indicators

**Severity**: Medium
**Category**: Accessibility
**Location**: [AppHeader.css:75-113](components/src/components/AppHeader/AppHeader.css#L75-L113)
**Description**: Navigation links have hover and active states but no visible focus indicator for keyboard users.
**Impact**: WCAG 2.4.7 failure; keyboard users cannot navigate the site effectively.
**Fix**: Add to `.app-header .nav-link`:
```css
.app-header .nav-link:focus-visible {
  outline: 2px solid var(--charcoal);
  outline-offset: 2px;
}
```

### 🟠 4. esbuild Moderate Vulnerability

**Severity**: Medium
**Category**: Security
**Location**: `package.json` dependencies (via Vite and Storybook)
**Description**: esbuild <=0.24.2 allows any website to send requests to dev server and read responses.
**Impact**: Development server could leak source code or secrets if developer visits malicious site while dev server runs.
**Fix**: Update Vite and Storybook to versions that use esbuild >=0.25.0. Run `pnpm update vite @storybook/core-common`.

### 🟡 5. Account Removal Cascade Inefficient

**Severity**: Low
**Category**: Performance
**Location**: [userService.ts:181-212](backend/src/services/userService.ts#L181-L212)
**Description**: When removing an account, all snapshots are fetched, filtered locally, then updated individually (N+1 queries).
**Impact**: For users with 36+ months of data, this becomes slow. May timeout for heavy users.
**Fix**: Use CosmosDB bulk operations or batch the snapshot updates. Consider stored procedure for atomic cascade.

---

## Scores Breakdown

### Design Score: 85/100

| Factor | Score | Notes |
|--------|-------|-------|
| Visual Consistency | 18/20 | Excellent design system; minor focus color inconsistency |
| Information Hierarchy | 18/20 | Clear layouts; good use of typography |
| Responsive Design | 16/20 | Mostly mobile-first; PageHeader uses max-width |
| Accessibility | 16/20 | Strong foundation; keyboard navigation gaps |
| User Experience | 17/20 | Polished interactions; good feedback states |

### Code Quality Score: 88/100

| Factor | Score | Notes |
|--------|-------|-------|
| TypeScript Correctness | 20/20 | Strict mode; zero any types; excellent coverage |
| Architecture | 18/20 | Clean separation; large files could be split |
| Error Handling | 18/20 | Comprehensive; minor duplicate error interfaces |
| Code Organization | 18/20 | Excellent structure; consistent patterns |
| Documentation | 14/20 | Good JSDoc; no unit tests; CLAUDE.md comprehensive |

### Security Score: 82/100

| Factor | Score | Notes |
|--------|-------|-------|
| Authentication | 18/20 | Strong EasyAuth + JWT; demo mode concern |
| Authorization | 17/20 | User isolation good; calculators public |
| Input Validation | 18/20 | Comprehensive Zod schemas |
| Dependency Security | 13/20 | 2 moderate vulnerabilities in dev deps |
| Security Config | 16/20 | Helmet + CORS good; demo endpoint exposed |

---

## Recommendations Summary

### Immediate Actions (Do Now)

1. Disable demo login in production builds
2. Add focus-visible to AppHeader navigation links
3. Update esbuild via Vite/Storybook updates

### Short-Term (Next Sprint)

1. Add unit tests for custom hooks and utilities
2. Consolidate error interfaces to single source
3. Standardize focus indicator colors across components
4. Add feature-level error boundaries
5. Create shared date parsing utility

### Long-Term (Roadmap)

1. Consider httpOnly cookies for token storage (XSS mitigation)
2. Add authentication to calculator endpoints
3. Implement audit trail for snapshot edits
4. Add bulk operations for account cascade deletes
5. Set up automated security scanning in CI/CD (npm audit, Snyk)

---

## Appendix

### Files Reviewed

**Backend**:
- `backend/src/index.ts` - App entry and factory
- `backend/src/routes/*.ts` - All route definitions
- `backend/src/controllers/*.ts` - All controllers
- `backend/src/services/*.ts` - All services
- `backend/src/middleware/*.ts` - All middleware
- `backend/src/validators/schemas.ts` - Zod schemas
- `backend/src/config/environment.ts` - Configuration

**Frontend**:
- `frontend/src/main.tsx` - Entry point
- `frontend/src/App.tsx` - Root component
- `frontend/src/features/*/` - All feature modules
- `frontend/src/shared/` - Shared utilities, hooks, API
- `frontend/tsconfig.json` - TypeScript config

**Components**:
- `components/src/styles/tokens.css` - Design tokens
- `components/src/components/*/*.css` - Component styles
- `components/src/components/*/*.tsx` - Component implementations

**Documentation**:
- `.claude/CLAUDE.md` - Project instructions
- `.docs/design-system/ACCESSIBILITY.md` - Accessibility guidelines

### Tools Used

- Static analysis: ESLint, TypeScript compiler (strict mode)
- Security: pnpm audit, manual code review
- Design: Visual inspection, CSS analysis, accessibility checklist

### Methodology

1. Launched 5 parallel exploration agents (haiku model) to analyze:
   - Backend architecture
   - Frontend architecture
   - Security vulnerabilities
   - Design system compliance
   - Code quality metrics

2. Collected structured findings from each agent

3. Cross-referenced findings against:
   - CLAUDE.md project standards
   - OWASP Top 10 checklist
   - WCAG 2.1 Level AA guidelines
   - React/TypeScript best practices

4. Calculated scores using weighted rubric (20 points per factor, 5 factors per area)

5. Prioritized issues by severity and ROI
