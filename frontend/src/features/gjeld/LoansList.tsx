/**
 * LoansList Component
 *
 * Displays a list of active loans with name, interest rate, term, and balance.
 *
 * Based on Nordic Minimal design from draft-1-gjeld.html
 */

import { formatCurrency } from '@finans/components';

export interface Loan {
  id: string;
  name: string;
  interestRate: number;
  yearsRemaining: number;
  balance: number;
}

export interface LoansListProps {
  loans: Loan[];
}

export function LoansList({ loans }: LoansListProps) {
  return (
    <section className="loans-section">
      <div className="loans-header">Aktive lån</div>
      {loans.map((loan) => (
        <div key={loan.id} className="loan-item">
          <div>
            <div className="loan-name">{loan.name}</div>
            <div className="loan-details">
              {loan.interestRate.toFixed(1).replace('.', ',')}% rente · {loan.yearsRemaining} år gjenstående
            </div>
          </div>
          <div className="loan-amount">{formatCurrency(loan.balance)}</div>
        </div>
      ))}
    </section>
  );
}
