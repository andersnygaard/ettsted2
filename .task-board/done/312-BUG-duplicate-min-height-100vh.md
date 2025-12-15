# BUG: Duplicate min-height: 100vh causes 2x page height

**Status**: Backlog
**Created**: 2024-12-14
**Priority**: High
**Labels**: frontend, css, layout
**Estimated Effort**: Simple - 5 minutes

## Context & Motivation

Pages Sparing, Gjeld, and Pensjon have excessive scrollable area - approximately 2x the actual content height. Users can scroll past all visible content into empty space.

## Current State

Two nested elements both set `min-height: 100vh`:

```css
/* frontend/src/styles/global.css:35-40 */
#root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bone);
}

/* frontend/src/shared/components/Layout.css:6-11 */
.app-layout {
  min-height: 100vh;  /* DUPLICATE! */
  display: flex;
  flex-direction: column;
  background: var(--bone);
}
```

When both have `min-height: 100vh`, the child forces 100vh height regardless of content, and the parent stretches to accommodate - resulting in ~2x viewport height.

## Desired Outcome

Page height matches content. No excessive scrollable whitespace below content.

## Acceptance Criteria

- [x] Sparing, Gjeld, Pensjon pages have no excess scroll area
- [x] Layout still fills viewport when content is short
- [x] No visual regression on other pages

## Affected Components

### Frontend
- **File**: `frontend/src/shared/components/Layout.css`
- **Change**: Line 7 - replace `min-height: 100vh` with `flex: 1`

## Technical Approach

### The Fix

```css
/* Before */
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bone);
}

/* After */
.app-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bone);
}
```

### Why This Works

- `#root` already has `min-height: 100vh` - it guarantees full viewport height
- `.app-layout` is a flex child of `#root`
- Using `flex: 1` makes `.app-layout` grow to fill available space in `#root`
- This eliminates the duplicate min-height constraint

### Implementation Steps

1. Edit `frontend/src/shared/components/Layout.css`
2. Replace `min-height: 100vh` with `flex: 1` on `.app-layout`
3. Verify pages visually in browser

## Verification

- [x] Navigate to /sparing - no excess scroll
- [x] Navigate to /gjeld - no excess scroll
- [x] Navigate to /pensjon - no excess scroll
- [x] Navigate to /oversikt - layout still fills viewport
- [x] Navigate to /portefolje - no regression

---

**Next Steps**: Ready for implementation. Single line CSS fix.
