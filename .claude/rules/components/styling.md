# Styling Rules

## Stack
Custom CSS with CSS custom properties (tokens.css)

## Structure
- `/styles/tokens.css` - Design tokens (colors, spacing, typography, shadows)
- Component CSS co-located: `ComponentName/ComponentName.css`

## Patterns
- BEM-style naming: `.component`, `.component__element`, `.component--modifier`
- Mobile-first: base styles = mobile, `@media (min-width: ...)` for larger screens
- Never `max-width` queries - always `min-width`
- Use design tokens for all values - no magic numbers

```css
.component {
  /* Mobile base */
  padding: var(--space-md);
  color: var(--charcoal);
}

@media (min-width: 768px) {
  .component {
    padding: var(--space-lg);
  }
}
```

## Key Tokens
- Colors: `--bone`, `--warm-white`, `--charcoal`, `--muted-sage`, `--negative`, `--positive`, `--gold`
- Spacing: `--space-xs` (8px) through `--space-6xl` (80px)
- Typography: `--font-heading` (Cormorant Garamond), `--font-body` (DM Sans), `--font-mono` (JetBrains Mono)
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- Radius: `--radius-sm` (2px), `--radius-md` (4px) - Nordic Minimal uses minimal radius
- Z-index: `--z-base` (1), `--z-dropdown` (100), `--z-modal` (1000)

## Decisions
- Minimal border-radius (2-4px) for Nordic aesthetic
- Subtle shadows with low opacity
- Touch targets minimum 44x44px (`--touch-target-min`)

## Gotchas
- Category colors for tables: `--category-sparing`, `--category-gjeld`, `--category-pensjon`
- Opacity variants exist: `--muted-sage-light-2` (20%), `--negative-light` (10%)
- PageHeader always centered - never left-align
- Use `--border` for subtle borders, `--border-strong` for emphasis
