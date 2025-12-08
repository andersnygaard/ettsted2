# 237 - Dashboard Milestone Section Lightening

**Type**: DESIGN
**Priority**: Low
**Effort**: Low (15-20 min)
**Labels**: frontend, polish, dashboard

## Context

The dashboard milestone section uses a dark charcoal-to-light gradient that feels visually heavy compared to the rest of the Nordic Minimal light aesthetic. This section should celebrate achievements but currently feels like a dark "block" breaking the page flow.

## Problem

Location: [DashboardPage.css](../../frontend/src/features/dashboard/DashboardPage.css)

Current implementation (approximately):
```css
.milestone-section {
  background: linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-light) 100%);
}
```

Issues:
- Dark gradient is jarring against bone/warm-white page
- Breaks visual flow of the page
- Gold milestone highlights compete with dark background
- Feels "heavy" for a celebratory element

## Acceptance Criteria

- [x] Milestone section uses lighter, warmer background
- [x] Gold accents stand out clearly
- [x] Section feels celebratory, not heavy
- [x] Maintains visual distinction from other cards
- [x] Consistent with Nordic Minimal aesthetic

## Technical Approach

### Option A: Warm Tinted Background (Recommended)
```css
.milestone-section {
  background: linear-gradient(
    135deg,
    rgba(201, 169, 98, 0.08) 0%,  /* gold tint */
    rgba(196, 164, 132, 0.06) 100% /* soft-terracotta tint */
  );
  border: 1px solid var(--gold-light);
}
```

### Option B: Subtle Gold Border Only
```css
.milestone-section {
  background: var(--warm-white);
  border: 2px solid var(--gold);
  border-radius: var(--radius-lg);
}
```

### Option C: Soft Gradient with Bone Base
```css
.milestone-section {
  background: linear-gradient(
    135deg,
    var(--bone) 0%,
    var(--warm-white) 100%
  );
  box-shadow: inset 0 0 0 2px var(--gold-light);
}
```

### Recommendation
**Option A** provides the best balance — subtle warmth without being heavy, and the gold tint ties into the milestone theme.

### Additional Polish
```css
/* Add subtle glow effect on milestone achieved */
.milestone-achieved {
  box-shadow: 0 0 20px rgba(201, 169, 98, 0.2);
}
```

## Files to Modify

- `frontend/src/features/dashboard/DashboardPage.css`
- `components/src/styles/tokens.css` (add `--gold-light` if missing)

## Testing

- [ ] Milestone section feels lighter and warmer
- [ ] Gold highlights clearly visible
- [ ] Section still visually distinct from stat cards
- [ ] Works in both empty and populated states
- [ ] Test with milestone achieved vs not achieved

## Design Reference

The milestone section should feel like a "celebration card" — warm, inviting, premium. Think award certificate, not warning banner.

## Related Plans

- [034-FEATURE-milestone-card.md](../done/034-FEATURE-milestone-card.md) - original milestone implementation
- [009-FEATURE-portfolio-dashboard.md](../done/009-FEATURE-portfolio-dashboard.md) - dashboard design
