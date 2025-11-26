# Replace Dark Mode Button with BeerCSS Switch

## Overview
Replace the emoji button dark mode toggle (☀️/🌙) in the header with a proper BeerCSS switch component.

## Current Implementation
- Location: `src/components/Layout.tsx:125-141`
- Current: `<button>` with emoji that changes based on `isDark` state
- Theme logic: Already working via `ThemeContext` with `toggleTheme()` function

## Proposed Change

Replace the button with BeerCSS switch component structure:

```tsx
<label className="switch icon">
  <input
    type="checkbox"
    checked={isDark}
    onChange={toggleTheme}
  />
  <span>
    <i>{isDark ? 'dark_mode' : 'light_mode'}</i>
  </span>
</label>
```

## Implementation Details

1. **Replace button element** (lines 125-141 in Layout.tsx)
   - Remove existing `<button>` wrapper
   - Add `<label className="switch icon">` wrapper
   - Add checkbox input with `checked={isDark}` and `onChange={toggleTheme}`
   - Add `<span>` with Material icon (`<i>` tag)

2. **Icon choice**
   - Use Material icons: `dark_mode` for dark, `light_mode` for light (Modern MD3 style)

3. **Styling**
   - BeerCSS handles switch styling automatically
   - Remove inline styles from button
   - May need minor spacing adjustments for header layout

## Files Modified
- `src/components/Layout.tsx` (lines 125-141)

## References
- [BeerCSS switch documentation](https://github.com/beercss/beercss/blob/main/docs/SETTINGS.md)
- Material icons for dark/light modes
