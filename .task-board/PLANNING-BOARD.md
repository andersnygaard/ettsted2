# Planning Board - Finans

**Current Focus**: CI/CD improvements and documentation polish (2025-12-06)

---

## Due Diligence Findings

**Report**: [.docs/DUE-DILIGENCE-REPORT.md](../.docs/DUE-DILIGENCE-REPORT.md)

| Score | Area | Status |
|-------|------|--------|
| 85/100 | Design | Good |
| 80/100 | Code Quality | Good |
| 85/100 | Security | Good (corrected) |
| **83/100** | **Overall** | Production-ready |

> **Note**: Many due diligence items were false positives (parseDate, ErrorBoundary, accessibility) - all already implemented correctly.

---

## Top Priorities

| # | Task | Type | Priority | Effort |
|---|------|------|----------|--------|
| 186 | CI security audit | Feature | MEDIUM | Simple |
| 187 | CI E2E tests | Feature | MEDIUM | Medium |
| 185 | Missing Storybook stories | Feature | LOW | Simple |

---

## Full Backlog

### Features (MEDIUM)
- 186-FEATURE-ci-security-audit (add pnpm audit to CI)
- 187-FEATURE-ci-e2e-tests (run Playwright in CI)

### Features (LOW)
- 185-FEATURE-missing-storybook-stories (documentation)

---

## Recently Completed

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
| Done | 160 |
| Backlog | 3 |
| In Progress | 0 |

**Last Updated**: 2025-12-06 (Task Discovery)
