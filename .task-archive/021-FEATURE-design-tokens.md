# FEATURE: Design Tokens (CSS Custom Properties)

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: design-system, css, foundation
**Estimated Effort**: Simple - 1-2 hours

## Context & Motivation

The design drafts define a Nordic Minimal design system with specific colors, typography, and spacing. These need to be implemented as CSS custom properties for consistent styling across all components.

## Reference

Design file: `.docs/design-drafts/draft-1-nordic-minimal.html`

## Desired Outcome

CSS custom properties file defining all design tokens:
- Color palette (bone, warm-white, charcoal, muted-sage, etc.)
- Typography (font families, sizes, weights)
- Spacing values
- Border radius
- Shadows
- Transitions

## Acceptance Criteria

- [ ] Create `/frontend/src/styles/tokens.css` with all CSS custom properties
- [ ] Colors: `--bone`, `--warm-white`, `--charcoal`, `--muted-sage`, `--soft-terracotta`, `--pale-blue`, `--text-secondary`, `--border`, `--gold`, `--positive`, `--negative`
- [ ] Typography: `--font-heading`, `--font-body`, `--font-mono`
- [ ] Import tokens in `global.css`
- [ ] Document color usage in comments

## Technical Approach

```css
/* tokens.css */
:root {
  /* Colors - Nordic Minimal */
  --bone: #F5F2ED;
  --warm-white: #FDFCFA;
  --charcoal: #2C2C2C;
  --muted-sage: #8B9A7D;
  --soft-terracotta: #C4A484;
  --pale-blue: #B8C5D0;
  --text-secondary: #6B6B6B;
  --border: rgba(44, 44, 44, 0.08);
  --border-strong: rgba(44, 44, 44, 0.15);
  --gold: #C9A962;
  --positive: #5A7D5A;
  --negative: #9D6B5A;

  /* Typography */
  --font-heading: 'Cormorant Garamond', serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 48px;
  --space-xl: 64px;

  /* Transitions */
  --transition-fast: 0.2s ease;
  --transition-medium: 0.3s ease;
}
```

## Dependencies

None - foundational task

---

**Next Steps**: Implement immediately, blocks all other UI tasks
