# 263 - BUG: Mobile menu has excessive empty space

## Priority
Medium

## Type
Bug

## Description
Mobile navigation menu has large empty space between nav items and logout button due to `flex: 1` on `.app-header__mobile-nav`.

## Root Cause
`AppHeader.css` line 323: `.app-header__mobile-nav { flex: 1; }` causes the nav to stretch and push the footer (logout) to bottom, creating unwanted space.

## Acceptance Criteria
- [ ] Nav items grouped at top with natural spacing
- [ ] Minimal gap between last nav item and logout
- [ ] Logout button still at bottom of panel
- [ ] No excessive whitespace
- [ ] Touch targets remain 44px minimum

## Files to Change
- `frontend/src/shared/components/AppHeader.css`

## Technical Notes
Current CSS (line 323):
```css
.app-header__mobile-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 0;
}
```

Solution:
Remove `flex: 1` or change to `flex: 0 1 auto` to prevent stretching.

Alternatively, adjust spacing:
```css
.app-header__mobile-nav {
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  padding: 12px 0;
}
```

And ensure footer has `margin-top: auto` (already set on line 390).

## Testing
- Open mobile menu on phone viewport
- Verify nav items are grouped at top
- Verify logout is at bottom
- Verify no large gap between them
