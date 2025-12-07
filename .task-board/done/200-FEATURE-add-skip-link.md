# FEATURE: Add Skip Link for Accessibility

**Status**: Completed
**Created**: 2025-12-07
**Priority**: Medium
**Labels**: frontend, accessibility, a11y
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

The due diligence audit identified a missing accessibility feature: no skip-to-content link for keyboard users to bypass header navigation.

Keyboard users currently must tab through all header navigation items to reach main content, which is poor accessibility practice.

## Current State

- AppHeader has navigation links
- No skip link exists
- Main content area has no target ID

## Desired Outcome

Keyboard users can skip directly to main content using a skip link that appears on focus.

## Acceptance Criteria

- [x] Skip link appears at top of page on focus
- [x] Skip link navigates to main content area
- [x] Link is hidden visually until focused
- [x] Link works with keyboard navigation (Tab → Enter)
- [x] WCAG 2.1 AA compliant
- [x] Works on all pages

## Affected Components

### Frontend
- **File**: `frontend/src/shared/components/AppHeader.tsx`
- **File**: `frontend/src/App.tsx` or layout component
- **CSS**: Skip link styles

### Components (Optional)
- Could add SkipLink component to library

### Testing
- **Manual**: Test keyboard navigation
- **E2E**: Could add accessibility test

## Technical Approach

### Implementation Steps

1. **Add skip link component**
   ```tsx
   // In AppHeader.tsx (at very top)
   <a href="#main-content" className="skip-link">
     Hopp til hovedinnhold
   </a>
   ```

2. **Add main content ID**
   ```tsx
   // In layout/page wrapper
   <main id="main-content">
     {children}
   </main>
   ```

3. **Add CSS for skip link**
   ```css
   .skip-link {
     position: absolute;
     left: -9999px;
     top: 0;
     z-index: 999;
     padding: var(--space-sm) var(--space-md);
     background: var(--charcoal);
     color: var(--warm-white);
   }

   .skip-link:focus {
     left: 0;
   }
   ```

4. **Verify**
   - Tab to skip link
   - Press Enter
   - Focus moves to main content

### Risks & Considerations

- **Risk**: None - additive change
- **Mitigation**: N/A

## Code References

### AppHeader (Add Skip Link)

```tsx
// frontend/src/shared/components/AppHeader.tsx
const AppHeader: React.FC = () => {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Hopp til hovedinnhold
      </a>
      <header className="app-header">
        {/* ... existing header content */}
      </header>
    </>
  );
};
```

### WCAG Reference

- WCAG 2.4.1: Bypass Blocks (Level A)
- Users must be able to bypass repetitive content

## Related Plans

- Due Diligence Report: `.docs/DUE-DILIGENCE-REPORT.md`

---
**Next Steps**: Accessibility improvement for keyboard users.
