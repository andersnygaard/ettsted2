# 129-FEATURE: App Header Logo Two Lines

**Priority**: Low
**Effort**: Small (15 min)
**Labels**: frontend, css, branding

---

## Context

The app header logo should display on two lines:
```
finans.
ettsted.no
```

Using `white-space: pre` to preserve the line break.

---

## Acceptance Criteria

- [ ] Logo displays "finans." on first line
- [ ] Logo displays "ettsted.no" on second line
- [ ] Uses `white-space: pre` or `pre-wrap` CSS
- [ ] Maintains hover effect
- [ ] Works responsively (may need smaller font on mobile)

---

## Technical Approach

Update `AppHeader.tsx` to include newline in logo text, and add CSS for `white-space: pre`.

```tsx
<Link to="/" className="app-header__logo">
  {'finans.\nettsted.no'}
</Link>
```

```css
.app-header__logo {
  white-space: pre;
  line-height: 1.2;
}
```

---

## Files to Modify

- [AppHeader.tsx](frontend/src/shared/components/AppHeader.tsx#L114-L116)
- [AppHeader.css](frontend/src/shared/components/AppHeader.css#L24-L38)

---

## Notes

- Currently shows "finans." when authenticated, "finans.ettsted.no" when not
- Need to decide if two-line format applies to both states or just authenticated
