# FEATURE: Animation Utilities (Fade-Up)

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: design-system, animations, css
**Estimated Effort**: Simple - 30 minutes

## Context & Motivation

The design uses subtle fade-up animations on page load for all major sections. This creates a polished, premium feel.

## Reference

Design file: `.docs/design-drafts/draft-1-nordic-minimal.html` (lines 277-292)

## Desired Outcome

CSS animation utilities and React hooks for fade-up effects.

## Acceptance Criteria

- [ ] Create `@keyframes fadeUp` animation in global CSS
- [ ] Create utility classes: `.animate-fade-up`, `.animate-delay-1`, `.animate-delay-2`, etc.
- [ ] Animations start with opacity 0 and translateY(20px)
- [ ] Animation duration: 0.5-0.6s with ease timing
- [ ] Staggered delays for sequential elements (0.1s increments)

## Technical Approach

```css
/* animations.css */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-up {
  opacity: 0;
  animation: fadeUp 0.5s ease forwards;
}

.animate-delay-1 { animation-delay: 0.1s; }
.animate-delay-2 { animation-delay: 0.15s; }
.animate-delay-3 { animation-delay: 0.2s; }
.animate-delay-4 { animation-delay: 0.25s; }
.animate-delay-5 { animation-delay: 0.3s; }
```

## Dependencies

None

---

**Next Steps**: Implement alongside design tokens
