# Task Discovery Report - 2025-11-29

## Summary

**Tasks Created**: 50 new tasks (021-070)
**Total Backlog**: 62 tasks
**Focus**: Nordic Minimal design implementation from design drafts

## Breakdown by Category

### Design System Foundation (4 tasks)
| # | Task | Priority | Effort |
|---|------|----------|--------|
| 021 | Design Tokens (CSS Custom Properties) | High | Simple |
| 022 | Typography Setup (Google Fonts) | High | Simple |
| 023 | Grain Texture Overlay | Medium | Simple |
| 024 | Animation Utilities (Fade-Up) | Medium | Simple |

### Shared Components (18 tasks)
| # | Task | Priority | Effort |
|---|------|----------|--------|
| 025 | App Header | High | Simple |
| 026 | Avatar Component | Medium | Simple |
| 027 | Page Header Component | High | Simple |
| 028 | Breadcrumb Component | Low | Simple |
| 029 | Button Component | High | Simple |
| 030 | Card Component | High | Simple |
| 031 | Stat Card Component | High | Simple |
| 032 | Hero Number Component | High | Simple |
| 033 | Progress Bar Component | High | Simple |
| 034 | Milestone Card | High | Simple |
| 035 | Section Link Card | Medium | Simple |
| 043 | Modal Component | High | Simple |
| 044 | Number Input Component | High | Simple |
| 045 | Date Input Component | High | Simple |
| 048 | Area Chart Component (D3.js) | High | Complex |
| 056 | Stacked Area Chart | Medium | Medium |
| 069 | Container Component | Medium | Simple |
| 070 | Loading Skeleton Components | Medium | Simple |

### Dashboard (Oversikt) Page (4 tasks)
| # | Task | Priority | Effort |
|---|------|----------|--------|
| 036 | Quick Stats Grid | High | Simple |
| 037 | Oversikt Page | High | Medium |
| 065 | Dashboard Data Hook | High | Simple |
| 068 | Update Layout | High | Simple |

### Portfolio Page (6 tasks)
| # | Task | Priority | Effort |
|---|------|----------|--------|
| 038 | Spreadsheet Table | High | Complex |
| 039 | Table Header Controls | Medium | Simple |
| 040 | Table Footer Pagination | Medium | Simple |
| 041 | Portfolio Page | High | Medium |
| 042 | New Month Modal | High | Medium |
| 067 | Update Routes | High | Simple |

### Sparing Page (4 tasks)
| # | Task | Priority | Effort |
|---|------|----------|--------|
| 046 | F.I.R.E. Section Component | High | Medium |
| 047 | Stats Row Component | Medium | Simple |
| 049 | Sparing Page | High | Medium |
| 066 | Sparing Data Hook | High | Simple |

### Gjeld Page (4 tasks)
| # | Task | Priority | Effort |
|---|------|----------|--------|
| 050 | Dekning Circle (Donut Chart) | Medium | Medium |
| 051 | Dekning Section Component | Medium | Simple |
| 052 | Loans List Component | Medium | Simple |
| 053 | Gjeld Page | Medium | Medium |

### Pensjon Page (4 tasks)
| # | Task | Priority | Effort |
|---|------|----------|--------|
| 054 | Breakdown Cards Component | Medium | Simple |
| 055 | OTP Section Component | Medium | Simple |
| 057 | Pensjon Page | Medium | Medium |

### Calculators (6 tasks)
| # | Task | Priority | Effort |
|---|------|----------|--------|
| 058 | Calculator Card Component | Medium | Simple |
| 059 | Kalkulatorer Page | Medium | Simple |
| 060 | Compound Calculator Page | High | Medium |
| 061 | F.I.R.E. Calculator Page | High | Medium |
| 062 | Loan Calculator Page | Medium | Medium |
| 063 | Monte Carlo Page | Medium | Complex |
| 064 | Monte Carlo Backend | Medium | Medium |

## Priority Breakdown

