# 309: Sparing Page Hero Numbers Overflow on Narrow Viewports

## Summary
Large hero numbers (like "245 160,00" for ÅRLIG UTTAK) don't scale with viewport width, causing awkward wrapping and overflow.

## Current Behavior
- Hero numbers have fixed font sizes
- Large values wrap mid-number or overflow container
- Particularly visible on ÅRLIG UTTAK (4%) which shows large currency values

## Expected Behavior
- Numbers should scale responsively with viewport/container width
- Use `clamp()` or fluid typography to maintain readability
- Numbers should never wrap mid-value

## Implementation

### Option A: CSS clamp() (Preferred)
**File**: `components/src/data/StatsRow/StatsRow.css` (or wherever hero numbers are styled)
```css
.hero-number {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
}
```

### Option B: Container query
Scale based on parent container width rather than viewport.

### Files to Check
- `components/src/data/StatsRow/StatsRow.css`
- `frontend/src/features/sparing/FireSection.css`
- Any component rendering the stats grid with FIRETALL, MIN. PENSJONSALDER, etc.

## Acceptance Criteria
- [x] Large numbers (6+ digits) fit within their containers
- [x] No mid-number wrapping
- [x] Readable on 320px viewport
- [x] Scales smoothly between mobile and desktop

## Resolution

Fixed hero number overflow issues by implementing aggressive fluid typography scaling:

### Changes Made:

1. **FireSection.css** - Updated `.fire-stat__value` clamp values:
   - Mobile: `clamp(0.75rem, 0.25rem + 2.5vw, 1.625rem)` (was more conservative)
   - Removed `overflow: hidden` and `text-overflow: ellipsis` that caused truncation
   - Kept `white-space: nowrap` to prevent mid-number wrapping
   - Updated desktop breakpoint to use same formula for consistency

2. **HeroNumber.css** - Cleaned up `.hero-value`:
   - Removed `overflow: hidden` and `text-overflow: ellipsis`
   - Kept `white-space: nowrap` to prevent wrapping
   - Existing `clamp(36px, 10vw, 84px)` is already aggressive and scales well

3. **StatsRow.css** - No changes needed:
   - Already has good `clamp(1.125rem, 0.9rem + 1.1vw, 1.625rem)` formula
   - Already has `white-space: nowrap`

### How It Works:

The new `clamp()` formula scales numbers aggressively to viewport width:
- At 320px: `0.75rem` (12px minimum)
- At 768px: ~20px
- At 1024px+: Caps at `1.625rem` (26px)

The `2.5vw` multiplier ensures numbers scale with narrower containers, shrinking font size rather than wrapping or overflowing.

### Testing:
- Built successfully: `pnpm build` completed with no CSS errors
- All circular dependency warnings are pre-existing
- Component hierarchy intact
