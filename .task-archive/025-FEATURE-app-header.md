# FEATURE: App Header Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, layout, navigation
**Estimated Effort**: Simple - 1-2 hours

## Context & Motivation

The header appears on all pages with the logo, navigation tabs, and user avatar. It's the primary navigation element.

## Reference

Design file: `.docs/design-drafts/draft-1-nordic-minimal.html` (lines 44-90, 296-309)

## Desired Outcome

Reusable header component with:
- Logo (Cormorant Garamond, lowercase "finans")
- Navigation tabs (6 items)
- User avatar with initials

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/AppHeader.tsx`
- [ ] Logo links to home (`/`)
- [ ] Navigation with 6 tabs: Oversikt, Portefølje, Sparing, Gjeld, Pensjon, Kalkulatorer
- [ ] Active tab styling (darker text color)
- [ ] Avatar shows user initials from auth context
- [ ] Border-bottom separator
- [ ] Responsive (navigation collapses on mobile)

## Technical Approach

```tsx
// AppHeader.tsx
export function AppHeader() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Oversikt' },
    { path: '/portfolio', label: 'Portefølje' },
    { path: '/sparing', label: 'Sparing' },
    { path: '/gjeld', label: 'Gjeld' },
    { path: '/pensjon', label: 'Pensjon' },
    { path: '/kalkulatorer', label: 'Kalkulatorer' },
  ];

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'AN';

  return (
    <header className="app-header">
      <div className="container">
        <Link to="/" className="logo">finans</Link>
        <nav>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="avatar">{initials}</div>
      </div>
    </header>
  );
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`
- `022-FEATURE-typography-setup.md`

---

**Next Steps**: Implement after design system foundation
