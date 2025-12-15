# Planning Board - Finans

**Current Focus**: Backlog empty - ready for new tasks

---

## Top Priorities

_No tasks in queue. Use `/discover-tasks` or `/new-task` to add work._

---

## Recently Completed (2025-12-14)

### Session 8 - Skeleton Vertical Slicing (8 tasks)
- **#320** REFACTOR: Rename PageSkeleton → PageLayout - Component renamed, 12 page files updated
- **#321** REFACTOR: Inline dashboard skeleton - Skeleton JSX inlined into DashboardPage
- **#322** REFACTOR: Inline portfolio skeleton - Skeleton JSX inlined into PortfolioPage
- **#323** REFACTOR: Inline sparing skeleton - Skeleton JSX inlined into SparingPage
- **#324** REFACTOR: Inline gjeld skeleton - Skeleton JSX inlined into GjeldPage
- **#325** REFACTOR: Inline pensjon skeleton - Skeleton JSX inlined into PensjonPage
- **#326** REFACTOR: Delete skeletons folder - Moved CSS to shared/styles, deleted 5 skeleton components
- **#327** BUG: Dashboard milestone box sizing - Added box-sizing: border-box

### Session 7 - Bug Fixes, Features, Refactoring (10 tasks)
- **#310** BUG: Sticky action column overlap - Added overflow-x: auto, 44px min-width
- **#311** FEATURE: Import agent fuzzy matching - Levenshtein-based account matching with two-phase confirmation
- **#312** BUG: Duplicate min-height 100vh - Replaced with flex: 1 in Layout.css
- **#313** REFACTOR: PageSkeleton base styles - Added background/padding to component
- **#314** REFACTOR: Cleanup PageSkeleton users - Removed duplicate CSS from 6 pages
- **#315** REFACTOR: Migrate calculator pages - 4 calculator pages now use PageSkeleton
- **#316** REFACTOR: Migrate EconomyPage - Settings page now uses PageSkeleton
- **#317** REFACTOR: Migrate ImportPage - Chat interface migrated with layout overrides
- **#318** BUG: Spreadsheet hover/zebra conflict - Added combined selectors for even row hover
- **#319** FEATURE: Import agent better summary - Shows amounts, singular/plural dates, 💰 emoji

## Previously Completed (2025-12-13)

### Session 6 - Bug Fixes, Tests, Features (9 tasks)
- **#301** BUG: Economy page mobile number overflow - Already fixed (verified CSS was correct)
- **#302** FEATURE: Missing Storybook stories - Added 5 story files (77 story variations)
- **#303** TEST: E2E tests for Import Agent - Created 11 comprehensive E2E tests
- **#304** A11Y: Keyboard navigation tests - Created 13 accessibility E2E tests
- **#305** FEATURE: Dashboard net worth chart - Added AreaChart to Oversikt page
- **#306** REFACTOR: OnboardingPage.css mobile-first - Converted to min-width pattern
- **#307** FEATURE: Primary residence loan selection - Added isPrimaryResidence radio to gjeld, loan calculator defaults
- **#308** BUG: Pensjon totalt shows stacked - Fixed to show single combined total line
- **#309** BUG: Sparing hero numbers overflow - Added fluid typography with clamp()

## Previously Completed (2025-12-12)

### Session 5 - Bug Fixes and Features (7 tasks)
- **#294** BUG: Pensjon chart data grouping - Fixed account collection to include all historical accounts and corrected aggregation logic
- **#295** FEATURE: Chart time selector redesign - Moved selector below charts with pill-button styling
- **#296** FEATURE: Chart hover tooltip - Added interactive hover with tooltips, vertical lines, and data dots
- **#297** BUG: Loans list double border - Fixed CSS double border between last loan row and sum row
- **#298** REFACTOR: Unified Tabs component - Consolidated 3 tab implementations into reusable Tabs component
- **#299** DESIGN: Minimal time selector - Simplified to text-only right-aligned links
- **#300** FEATURE: Tooltip flip positioning - Smart left/right positioning based on cursor location

### Session 4 - Features (2 tasks)
- **#292** Advanced Monte Carlo - Added inflation-adjusted calculations with Enkel/Avansert tabs
- **#293** Eiendom Category - Added optional real estate tracking category

### Session 3 - CSS, Data, Features, and Bug Fixes (14 tasks)
- **#270** A11Y: Modal ARIA Attributes (done earlier)
- **#271** REFACTOR: Mobile-first media queries - All 11 CSS files converted to min-width pattern
- **#280** Seed data improvements - 37 months of realistic market data for all 3 demo profiles
- **#281** README architecture diagram - Added mermaid diagrams for monorepo and runtime architecture
- **#282** Fleksilån calculator - Full backend API + frontend tab for flexible loan payoff calculations
- **#283** Portfolio year boundary bug - Fixed year dropdown to include next year
- **#284** Portfolio show 24 months - Dynamic pagination for "Alle år" filter
- **#285** Portfolio column width/tooltip - Min 80px width + smart tooltip positioning
- **#286** Sparing page improvements - Interactive expandable metrics with explanations
- **#287** Chart tabs - ChartWithTabs component with Totalt/Per Konto views for all 3 pages
- **#288** Gjeld sum row - Total debt row when multiple loans exist
- **#289** Chart time range selector - YTD/1 år/3 år/5 år/Alle with D3 nice axes
- **#290** Import partial update bug - Smart merge preserves existing account values
- **#291** Monte Carlo improvements - Y-axis scaling fix + Curvo reference link

## Previously Completed (2025-12-09)

### Session 2 - Bug Fixes and Features (10 tasks)
- **#257** A11Y: Modal focus handling fix
- **#261** BUG: Charts not rendering (ResizeObserver fix)
- **#262** FEATURE: Portfolio mobile card view
- **#263** BUG: Mobile menu excessive space
- **#264** REFACTOR: Number formatting consistency
- **#265** BUG: Pensjon chart duplicate x-axis labels
- **#266** A11Y: Chart accessibility improvements
- **#267** FEATURE: Portfolio export mobile-friendly
- **#268** PERF: Chart render optimization (memoization)
- **#269** TEST: E2E mobile responsive tests

### Session 1 - Accessibility, Security, Testing
- **#250** A11Y: AppHeader focus indicators
- **#251** Security: Update esbuild dependencies
- **#252** Perf: Parallel account cascade
- **#253** Refactor: Consolidate error interfaces
- **#254** A11Y: Standardize focus colors
- **#255** A11Y: SpreadsheetTable group header focus
- **#256** Refactor: Feature-level error boundaries
- **#258** Test: Unit tests for custom hooks
- **#259** Security: Calculator authentication

### 249 - Demo Login Rate Limiting
Added dedicated rate limiter (5 req/15min) to `/auth/demo-login` endpoint with Norwegian error messages.

---

## Statistics

| Status | Count |
|--------|-------|
| Done | 327 |
| Backlog | 0 |
| In Progress | 0 |

**Last Updated**: 2025-12-14
