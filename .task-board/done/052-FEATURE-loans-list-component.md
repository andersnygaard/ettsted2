# FEATURE: Loans List Component

**Status**: Backlog
**Created**: 2025-11-29
**Priority**: Medium
**Labels**: component, ui, gjeld
**Estimated Effort**: Simple - 1 hour

## Context & Motivation

List of active loans on the Gjeld page, showing each loan with name, interest rate, term, and balance.

## Reference

Design file: `.docs/design-drafts/draft-1-gjeld.html` (lines 217-245, 371-380)

## Desired Outcome

List component displaying active loans.

## Acceptance Criteria

- [ ] Create `/frontend/src/features/gjeld/LoansList.tsx`
- [ ] Props: `loans` (array of loan objects)
- [ ] Header with title
- [ ] Each loan shows: name, details (rate, term), amount
- [ ] Border separators between items
- [ ] JetBrains Mono for amounts

## Technical Approach

```tsx
// LoansList.tsx
interface Loan {
  id: string;
  name: string;
  interestRate: number;
  remainingYears: number;
  balance: number;
}

interface LoansListProps {
  loans: Loan[];
}

export function LoansList({ loans }: LoansListProps) {
  return (
    <div className="loans-section">
      <div className="loans-header">Aktive lån</div>
      {loans.map(loan => (
        <div key={loan.id} className="loan-item">
          <div className="loan-item__info">
            <div className="loan-item__name">{loan.name}</div>
            <div className="loan-item__details">
              {loan.interestRate}% rente · {loan.remainingYears} år gjenstående
            </div>
          </div>
          <div className="loan-item__amount">
            {formatCurrency(loan.balance)}
          </div>
        </div>
      ))}
    </div>
  );
}
```

```css
.loans-section {
  background: var(--warm-white);
  padding: 32px;
  border-radius: 2px;
  margin-bottom: 48px;
}

.loans-header {
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 400;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.loan-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--border);
}

.loan-item:last-child { border-bottom: none; }

.loan-item__name {
  font-weight: 500;
  margin-bottom: 4px;
}

.loan-item__details {
  font-size: 12px;
  color: var(--text-secondary);
}

.loan-item__amount {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 500;
}
```

## Dependencies

- `021-FEATURE-design-tokens.md`

---

**Next Steps**: Implement for Gjeld page
