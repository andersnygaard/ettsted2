# FEATURE: Typography Setup (Google Fonts)

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: design-system, typography, fonts
**Estimated Effort**: Simple - 30 minutes

## Context & Motivation

The design uses three Google Fonts:
- Cormorant Garamond (headings) - serif, elegant
- DM Sans (body) - sans-serif, clean
- JetBrains Mono (numbers/data) - monospace

## Reference

Design file: `.docs/design-drafts/draft-1-nordic-minimal.html` (lines 7-9)

## Desired Outcome

Fonts loaded and applied globally with proper fallbacks.

## Acceptance Criteria

- [ ] Add Google Fonts link to `index.html`
- [ ] Set up font-face declarations for offline fallback
- [ ] Apply `--font-heading` to h1-h6 elements
- [ ] Apply `--font-body` to body
- [ ] Apply `--font-mono` to code and data elements
- [ ] Font weights: 300, 400, 500 for Cormorant; 400, 500 for DM Sans; 400, 500 for JetBrains

## Technical Approach

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

## Dependencies

- `021-FEATURE-design-tokens.md` (uses font CSS variables)

---

**Next Steps**: Implement after design tokens
