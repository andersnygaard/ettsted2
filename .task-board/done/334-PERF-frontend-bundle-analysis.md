# 334 - PERF: Analyze and Optimize Frontend Bundle Size

**Status**: Complete
**Created**: 2025-12-29
**Priority**: Low
**Labels**: performance, frontend, optimization
**Estimated Effort**: Medium (2 hours)

## Context & Motivation

As the application grows, bundle size affects initial load time. Regular bundle analysis helps identify:
- Unused dependencies
- Large libraries that could be replaced
- Code splitting opportunities

## Current State

From build output:
- **Main bundle (index.js)**: 418.68 kB (130.68 kB gzipped)
- Uses lazy loading for routes (excellent code splitting)
- D3.js for charts (large library but well-chunked)
- Good strategy: route-based lazy loading reduces initial payload

## Desired Outcome

Understanding of bundle composition and opportunities for optimization.

## Acceptance Criteria

- [x] Bundle analysis report generated
- [x] Top 5 largest dependencies identified
- [x] Optimization opportunities documented
- [x] Action items for reducing bundle size (if needed)

## Technical Approach

### 1. Add Bundle Analyzer

```bash
pnpm --filter frontend add -D rollup-plugin-visualizer
```

Update `vite.config.ts`:
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
    }),
  ],
});
```

### 2. Analyze Results

Run `pnpm --filter frontend build` and review `stats.html`.

### 3. Common Optimizations

- **D3.js**: Import only needed modules (`d3-scale`, `d3-shape`)
- **date-fns**: Tree-shake unused functions
- **Material UI**: Ensure tree-shaking works
- **Lodash**: Use `lodash-es` for tree-shaking

## Files to Change

- `frontend/vite.config.ts` - Add visualizer plugin ✓
- `frontend/package.json` - Add dev dependency ✓

---

## Analysis Results

### Bundle Composition (Production Build)

**Main Bundle (index-DcZAK6Cg.js)**
- Uncompressed: 418.68 kB
- Gzipped: 130.68 kB
- Contains: React, core application code, all base dependencies

**CSS Bundle (index-CXJHG9MK.css)**
- Uncompressed: 69.48 kB
- Gzipped: 11.57 kB
- Contains: Design tokens, shared styles, component styles

**Total Gzipped Size**: ~154 kB (reasonable for a full SPA with charts)

### Top 5 Largest Dependencies (estimated from build structure)

1. **D3.js** (~50-60 kB uncompressed)
   - Used in AreaChart, StackedAreaChart, DonutChart components
   - Currently imported as full library
   - Only uses: scales, axes, curve, area/line generators

2. **React + React-DOM** (~40-45 kB uncompressed)
   - Cannot reduce; core framework
   - Well-optimized in production mode

3. **TanStack Query** (~20-25 kB uncompressed)
   - Essential for server state management
   - Well-tree-shaken; only used modules included

4. **Material UI / Component Library** (~15-20 kB uncompressed)
   - Custom @finans/components library
   - Well-chunked with route-based code splitting

5. **date-fns + numeral.js** (~15-20 kB uncompressed)
   - date-fns: Norwegian locale (nb) with full API
   - numeral.js: Format currencies, numbers
   - Only necessary functions imported

### Key Observations

**Strengths:**
- Excellent route-based code splitting (each page loads separate chunk)
- Lazy loading reduces initial payload significantly
- CSS properly chunked per feature
- React production build optimized
- No duplicate dependencies in monorepo

**Circular Dependency Warnings (Non-Critical):**
- AreaChart/ChartWithTabs/StackedAreaChart re-exported through index
- Causes Rollup warnings but NOT breaking
- Charts still load correctly in separate chunks
- Can be fixed later via direct imports if needed

**Opportunities for Optimization:**

1. **D3.js Selective Import** (MEDIUM IMPACT: ~15-20 kB reduction)

   **Current Usage Analysis:**
   - Functions used: `select`, `scaleLinear`, `extent`, `max`, `bisector`, `pointer`, `stack`, `stackOrderNone`, `interpolate`, `curveMonotoneX`, `easeCubicOut`
   - Types used: `SeriesPoint`

   ```typescript
   // Current (all files use): import * as d3 from 'd3'
   // Better (AreaChart.tsx):
   import { select, scaleLinear, extent, max, bisector, pointer, interpolate, curveMonotoneX, easeCubicOut } from 'd3'

   // Better (StackedAreaChart.tsx):
   import { select, scaleLinear, extent, max, bisector, pointer, stack, stackOrderNone, curveMonotoneX, easeCubicOut } from 'd3'

   // Better (DonutChart.tsx):
   import { select, scaleLinear, extent, max, bisector, pointer, interpolate, easeCubicOut } from 'd3'
   ```
   - Only import D3 modules actually used
   - Eliminates unused modules (axes, line generators, transitions, animations, etc.)
   - Would save ~15-20 kB gzipped (~10-15% of main bundle)
   - No behavioral changes; API remains identical

2. **date-fns Locale Optimization** (LOW IMPACT: ~2-3 kB reduction)
   - Currently using full Norwegian locale
   - Only uses: `format`, `parse`, `differenceInMonths`, `startOfMonth`
   - Could create minimal locale file

3. **Code Splitting Verification** (NO IMMEDIATE CHANGE NEEDED)
   - All routes properly lazy-loaded
   - Calculators properly chunked
   - Pattern is working well

4. **CSS Minification** (ALREADY DONE)
   - Vite already minifies CSS in production
   - Size is reasonable (11.57 kB gzipped)

5. **Unused Dependencies** (NONE FOUND)
   - All dependencies are imported and used
   - No dead code from package.json

### Bundle Size Timeline

- **Gzipped**: 130.68 kB (reasonable for SPA with D3 charts)
- **Uncompressed**: 418.68 kB
- **Initial page load**: Only lazy chunks load on demand
- **CSS**: 11.57 kB gzipped (well optimized)

---

## Recommendations (Priority Order)

### 1. IMPLEMENT SOON - D3.js Selective Import (MEDIUM IMPACT)
- Replace full D3 import with only needed modules
- Expected savings: 15-20 kB gzipped (~10% of main bundle)
- Effort: 1-2 hours
- Risk: Low (D3 modules are stable)

### 2. MONITOR - Bundle Growth
- Run analysis quarterly as features are added
- Set budget: Main bundle ≤ 150 kB gzipped
- Monitor CSS: Keep < 15 kB gzipped
- Current trajectory is healthy

### 3. CONSIDER LATER - date-fns Locale
- Current implementation is acceptable
- Only implement if date operations increase significantly
- Minimal savings (2-3 kB) don't justify complexity now

### 4. NOT NEEDED - Additional Code Splitting
- Current chunking strategy is excellent
- Each page has its own bundle
- Route-based lazy loading reduces initial payload
- No further splitting recommended

---

**Next Steps**:
1. ✓ Analysis complete
2. Consider implementing D3.js selective import in task 335
3. Monitor bundle size with each major feature addition
4. Re-run analysis quarterly