| Priority | Count | Description |
|----------|-------|-------------|
| **High** | 28 | Core features, design foundation, must-haves |
| **Medium** | 20 | Supporting features, nice-to-haves |
| **Low** | 2 | Optional enhancements |

## Effort Breakdown

| Effort | Count | Time Estimate |
|--------|-------|---------------|
| **Simple** | 35 | 30 min - 2 hours each |
| **Medium** | 18 | 2-4 hours each |
| **Complex** | 9 | 4-6 hours each |

## Recommended Implementation Order

### Phase 1: Design Foundation (Start Here)
1. `021-FEATURE-design-tokens.md` - CSS variables
2. `022-FEATURE-typography-setup.md` - Fonts
3. `023-FEATURE-grain-texture-overlay.md` - Visual texture
4. `024-FEATURE-animation-utilities.md` - Animations

### Phase 2: Core Components
5. `029-FEATURE-button-component.md` - Buttons
6. `030-FEATURE-card-component.md` - Cards
7. `027-FEATURE-page-header-component.md` - Page headers
8. `025-FEATURE-app-header.md` - Navigation header
9. `026-FEATURE-avatar-component.md` - User avatar
10. `069-FEATURE-container-component.md` - Container widths

### Phase 3: Layout & Dashboard
11. `068-FEATURE-update-layout.md` - Nordic layout
12. `032-FEATURE-hero-number-component.md` - Hero values
13. `031-FEATURE-stat-card-component.md` - Stat cards
14. `036-FEATURE-quick-stats-grid.md` - Stats grid
15. `033-FEATURE-progress-bar-component.md` - Progress bars
16. `034-FEATURE-milestone-card.md` - Milestone display
17. `035-FEATURE-section-link-card.md` - Section links
18. `065-FEATURE-dashboard-data-hook.md` - Data hook
19. `037-FEATURE-oversikt-page.md` - Dashboard page

### Phase 4: Form Components
20. `043-FEATURE-modal-component.md` - Modal dialogs
21. `044-FEATURE-number-input-component.md` - Number inputs
22. `045-FEATURE-date-input-component.md` - Date inputs

### Phase 5: Charts (D3.js)
23. `048-FEATURE-area-chart-component.md` - Area charts
24. `056-FEATURE-stacked-area-chart.md` - Stacked charts
25. `050-FEATURE-dekning-circle-component.md` - Donut chart

### Phase 6: Additional Pages
26. Portfolio page components (038-042)
27. Sparing page (046-049)
28. Gjeld page (051-053)
29. Pensjon page (054-057)
30. Kalkulatorer (058-064)

### Phase 7: Polish
31. `070-FEATURE-loading-skeleton.md` - Loading states
32. `067-FEATURE-update-routes.md` - All routes

## Existing Tasks (Pre-Discovery)

These 12 tasks already existed before this discovery:

| # | Task | Status |
|---|------|--------|
| 009 | Portfolio Dashboard | Keep - more specific D3 chart details |
| 010 | Portfolio Tracker UI | Keep - add/edit functionality |
| 011 | Compound Calculator | Superseded by 060 |
| 012 | Monte Carlo Simulator | Superseded by 063 |
| 013 | Validation Framework | Keep - backend focus |
| 014 | Error Handling | Keep - backend focus |
| 015 | CI/CD Workflows | Keep - infrastructure |
| 016 | LLM Data Import | Keep - AI feature |
| 017 | Playwright E2E Tests | Keep - testing |
| 018 | Component Library Foundation | Keep - Storybook setup |
| 019 | Storybook Setup | Keep - documentation |
| 020 | Asset Allocation Chart | Keep - additional viz |

## Notes

- All tasks reference design draft files for exact specifications
- Components are designed for reusability across pages
- Norwegian localization is already complete (task 004)
- Backend API is ready (tasks 001-008 complete)
- Tasks are intentionally granular (one component per task)

## Next Steps

1. Review this report with stakeholder
2. Start with Phase 1 (Design Foundation)
3. Use `start-working` skill to begin implementation
4. Update PLANNING-BOARD.md with top priorities
