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
| Oversikt | /oversikt |
| Portefølje | /portefolje |
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
- Oversikt (/oversikt): Exact match
- Other routes: Prefix match (e.g., `/portefolje` matches `/portefolje/*`)

Active state includes:
- Darker text color
- Optional underline (can be removed by commenting out `::after` pseudo-element)

## Responsive Behavior

- Desktop: Full navigation visible
- Tablet (< 1024px): Reduced nav gap
- Mobile (< 640px): Navigation hidden (would need hamburger menu implementation)

## Accessibility

### Keyboard Navigation & Focus Indicators

All interactive elements in AppHeader have focus-visible styles for keyboard accessibility (WCAG 2.4.7):

**Focus-visible elements:**
- `.app-header__logo` - Logo link
- `.app-header__nav-item` - Navigation links (Oversikt, Portefølje, Sparing, etc.)
- `.app-header__login-btn` - Login button (when unauthenticated)
- `.app-header__hamburger` - Mobile hamburger menu button
- `.app-header__mobile-close` - Mobile menu close button

**Focus indicator style:**
```css
outline: 2px solid var(--charcoal);
outline-offset: 2px;
```

**Testing focus states:**
1. Use Tab key to navigate through header elements
2. All interactive elements should show a 2px charcoal outline when focused via keyboard
3. Focus indicators should not appear on mouse click (browser default)
4. Mobile menu items also have keyboard support via Tab navigation
