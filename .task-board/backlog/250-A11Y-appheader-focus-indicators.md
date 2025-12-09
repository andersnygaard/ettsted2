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
- [ ] All nav links show focus ring on keyboard navigation
- [ ] Logo shows focus ring when focused
- [ ] Login button shows focus ring when focused
- [ ] Mobile close button shows focus ring when focused
- [ ] Focus color is consistent `--charcoal`
- [ ] Storybook stories demonstrate focus states

## Effort
Low (20 min)
