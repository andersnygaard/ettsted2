/**
 * LoansList Component
 *
 * Displays a list of active loans with name, interest rate, term, and balance.
 * Shows a sum row when multiple loans exist.
 *
 * Based on Nordic Minimal design from draft-1-gjeld.html
 */

import { formatCurrency, formatNumber } from '@finans/components';

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
  // Calculate total balance only for multiple loans
  const totalBalance = loans.reduce((sum, loan) => sum + loan.balance, 0);
  const showSumRow = loans.length > 1;

  return (
    <section className="loans-section">
      <div className="loans-header">Aktive lån</div>
      {loans.map((loan) => (
        <div key={loan.id} className="loan-item">
          <div>
            <div className="loan-name">{loan.name}</div>
            <div className="loan-details">
              {formatNumber(loan.interestRate, 1)}% rente · {loan.yearsRemaining} år gjenstående
            </div>
          </div>
          <div className="loan-amount">{formatCurrency(loan.balance)}</div>
        </div>
      ))}
      {showSumRow && (
        <div className="loan-sum-row">
          <div>
            <div className="loan-name loan-sum-label">Sum</div>
          </div>
          <div className="loan-amount loan-sum-amount">{formatCurrency(totalBalance)}</div>
        </div>
      )}
    </section>
  );
}
