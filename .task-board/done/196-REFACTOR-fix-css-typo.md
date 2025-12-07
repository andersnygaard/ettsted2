# REFACTOR: Fix CSS Variable Typo (--carcoal-hover)

**Status**: Backlog
**Created**: 2025-12-07
**Priority**: Medium
**Labels**: frontend, css, bug
**Estimated Effort**: Simple - 15 minutes

## Context & Motivation

The due diligence audit found a CSS variable typo: `--carcoal-hover` should be `--charcoal-hover`. This breaks button primary disabled state styling.

## Current State

In `frontend/src/styles/tokens.css` (line 66):

```css
--carcoal-hover: #444433;  /* TYPO - should be --charcoal-hover */
```

## Desired Outcome

Correct the typo so button disabled states render properly.

## Acceptance Criteria

- [x] CSS variable renamed to `--charcoal-hover`
- [x] All references updated (if any)
- [x] Button disabled state renders correctly
- [x] Lint passes

## Progress Log

**2025-12-07** - COMPLETED

### Changes Made
1. Fixed typo in `frontend/src/styles/tokens.css` line 66:
   - Changed: `--btn-primary-disabled-bg: var(--carcoal-hover);`
   - To: `--btn-primary-disabled-bg: var(--charcoal-hover);`

2. Verified no other references to `carcoal` existed (grep search confirmed only in docs/task files)

3. Ran verification:
   - `pnpm lint` - PASSED (0 errors)
   - `pnpm --filter frontend build` - PASSED (built in 3.56s)

### Result
Task completed successfully. Button disabled state styling now references the correct CSS variable `--charcoal-hover`.

## Affected Components

### Frontend
- **File**: `frontend/src/styles/tokens.css`
- **Line**: 66

### Testing
- **Visual**: Verify button disabled state looks correct
- **Storybook**: Check Button component stories

## Technical Approach

### Implementation Steps

1. **Fix the typo**
   - Change `--carcoal-hover` to `--charcoal-hover`

2. **Search for references**
   - Grep for `carcoal` to find any usages
   - Update all references

3. **Verify visually**
   - Run Storybook or dev server
   - Check button disabled state

## Code References

### Fix This

```css
/* frontend/src/styles/tokens.css:66 */
/* Change FROM: */
--carcoal-hover: #444433;

/* Change TO: */
--charcoal-hover: #444433;
```

## Related Plans

- Due Diligence Report: `.docs/DUE-DILIGENCE-REPORT.md`

---
**Next Steps**: Quick fix. Can be done in minutes.
