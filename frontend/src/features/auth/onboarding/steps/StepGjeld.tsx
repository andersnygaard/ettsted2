/**
 * StepGjeld Component - Step 3 of Onboarding Wizard
 *
 * Collects debt accounts with current values and loan details.
 */

import { OnboardingAccount } from '../types';
import { AccountsList } from './AccountsList';
import './StepAccounts.css';

interface StepGjeldProps {
  /** Debt accounts */
  accounts: OnboardingAccount[];
  /** Validation errors */
  errors: Record<string, string>;
  /** Update an account */
  onUpdateAccount: (tempId: string, updates: Partial<OnboardingAccount>) => void;
  /** Remove an account */
  onRemoveAccount: (tempId: string) => void;
  /** Add a new account */
  onAddAccount: () => void;
}

export function StepGjeld({
  accounts,
  errors,
  onUpdateAccount,
  onRemoveAccount,
  onAddAccount,
}: StepGjeldProps) {
  return (
    <div className="step-accounts">
      <div className="step-accounts__header">
        <h2 className="step-accounts__title">Gjeld</h2>
        <p className="step-accounts__subtitle">
          Legg inn dine lån og gjeld
        </p>
      </div>

      <AccountsList
        category="gjeld"
        accounts={accounts}
        errors={errors}
        onUpdateAccount={onUpdateAccount}
        onRemoveAccount={onRemoveAccount}
        onAddAccount={onAddAccount}
        showLoanDetails={true}
      />
    </div>
  );
}
