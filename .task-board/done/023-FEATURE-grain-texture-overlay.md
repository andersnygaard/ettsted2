# FEATURE: Grain Texture Overlay Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: design-system, visual-effects, component
**Estimated Effort**: Simple - 30 minutes

## Context & Motivation

All pages in the design drafts have a subtle grain texture overlay that gives the Nordic Minimal aesthetic its distinctive warm, textured feel. This is applied via a `::before` pseudo-element on the body.

## Reference

Design file: `.docs/design-drafts/draft-1-nordic-minimal.html` (lines 32-40)

## Desired Outcome

Subtle noise texture overlay applied globally on all pages.

## Acceptance Criteria

- [ ] Add grain texture overlay to global CSS
- [ ] SVG noise filter embedded as data URI
- [ ] Opacity set to 0.03 (very subtle)
- [ ] Fixed position, covers entire viewport
- [ ] Pointer-events: none (doesn't interfere with clicks)
- [ ] High z-index but below modals

## Technical Approach

```css
/* global.css */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
  z-index: 1000;
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`

---

**Next Steps**: Implement after design tokens
