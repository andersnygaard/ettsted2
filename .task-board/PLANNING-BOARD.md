# Planning Board - Finans

**Current Focus**: Security Fixes & Code Quality (Post-Due Diligence 2025-12-07)

---

## Due Diligence Findings (2025-12-07)

**Report**: [.docs/DUE-DILIGENCE-REPORT.md](../.docs/DUE-DILIGENCE-REPORT.md)

| Score | Area | Status |
|-------|------|--------|
| 86/100 | Design | Good |
| 85/100 | Code Quality | Good |
| 80/100 | Security | ✅ Improved |
| **84/100** | **Overall** | Good |

### Critical Issues - ALL FIXED ✅
1. ~~**Dev mode auth bypass**~~ - ✅ FIXED (task 193)
2. ~~**ORDER BY injection pattern**~~ - ✅ FIXED (task 194)
3. ~~**PageSkeleton prop mismatch**~~ - ✅ FIXED (task 195)
4. ~~**CSS typo**~~ - ✅ FIXED (task 196)

---

## Top Priorities

**🎉 All due diligence tasks complete!**

No pending priorities. Run `/discover-tasks` to find new work.

---

## Backlog Summary

| # | Task | Type | Priority | Effort |
|---|------|------|----------|--------|
| - | *Backlog empty* | - | - | - |

---

## Recently Completed

### 203 - Standardize English Variable Names (2025-12-07)
Renamed Norwegian variable names and API fields to English across backend and frontend. Added defensive null handling.

### 202 - Add CSP Headers (2025-12-07)
Added explicit Content Security Policy via Helmet. Allows Google Fonts, restricts scripts to self-origin.

### 201 - Fix CORS No-Origin (2025-12-07)
Requests without Origin header now rejected in production. Dev/CI modes allow no-origin for testing.

### 200 - Add Skip Link (2025-12-07)
Added skip-to-content link for keyboard users. WCAG 2.4.1 compliance for accessibility.

### 199 - Fix Query Key Consistency (2025-12-07)
Added QUERY_KEYS.USER constant. Updated useUser and useImportChat to use constants.

### 198 - Move Tokens to Components (2025-12-07)
Moved tokens.css to components package. External consumers get working design system.

### 197 - Consolidate Formatting Utils (2025-12-07)
Moved numeral.js and date-fns utilities to components. Frontend imports from @finans/components.

### 196 - Fix CSS Typo (2025-12-07)
Fixed `--carcoal-hover` to `--charcoal-hover` in tokens.css. Button disabled state now renders correctly.

### 195 - Fix PageSkeleton Prop Mismatch (2025-12-07)
Removed unnecessary `centered` prop from PageSkeleton and consuming pages. PageHeader always centered by CSS.

### 194 - Fix ORDER BY Injection (2025-12-07)
Replaced string interpolation with safe allowlist pattern in portfolioService.ts. Eliminates NoSQL injection vector.

### 193 - Remove Dev Auth Bypass (2025-12-07)
Removed critical security vulnerability. Dev mode no longer auto-injects mock user. Requires explicit demo token.

### 192 - ESLint no-explicit-any to Error (2025-12-07)
Changed rule from 'warn' to 'error' in all workspaces. Fixed remaining violation in PortfolioPage.tsx.

---

## Statistics

| Status | Count |
|--------|-------|
| Done | 179+ |
| Backlog | 0 |
| In Progress | 0 |

**Last Updated**: 2025-12-07
