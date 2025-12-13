# FEATURE: Storybook Configuration Setup

**Status**: Done
**Created**: 2025-12-01
**Priority**: High
**Labels**: components, storybook, infrastructure
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

The `/components` workspace has Storybook packages installed (v7.6.0) but no configuration files exist. The `src/` directory is empty. This task sets up Storybook infrastructure to enable component development and documentation.

## Desired Outcome

Storybook runs successfully with `pnpm --filter components storybook`, showing a welcome page and ready to accept component stories.

## Acceptance Criteria

- [x] Create `.storybook/main.ts` with Vite builder configuration
- [x] Create `.storybook/preview.ts` with global decorators
- [x] Create `.storybook/preview.css` importing BeerCSS + Nordic Minimal CSS variables
- [x] Create `tsconfig.json` for TypeScript support
- [x] Create `src/index.ts` barrel export file
- [x] Create directory structure: `src/ui/`, `src/forms/`, `src/data/`, `src/layout/`, `src/charts/`
- [x] Verify `pnpm --filter components storybook` starts without errors
- [x] Add Introduction.mdx welcome page

## Technical Approach

**Files to create:**

```
components/
  .storybook/
    main.ts          # Storybook config (Vite builder, addons)
    preview.ts       # Global decorators, parameters
    preview.css      # BeerCSS + Nordic Minimal variables
  src/
    index.ts         # Barrel exports
    ui/              # Core UI components
    forms/           # Form input components
    data/            # Data display components
    layout/          # Layout components
    charts/          # D3.js chart components
  tsconfig.json      # TypeScript config
```

**main.ts config:**
- Use `@storybook/react-vite` builder
- Enable essentials, interactions, links addons
- Configure stories glob: `../src/**/*.stories.@(ts|tsx)`

**preview.css:**
- Import BeerCSS base styles
- Define Nordic Minimal CSS variables (--bone, --muted-sage, etc.)
- Add grain texture overlay

## Dependencies

- None (all packages already installed in package.json)

---

**Next Steps**: Migrate core UI components (102)
