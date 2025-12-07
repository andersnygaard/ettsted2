# Planning Board - Finans

**Current Focus**: Due Diligence Fixes (2025-12-07)

---

## Due Diligence Findings (Updated 2025-12-07)

**Report**: [.docs/DUE-DILIGENCE-REPORT.md](../.docs/DUE-DILIGENCE-REPORT.md)

| Score | Area | Status |
|-------|------|--------|
| 82/100 | Design | Good - Minor token consistency needed |
| 81/100 | Code Quality | Good - DRY violations in error classes |
| 78/100 | Security | Good - Dev mode hardening recommended |
| **80/100** | **Overall** | Production-ready |

### Issues Found (2025-12-07) - ALL RESOLVED ✅
1. ~~**Frontend `any` types** - 4 instances in error handlers~~ → Fixed in task 188
2. ~~**Duplicate error classes** - cosmosHelpers.ts duplicates AppError.ts~~ → Fixed in task 189
3. ~~**Duplicate verifyDemoToken()** - Exists in both auth.ts and authRoutes.ts~~ → Fixed in task 190
4. ~~**Hardcoded RGBA values** - 12+ instances should use CSS tokens~~ → Fixed in task 191
5. ~~**ESLint config** - no-explicit-any set to 'warn' not 'error'~~ → Fixed in task 192

---

## Top Priorities

**All due diligence items completed!** 🎉

Backlog is empty. Run `/discover-tasks` to find new work.

---

## Recently Completed

### 192 - ESLint no-explicit-any to Error (2025-12-07)
Changed rule from 'warn' to 'error' in all workspaces. Fixed remaining violation in PortfolioPage.tsx.

### 191 - CSS Token RGBA Values (2025-12-07)
Replaced 26 hardcoded rgba() values with CSS custom properties. Added 24 opacity variant tokens.

### 190 - Extract verifyDemoToken (2025-12-07)
Created shared tokenUtils.ts utility. Removed duplicate from auth.ts and authRoutes.ts.

### 189 - Consolidate Error Classes (2025-12-07)
Removed duplicate NotFoundError, ConflictError, ValidationError from cosmosHelpers.ts. Now imports from AppError.ts.

### 188 - Fix Frontend any Types (2025-12-07)
Created errorTypes.ts utility with type guards. Fixed 4 `any` types in AuthContext and OnboardingWizard.

### 185 - Missing Storybook Stories (2025-12-07)
Added stories for PageSkeleton and Placeholder components. Fixed broken imports in AllComponents.stories.tsx.

### 187 - CI E2E Tests (2025-12-07)
Added Playwright E2E tests to CI pipeline with CI mock mode for database-free testing.

### 186 - CI Security Audit (2025-12-07)
Added `pnpm audit --audit-level=high` to CI pipeline.

### 186 - E2E Coverage Expansion (2025-12-06)
Added `/import` and `/min-okonomi` to E2E test suite. All 5 tests pass with 14 pages covered.

### 184 - Remove Console.log Statements (2025-12-06)
Added ESLint rule, cleaned up debug logs from production code.

### 182 - Monte Carlo E2E Test (2025-12-06)
Re-enabled Monte Carlo in E2E tests. Passes 10/10 runs.

### 181 - Dashboard SectionLink URLs (2025-12-06)
Fixed incorrect hrefs on Sparing & Kalkulatorer links.

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
| Done | 168 |
| Backlog | 0 |
| In Progress | 0 |

**Last Updated**: 2025-12-07
