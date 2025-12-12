# Styling Rules

## Stack
CSS Modules pattern, @finans/components design tokens, CSS custom properties

## Structure
- `/styles/global.css` - Base styles, utility classes
- `/features/*/*.css` - Feature-scoped styles
- `@finans/components/styles/tokens.css` - Design tokens (imported)

## Patterns

### Import Tokens
```css
/* At top of any CSS file needing tokens */
@import '@finans/components/styles/tokens.css';
```

### Mobile-First Media Queries
```css
/* Base: mobile (no media query) */
.component {
  flex-direction: column;
  padding: var(--space-md);
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    flex-direction: row;
    padding: var(--space-lg);
  }
}
```

### Hover States (Consistent)
```css
.card:hover {
  transform: translateY(-2px);  /* Always -2px lift */
  box-shadow: var(--shadow-md);
}
```

### Feature CSS Naming
```css
/* features/dashboard/DashboardPage.css */
.dashboard-page { ... }
.dashboard-page__header { ... }
.dashboard-page__grid { ... }
```

## Token Categories

### Spacing
`--space-xs` (4px) → `--space-6xl` (128px)

### Colors (Semantic)
- `--positive`, `--negative` for values
- `--muted-sage` for savings
- `--soft-terracotta` for accent
- `--gold` for milestones

### Typography
- `--font-heading`: Cormorant Garamond
- `--font-body`: DM Sans
- `--font-mono`: JetBrains Mono (numbers)

### Effects
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- `--radius-sm`, `--radius-md`, `--radius-full`
- `--transition-fast`, `--transition-normal`

## Decisions
- Tokens live in `@finans/components` (single source)
- Feature components have colocated CSS files
- BEM-like naming for feature components
- No Tailwind or CSS-in-JS

## Gotchas
- **Never use max-width queries**: Always `min-width` (mobile-first)
- **Hover lift is -2px**: Standardized across all cards, not -4px or -6px
- **Touch targets 44px**: Mobile buttons must be at least 44x44px
- **Import order**: tokens.css must be imported before using variables
- **Grain texture**: Applied via `body::before` in global.css (don't duplicate)
