# 136-REFACTOR: Checkbox Lighter Background Color

**Priority**: Low
**Effort**: Quick (10 min)
**Labels**: frontend, css

---

## Context

Checkboxes across the app should have a slightly lighter background color for better visual consistency with the Nordic Minimal design.

---

## Acceptance Criteria

- [ ] Checkbox backgrounds are lighter/softer
- [ ] Consistent across all checkbox instances
- [ ] Checked state still clearly visible
- [ ] Works with `accent-color` or custom styling

---

## Technical Approach

Using native checkboxes with `accent-color`:
```css
input[type="checkbox"] {
  accent-color: var(--muted-sage);
  background-color: var(--warm-white);
}
```

If custom checkbox styling is needed:
```css
.checkbox {
  appearance: none;
  width: 18px;
  height: 18px;
  border: 1px solid var(--border-strong);
  border-radius: 3px;
  background-color: var(--warm-white);
}

.checkbox:checked {
  background-color: var(--muted-sage);
  border-color: var(--muted-sage);
}
```

---

## Files to Review

- [AccountsList.css](frontend/src/features/auth/onboarding/steps/AccountsList.css#L93-L98)
- [global.css](frontend/src/styles/global.css) - Add global checkbox styling
- Any other files with checkbox inputs
