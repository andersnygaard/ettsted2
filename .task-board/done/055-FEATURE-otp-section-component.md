# FEATURE: OTP Section Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: component, ui, pensjon
**Estimated Effort**: Simple - 30 minutes

## Context & Motivation

OTP (Obligatorisk tjenestepensjon) progress section showing employer pension as percentage of total.

## Reference

Design file: `.docs/design-drafts/draft-1-pensjon.html` (lines 191-239, 367-379)

## Desired Outcome

Progress bar section showing OTP percentage.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/pensjon/OtpSection.tsx`
- [ ] Props: `percentage`, `trend`
- [ ] Title and value display
- [ ] Progress bar with blue fill
- [ ] Labels below (OTP name and trend indicator)

## Technical Approach

```tsx
// OtpSection.tsx
interface OtpSectionProps {
  percentage: number;
  trend?: 'up' | 'down' | 'stable';
}

export function OtpSection({ percentage, trend = 'up' }: OtpSectionProps) {
  const trendText = {
    up: 'Trenden er stigende',
    down: 'Trenden er synkende',
    stable: 'Trenden er stabil'
  };

  return (
    <div className="otp-section">
      <div className="otp-header">
        <span className="otp-title">OTP som prosent av total</span>
        <span className="otp-value">{percentage}%</span>
      </div>
      <ProgressBar value={percentage} variant="blue" height={12} />
      <div className="otp-labels">
        <span>Obligatorisk tjenestepensjon</span>
        <span>{trendText[trend]}</span>
      </div>
    </div>
  );
}
```

```css
.otp-section {
  background: var(--warm-white);
  padding: 32px;
  border-radius: 2px;
  margin-bottom: 48px;
}

.otp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 24px;
}

.otp-title {
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 400;
}

.otp-value {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 500;
  color: var(--muted-sage);
}

.otp-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 11px;
  color: var(--text-secondary);
}
```

## Dependencies

- `033-FEATURE-progress-bar-component.md`

---

**Next Steps**: Implement for Pensjon page
