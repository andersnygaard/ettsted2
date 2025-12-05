# Planning Board - Finans

**Current Focus**: All design system tasks complete! Ready for next phase.

---

## Dependency Graph

```
001-consolidate-components
  └── 002-hardcoded-colors → 006-design-docs
  └── 003-hardcoded-fonts → 006-design-docs
  └── 004-centralize-animations
  └── 005-spacing-tokens
  └── 007-storybook-coverage
```

---

## Top Priorities

| # | Task | Type | Effort | Status |
|---|------|------|--------|--------|
| - | Backlog empty | - | - | - |

---

## Full Backlog

(Empty - all tasks completed)

---

## Recently Completed

### 007 - Improve Storybook Coverage (2025-12-05)
Enhanced 11 component stories with 41+ new stories. Added argTypes, play functions, Norwegian formatting demos.

### 006 - Design System Documentation (2025-12-05)
Created .docs/design-system/ with 6 comprehensive files: PRINCIPLES, TOKENS, COMPONENTS, PATTERNS, ACCESSIBILITY.

### 005 - Spacing Tokens Usage (2025-12-05)
Replaced 110+ hardcoded pixel values with spacing tokens in 16 CSS files. Consistent visual rhythm.

### 004 - Centralize Animations (2025-12-05)
Removed duplicate @keyframes fadeUp from 4 files. Single source of truth in animations.css.

### 003 - Hardcoded Fonts to Tokens (2025-12-05)
Replaced 44 font-family values with tokens in 11 CSS files. All fonts now use --font-heading, --font-body, --font-mono.

### 002 - Hardcoded Colors to Tokens (2025-12-05)
Added 20 new color tokens. Replaced hardcoded hex values in 23 CSS files. Removed all fallback values.

### 001 - Consolidate Duplicate Components (2025-12-05)
Eliminated 41 duplicate files from frontend. All shared components now import from @finans/components. Single source of truth established.

### 139 - New Month Copy Previous (2025-12-05)
Pre-fills new month modal with values from most recent snapshot. Shows "Verdier kopiert fra [dato]" message.

### 138 - New Month Datepicker (2025-12-05)
Month/year dropdown picker replacing text input. Norwegian month names, prevents future selection.

### 137 - Import Agent Initial Messages (2025-12-05)
Pre-populated chat messages on import page: "Hei" + instructions for pasting data.

### 136 - Checkbox Lighter Background (2025-12-05)
Global checkbox styling with lighter muted-sage background, hover states, checked indicator.

### 135 - Date Header Z-Index (2025-12-05)
Increased SpreadsheetTable date header z-index from 20 to 25 for proper sticky stacking.

---

## Statistics

| Status | Count |
|--------|-------|
| Done | 146 |
| Backlog | 0 |
| In Progress | 0 |

**Last Updated**: 2025-12-05
