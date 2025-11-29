# FEATURE: Calculator Card Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: component, ui, calculators
**Estimated Effort**: Simple - 30 minutes

## Context & Motivation

Calculator cards on the Kalkulatorer page, each linking to a specific calculator with icon, title, and description.

## Reference

Design file: `.docs/design-drafts/draft-1-kalkulatorer.html` (lines 111-173, 199-223)

## Desired Outcome

Clickable card for each calculator with icon and description.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/CalculatorCard.tsx`
- [ ] Props: `icon`, `title`, `description`, `href`
- [ ] Icon with colored background
- [ ] Title in Cormorant Garamond
- [ ] Description in secondary text
- [ ] Hover lift effect
- [ ] Staggered animation

## Technical Approach

```tsx
// CalculatorCard.tsx
interface CalculatorCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
  iconBg?: string;
}

export function CalculatorCard({
  icon,
  title,
  description,
  href,
  iconBg = 'var(--bone)'
}: CalculatorCardProps) {
  return (
    <Link to={href} className="calc-card">
      <div className="calc-icon" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="calc-title">{title}</div>
      <div className="calc-desc">{description}</div>
    </Link>
  );
}
```

```css
.calc-card {
  background: var(--warm-white);
  padding: 40px;
  border-radius: 2px;
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-medium), box-shadow var(--transition-medium);
  display: block;
}

.calc-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.06);
}

.calc-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.calc-title {
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 8px;
}

.calc-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`

---

**Next Steps**: Implement for Kalkulatorer page
