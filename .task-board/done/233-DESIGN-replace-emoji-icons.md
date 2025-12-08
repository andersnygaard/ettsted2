# 233 - Replace Emoji Icons with SVG Icons

**Type**: DESIGN
**Priority**: High
**Effort**: Low (30-45 min)
**Labels**: frontend, polish, consistency

## Context

The CalculatorCard components use emoji icons (📈, 🎯, 🏠, 🎲) which feel informal and inconsistent with the premium Nordic Minimal aesthetic. Emojis render differently across platforms and don't match the refined typography choices.

## Problem

Location: [CalculatorsPage.tsx](../../frontend/src/features/calculators/CalculatorsPage.tsx)

Current implementation:
```tsx
<CalculatorCard
  title="Rentes rente"
  description="Se hvordan sparingen din vokser over tid"
  icon="📈"
  ...
/>
```

Issues:
- Emojis are informal for a finance app
- Cross-platform rendering inconsistency
- Can't style color/size precisely
- Doesn't match serif + monospace typography system

## Acceptance Criteria

- [x] All calculator card emojis replaced with SVG icons
- [x] Icons match the app's visual language (thin strokes, minimal)
- [x] Icons can be styled with CSS (color, size)
- [x] Icon component extended with 4 new icons
- [x] Consistent icon size across all calculator cards (24px)
- [x] Icons work with light/dark themes (uses currentColor)

## Technical Approach

### Option A: Inline SVG Icons (Recommended)
Create simple, custom SVG icons that match Nordic Minimal aesthetic:

```tsx
// components/src/ui/Icon/icons.tsx
export const TrendingUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M23 6l-9.5 9.5-5-5L1 18" />
    <path d="M17 6h6v6" />
  </svg>
);

export const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path d="M9 22V12h6v10" />
  </svg>
);

export const DiceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8" cy="8" r="1" fill="currentColor" />
    <circle cx="16" cy="8" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="8" cy="16" r="1" fill="currentColor" />
    <circle cx="16" cy="16" r="1" fill="currentColor" />
  </svg>
);
```

### Option B: Lucide React (if already in dependencies)
Use lucide-react for consistent, minimal icons:
```tsx
import { TrendingUp, Target, Home, Dice5 } from 'lucide-react';
```

### Icon Mapping
| Current Emoji | SVG Icon | Calculator |
|---------------|----------|------------|
| 📈 | TrendingUp | Rentes rente |
| 🎯 | Target | F.I.R.E. |
| 🏠 | Home | Lånekalkulator |
| 🎲 | Dice | Monte Carlo |

## Files to Modify

- `frontend/src/features/calculators/CalculatorsPage.tsx` - replace emoji props
- `frontend/src/features/calculators/CalculatorCard.tsx` - update icon prop type
- `components/src/ui/Icon/` - create icon components (if Option A)

## Testing

- [ ] All icons render correctly
- [ ] Icons scale properly at different sizes
- [ ] Icons visible in both light/dark contexts
- [ ] Storybook stories updated for CalculatorCard

## Related Plans

- [232-DESIGN-micro-interaction-variety.md](./232-DESIGN-micro-interaction-variety.md) - icons can have hover scale effect

## Resolution

Added 4 new SVG icons to Icon component (trending-up-chart, target, home, dice).
Updated CalculatorCard icon prop to accept ReactNode.
Replaced all emoji strings in CalculatorsPage with Icon components.
Icons use currentColor for theme compatibility and 24px size for consistency.

Completed: 2025-12-08
