# AppHeader Component

Main navigation header for the finans application, based on the Nordic Minimal design system.

## Features

- Logo linking to home page (/)
- 6 navigation tabs with active state highlighting
- User avatar with initials
- Responsive design
- Uses design tokens from `tokens.css`

## Usage

The AppHeader is already integrated into the Layout component and will automatically appear on all pages.

```tsx
import AppHeader from './AppHeader';

function Layout() {
  return (
    <div>
      <AppHeader />
      <main>{/* Your content */}</main>
    </div>
  );
}
```

## Navigation Paths

The header includes the following navigation items:

| Label | Path |
|-------|------|
| Oversikt | / |
| Portefølje | /portfolio |
| Sparing | /sparing |
| Gjeld | /gjeld |
| Pensjon | /pensjon |
| Kalkulatorer | /kalkulatorer |

## User Avatar

The avatar displays user initials extracted from the auth context:
- If username has multiple words: First letter of first two words (e.g., "Anders Nordby" → "AN")
- If username is single word: First two letters (e.g., "anders" → "AN")
- Fallback if no user: "AN"

## Styling

Styles are defined in `AppHeader.css` using CSS custom properties from the design system:

- Background: `var(--warm-white)`
- Border: `var(--border)`
- Logo font: `var(--font-heading)` (Cormorant Garamond)
- Nav items: Uppercase with letter-spacing
- Avatar: Circular with `var(--pale-blue)` background

## Active State

Navigation items automatically highlight based on the current route:
- Home (/): Exact match
- Other routes: Prefix match (e.g., `/portfolio` matches `/portfolio/*`)

Active state includes:
- Darker text color
- Optional underline (can be removed by commenting out `::after` pseudo-element)

## Responsive Behavior

- Desktop: Full navigation visible
- Tablet (< 1024px): Reduced nav gap
- Mobile (< 640px): Navigation hidden (would need hamburger menu implementation)
