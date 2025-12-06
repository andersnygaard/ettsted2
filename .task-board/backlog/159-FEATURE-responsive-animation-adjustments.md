# 130-FEATURE: Responsive Animation Adjustments

## Summary
Adjust animations for tablet and mobile viewports. Some animations may be too pronounced or cause performance issues on smaller devices.

## Context
Design includes artifacts for desktop, iPad, and mobile sizes. Animations should be tuned per viewport:
- Reduce animation distances on mobile
- Potentially disable some animations on mobile for performance
- Ensure touch interactions feel responsive

## Acceptance Criteria
- [ ] Reduce translateY values on mobile (e.g., -4px → -2px)
- [ ] Shorten animation durations on mobile
- [ ] Test performance on mobile Safari
- [ ] Ensure no animation-related jank during scroll
- [ ] Touch feedback animations (button press, etc.)

## Technical Approach
1. Add media queries to animations.css
2. Create mobile-specific animation variants
3. Consider `@media (hover: hover)` for hover-only animations
4. Test with Chrome DevTools mobile emulation

### CSS Pattern
```css
@media (max-width: 768px) {
  .calc-card:hover {
    transform: translateY(-2px); /* Reduced from -4px */
  }

  .animate-fade-up {
    animation-duration: 0.3s; /* Reduced from 0.5s */
  }
}
```

## Files to Modify
- [animations.css](frontend/src/styles/animations.css)
- Various component CSS files with hover effects

## Priority
Low

## Effort
Medium (3-4 hours)

## Labels
design, animation, responsive, mobile, performance
