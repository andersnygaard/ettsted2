# 251 - Update esbuild Dependencies

## Type
Security

## Priority
High

## Description
Update Storybook and Vite to resolve esbuild vulnerability (GHSA-67mh-4wv8-2f99). Current vulnerable versions:
- `esbuild@0.18.20` via `@storybook/core-common` (Storybook 7.6.0)
- `esbuild@0.21.5` via Vite 5.0.4

Patched version required: esbuild >=0.25.0

## Source
Due Diligence Report - Critical Error #4, pnpm audit

## Implementation

```bash
# Update Storybook
pnpm --filter components update storybook @storybook/react @storybook/react-vite @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-links

# Update Vite
pnpm --filter frontend update vite @vitejs/plugin-react

# Verify fix
pnpm audit
```

## Acceptance Criteria
- [ ] `pnpm audit` shows no esbuild vulnerabilities
- [ ] Storybook still builds and runs
- [ ] Frontend still builds and runs
- [ ] No breaking changes in build output

## Effort
Medium (1 hour - may require fixing breaking changes)
