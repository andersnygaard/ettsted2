# Design System - Nordic Minimal

Welcome to the Finans Design System documentation. This guide covers the design foundations, token reference, components, patterns, and accessibility guidelines for the finans portfolio tracking application.

## What is Nordic Minimal?

Nordic Minimal is a design system inspired by Scandinavian design principles: clean, spacious layouts with warm muted tones and elegant typography. It emphasizes clarity, warmth, elegance, consistency, and accessibility.

## Quick Links

- **[Principles](./PRINCIPLES.md)** - Core design philosophy and design tenets
- **[Tokens](./TOKENS.md)** - Complete CSS variable reference (colors, typography, spacing)
- **[Components](./COMPONENTS.md)** - Component usage guide and when to use each
- **[Patterns](./PATTERNS.md)** - Common layout patterns and composition examples
- **[Accessibility](./ACCESSIBILITY.md)** - A11y guidelines and best practices

## Design Foundations

### Color Palette

The Nordic Minimal palette uses warm, muted tones:

- **Backgrounds**: Bone (#F5F2ED), Warm White (#FDFCFA)
- **Text**: Charcoal (#2C2C2C), Text Secondary (#6B6B6B)
- **Accents**: Muted Sage (#8B9A7D), Soft Terracotta (#C4A484), Pale Blue (#B8C5D0)
- **Semantic**: Gold (#C9A962), Positive (#5A7D5A), Negative (#9D6B5A)

### Typography

- **Headings**: Cormorant Garamond (serif, elegant)
- **Body**: DM Sans (sans-serif, readable)
- **Data**: JetBrains Mono (monospace, precise)

### Spacing Scale

8px base unit: xs (8px) → sm (12px) → md (16px) → lg (20px) → xl (24px) → 2xl (32px) → 3xl (40px) → 4xl (48px) → 5xl (64px) → 6xl (80px)

## Storybook

View interactive component examples:

```bash
pnpm --filter components storybook
```

## Implementation Checklist

When creating new components:

- [ ] Use CSS variables for all colors
- [ ] Use font family variables
- [ ] Add responsive breakpoints (768px, 480px)
- [ ] Include hover/focus states
- [ ] Use BEM naming for CSS classes
- [ ] Export TypeScript types
- [ ] Create Storybook story with variants
- [ ] Format numbers with Norwegian locale

## File References

- **CSS Variables**: `frontend/src/styles/tokens.css`
- **Components**: `components/src/`
- **Storybook Stories**: `components/src/**/*.stories.tsx`
- **Design Drafts**: `.docs/design-drafts/`

---

*Last updated: December 2024*
