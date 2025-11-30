# FEATURE: Update Layout Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: frontend, layout
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

Replace the current BeerCSS-based layout with the Nordic Minimal design layout using the new AppHeader component.

## Reference

Design drafts header and layout structure

## Desired Outcome

Layout matching Nordic Minimal design.

## Acceptance Criteria

- [ ] Update `/frontend/src/shared/components/Layout.tsx`
- [ ] Replace current nav with AppHeader component
- [ ] Use bone background color
- [ ] Apply global typography
- [ ] Add grain texture overlay
- [ ] Update main content area styling
- [ ] Remove footer or update to minimal design
- [ ] Test responsive behavior

## Technical Approach

```tsx
// Layout.tsx
export function Layout() {
  return (
    <div className="app-layout">
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

```css
/* layout.css */
.app-layout {
  min-height: 100vh;
  background: var(--bone);
}

.app-layout main {
  padding: 64px 0;
}

/* Remove BeerCSS overrides, use Nordic Minimal tokens */
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- `025-FEATURE-app-header.md`

---

**Next Steps**: Implement with header component
