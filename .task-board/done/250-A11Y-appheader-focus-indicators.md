# 250 - Add AppHeader Focus Indicators

## Type
Accessibility

## Priority
High

## Description
Add `:focus-visible` styles to all interactive elements in AppHeader. Currently nav links, logo, login button, and mobile close button lack keyboard focus indicators, violating WCAG 2.4.7.

## Source
Due Diligence Report - Critical Error #3

## Implementation

### File: `components/src/components/AppHeader/AppHeader.css`

Add focus-visible styles to:
1. `.app-header__nav-item` - navigation links
2. `.app-header__logo` - logo link
3. `.app-header__login-button` - login button
4. `.app-header__mobile-close` - mobile close button

```css
.app-header__nav-item:focus-visible,
.app-header__logo:focus-visible,
.app-header__login-button:focus-visible,
.app-header__mobile-close:focus-visible {
  outline: 2px solid var(--charcoal);
  outline-offset: 2px;
}
```

## Acceptance Criteria
- [x] All nav links show focus ring on keyboard navigation
- [x] Logo shows focus ring when focused
- [x] Login button shows focus ring when focused
- [x] Mobile close button shows focus ring when focused
- [x] Focus color is consistent `--charcoal`
- [x] Storybook stories demonstrate focus states

## Implementation Notes

**File Modified:** `frontend/src/shared/components/AppHeader.css`

**Changes:**
1. Added `:focus-visible` to `.app-header__logo` (2px charcoal outline)
2. Added `:focus-visible` to `.app-header__nav-item` (2px charcoal outline)
3. Added `:focus-visible` to `.app-header__login-btn` (2px charcoal outline)
4. Added `:focus-visible` to `.app-header__mobile-close` (2px charcoal outline)
5. Updated `.app-header__hamburger:focus-visible` from pale-blue to charcoal for consistency

**Documentation:**
- Updated `frontend/src/shared/components/AppHeader.md` with Accessibility section documenting all focus-visible elements, their styles, and testing instructions

**Build Status:**
- Frontend build: ✓ Successful
- Frontend lint: ✓ Passed (no new errors)

## Effort
Low (20 min)
