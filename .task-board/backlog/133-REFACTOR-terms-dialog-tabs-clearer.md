# 133-REFACTOR: Terms Dialog Tabs More Visible

**Priority**: Medium
**Effort**: Small (30 min)
**Labels**: frontend, css, ux

---

## Context

In the Terms/Privacy dialog (`TermsDialog.tsx`), the two tab buttons (Vilkår / Personvern) don't clearly appear as tabs. Users may not realize they can switch between them.

---

## Acceptance Criteria

- [ ] Tabs have clearer visual distinction
- [ ] Active tab is visually distinct from inactive
- [ ] Tab bar looks like a standard tab interface
- [ ] Consider underline, background, or border styling

---

## Technical Approach

Options:
1. **Underline style**: Active tab has bottom border, inactive has none
2. **Background style**: Active tab has white background, inactive has bone/gray
3. **Pill style**: Active tab is filled, inactive is outline

Example underline approach:
```css
.terms-dialog__tab {
  padding: 12px 24px;
  border: none;
  background: transparent;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
}

.terms-dialog__tab--active {
  border-bottom-color: var(--charcoal);
  color: var(--charcoal);
  font-weight: 500;
}

.terms-dialog__tabs {
  display: flex;
  gap: 8px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 24px;
}
```

---

## Files to Modify

- [TermsDialog.tsx](frontend/src/features/auth/TermsDialog.tsx)
- [TermsDialog.css](frontend/src/features/auth/TermsDialog.css)
