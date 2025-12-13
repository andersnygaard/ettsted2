# FEATURE: Breadcrumb Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Low
**Labels**: component, navigation
**Estimated Effort**: Simple - 30 minutes

## Context & Motivation

Breadcrumb navigation appears on detail pages like Portfolio, showing the path back to parent pages.

## Reference

Design file: `.docs/design-drafts/draft-1-portfolio.html` (lines 100-114, 429-433)

## Desired Outcome

Simple breadcrumb trail with links and separators.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/Breadcrumb.tsx`
- [ ] Props: `items` (array of { label, path })
- [ ] Last item is current page (no link)
- [ ] Arrow separator between items
- [ ] 12px font size, secondary text color
- [ ] Links darken on hover

## Technical Approach

```tsx
// Breadcrumb.tsx
interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && <span className="breadcrumb__separator">→</span>}
          {item.path ? (
            <Link to={item.path}>{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`

---

**Next Steps**: Implement when building Portfolio page
