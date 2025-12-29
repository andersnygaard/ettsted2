# 334 - PERF: Analyze and Optimize Frontend Bundle Size

**Status**: Backlog
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
- Gzip size: ~101 kB (index.js)
- Uses lazy loading for routes
- D3.js for charts (large library)

## Desired Outcome

Understanding of bundle composition and opportunities for optimization.

## Acceptance Criteria

- [ ] Bundle analysis report generated
- [ ] Top 5 largest dependencies identified
- [ ] Optimization opportunities documented
- [ ] Action items for reducing bundle size (if needed)

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

- `frontend/vite.config.ts` - Add visualizer plugin
- `frontend/package.json` - Add dev dependency

---

**Next Steps**: Run analysis and document findings before implementing optimizations.
