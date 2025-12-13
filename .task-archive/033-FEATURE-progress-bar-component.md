# FEATURE: Progress Bar Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: High
**Labels**: component, ui
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

Progress bars are used in multiple places: milestone card (dashboard), F.I.R.E. progress (sparing), OTP progress (pensjon), and debt coverage (gjeld).

## Reference

Design files:
- Milestone: `.docs/design-drafts/draft-1-nordic-minimal.html` (lines 207-228)
- F.I.R.E.: `.docs/design-drafts/draft-1-sparing.html` (lines 192-220)

## Desired Outcome

Flexible progress bar component with different color variants.

## Acceptance Criteria

- [ ] Create `/frontend/src/shared/components/ProgressBar.tsx`
- [ ] Props: `value` (0-100), `variant`, `height`, `showLabel`
- [ ] Variants: `default` (sage), `gold`, `blue`
- [ ] Rounded corners (radius = height/2)
- [ ] Optional labels below (left/right aligned)
- [ ] Smooth fill animation

## Technical Approach

```tsx
// ProgressBar.tsx
interface ProgressBarProps {
  value: number;
  variant?: 'default' | 'gold' | 'blue';
  height?: number;
  leftLabel?: string;
  rightLabel?: string;
}

export function ProgressBar({
  value,
  variant = 'default',
  height = 8,
  leftLabel,
  rightLabel
}: ProgressBarProps) {
  return (
    <div className="progress-bar-container">
      <div
        className={`progress-bar progress-bar--${variant}`}
        style={{ height: `${height}px` }}
      >
        <div
          className="progress-bar__fill"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {(leftLabel || rightLabel) && (
        <div className="progress-bar__labels">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
```

```css
.progress-bar {
  background: rgba(255,255,255,0.15);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-bar--default .progress-bar__fill {
  background: linear-gradient(90deg, var(--muted-sage) 0%, #A3B396 100%);
}

.progress-bar--gold .progress-bar__fill {
  background: linear-gradient(90deg, var(--gold) 0%, #D4B876 100%);
}

.progress-bar--blue .progress-bar__fill {
  background: var(--pale-blue);
}

.progress-bar__labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`

---

**Next Steps**: Used by multiple pages, implement early
