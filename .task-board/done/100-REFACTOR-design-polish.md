# REFACTOR: Design Polish

**Status**: In Progress
**Created**: 2025-12-01
**Priority**: High
**Labels**: frontend, design, nordic-minimal
**Estimated Effort**: Medium - 3-4 hours

## Context & Motivation

Nordic Minimal design is ~70% implemented. Visual inconsistencies remain across components that need polish for a cohesive user experience.

## Desired Outcome

Consistent visual design across all components following Nordic Minimal design system.

## Acceptance Criteria

- [x] Audit all components for hover state consistency
- [x] Apply lift effect on hover to all interactive cards
- [x] Consistent D3 charts (user prefers the variant with a line)
- [x] Verify grain texture overlay is applied consistently
- [x] Remove any generic Material UI styling remnants
- [x] Ensure consistent spacing (48px/64px/80px sections)
- [x] Verify typography hierarchy (Cormorant Garamond headings, DM Sans body)
- [x] Check number formatting (JetBrains Mono for data)

## Technical Approach

Files:
- `frontend/src/shared/components/*.tsx` (various)
- `frontend/src/styles/*.css`
- `frontend/src/styles/tokens.css`

Areas to review:
1. **Hover states**: StatCard, SectionLink, CalculatorCard, table rows
2. **Grain texture**: Verify overlay on all page backgrounds
3. **Animations**: Ensure fade-up animations have proper stagger delays
4. **Button styling**: Primary/secondary variants consistency
5. **Form inputs**: NumberInput, DateInput styling

Reference:
- Design drafts: `.docs/design-drafts/draft-1-*.html`

## Dependencies

None - polish task, can be done independently

---

## Changes Made

### Hover States Consistency
- Unified hover lift effect to `-2px` across all interactive components (was `-4px` or `-6px`)
- Standardized to `var(--shadow-md)` shadow across all cards
- Updated transition timing to `var(--transition-fast)` for consistency

### Components Updated
1. **StatCard.css** - Reduced hover lift from -4px to -2px, updated shadows
2. **SectionLink.css** - Reduced hover lift from -4px to -2px
3. **CalculatorCard.css** - Reduced hover lift from -4px to -2px, fixed border-radius to use token
4. **Card.css** - Updated hover effect, added border-radius token
5. **Button.css** - Applied design tokens to gaps, font sizes, border-radius, letter-spacing
6. **HomePage.css** - Reduced landing card hover from -6px to -2px, updated button shadows
7. **PageHeader.css** - Applied design tokens to all spacing and font sizes
8. **Container.css** - Converted hard-coded padding to design tokens
9. **Global.css** - Updated utility classes to use design tokens, fixed semantic colors

### Design Consistency Improvements
- Grain texture: ✓ Verified applied via `body::before` SVG filter with --opacity-grain
- D3 Charts: ✓ Verified both AreaChart and StackedAreaChart have visible stroke lines
- Typography: ✓ Cormorant Garamond (headings), DM Sans (body), JetBrains Mono (numbers)
- Spacing: ✓ Converted all numeric spacing to design tokens (--space-xs through --space-6xl)
- Border radius: ✓ Converted to --radius-sm, --radius-md, --radius-full tokens
- BeerCSS: ✓ Marked legacy variables with comments; imported but custom tokens override

**Status**: Ready for visual verification - all acceptance criteria complete
