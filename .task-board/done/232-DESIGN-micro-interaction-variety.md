# 232 - Micro-interaction Variety

**Type**: DESIGN
**Priority**: High
**Effort**: Medium (1-2 hours)
**Labels**: frontend, polish, ux

## Context

Currently, almost every interactive element uses the same hover effect: `translateY(-4px)`. This creates a mechanical, repetitive feel that undermines the otherwise thoughtful Nordic Minimal design system.

Different UI elements have different purposes and should communicate their interactivity differently:
- **Cards**: Lift to show "clickable container"
- **Buttons**: Press down to show "actionable"
- **Icons**: Scale/rotate to show "interactive detail"
- **Links**: Underline/color to show "navigation"

## Problem

Files with repetitive hover effects:
- [SectionLink.css](../../components/src/navigation/SectionLink/SectionLink.css) - `translateY(-4px)`
- [CalculatorCard.css](../../frontend/src/features/calculators/CalculatorCard.css) - `translateY(-4px)`
- [HomePage.css](../../frontend/src/features/dashboard/HomePage.css) - `translateY(-4px)` on feature cards
- [Button.css](../../components/src/ui/Button/Button.css) - `translateY(-1px)` (at least different, but should press down)

## Acceptance Criteria

- [x] Cards use lift + shadow deepen effect (current approach, but enhance shadow)
- [x] Buttons use press-down effect (`translateY(1px)` + shadow shrink)
- [x] Icons use scale effect (1.05-1.1x) with optional rotation
- [x] Navigation links use underline animation + color shift
- [x] SectionLink arrow has distinct animation (translateX on hover)
- [x] No two different element types share identical hover effects
- [x] All transitions use consistent timing (200-300ms ease-out)

## Technical Approach

### 1. Button Press Effect
```css
/* Button.css */
.btn:hover {
  transform: translateY(1px); /* Press DOWN, not up */
  box-shadow: var(--shadow-sm); /* Smaller shadow = pressed */
}
.btn:active {
  transform: translateY(2px);
  box-shadow: none;
}
```

### 2. Card Lift + Shadow
```css
/* Keep translateY(-4px), but enhance shadow */
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg); /* Deeper shadow on lift */
}
```

### 3. Icon Scale
```css
.icon-interactive:hover {
  transform: scale(1.1);
}
/* Optional: rotation for specific icons */
.icon-rotate:hover {
  transform: rotate(5deg) scale(1.05);
}
```

### 4. Link Underline Animation
```css
.link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 200ms ease-out;
}
.link:hover::after {
  width: 100%;
}
.link:hover {
  color: var(--charcoal); /* Darken on hover */
}
```

### 5. SectionLink Arrow
```css
.section-link__arrow {
  transition: transform 200ms ease-out;
}
.section-link:hover .section-link__arrow {
  transform: translateX(4px);
}
```

## Files to Modify

- `components/src/ui/Button/Button.css`
- `components/src/navigation/SectionLink/SectionLink.css`
- `frontend/src/features/calculators/CalculatorCard.css`
- `frontend/src/features/dashboard/HomePage.css`
- `components/src/styles/tokens.css` (add shadow-lg if missing)

## Testing

- [x] Verify all hover effects feel distinct
- [x] Test transitions are smooth (no jank)
- [x] Check reduced-motion preference still works
- [x] Visual regression check in Storybook

## Related Plans

- [229-DESIGN-use-css-variables-everywhere.md](./229-DESIGN-use-css-variables-everywhere.md)
