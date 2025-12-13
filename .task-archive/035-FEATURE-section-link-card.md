# FEATURE: Section Link Card Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: component, ui, navigation
**Estimated Effort**: Simple - 30 minutes

## Context & Motivation

Section link cards are navigation cards at the bottom of the dashboard, linking to main sections with an arrow indicator.

## Reference

Design file: `.docs/design-drafts/draft-1-nordic-minimal.html` (lines 231-274, 357-379)

## Desired Outcome

Clickable card with title, subtitle, and arrow icon.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/SectionLink.tsx`
- [ ] Props: `title`, `subtitle`, `href`
- [ ] Title in Cormorant Garamond
- [ ] Subtitle in secondary text
- [ ] Arrow icon that moves on hover
- [ ] Hover lift effect

## Technical Approach

```tsx
// SectionLink.tsx
interface SectionLinkProps {
  title: string;
  subtitle: string;
  href: string;
}

export function SectionLink({ title, subtitle, href }: SectionLinkProps) {
  return (
    <Link to={href} className="section-link">
      <div className="section-link__content">
        <div className="section-link__title">{title}</div>
        <div className="section-link__subtitle">{subtitle}</div>
      </div>
      <span className="section-link__arrow">→</span>
    </Link>
  );
}
```

```css
.section-link {
  background: var(--warm-white);
  padding: 32px;
  border-radius: 2px;
  text-decoration: none;
  color: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform var(--transition-medium), box-shadow var(--transition-medium);
}

.section-link:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.06);
}

.section-link__title {
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 400;
  margin-bottom: 6px;
}

.section-link__subtitle {
  font-size: 12px;
  color: var(--text-secondary);
}

.section-link__arrow {
  font-size: 24px;
  color: var(--text-secondary);
  transition: transform var(--transition-fast);
}

.section-link:hover .section-link__arrow {
  transform: translateX(4px);
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`

---

**Next Steps**: Implement for dashboard
