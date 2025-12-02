/**
 * StepPensjon Component - Step 4 of Onboarding Wizard
 *
 * Collects pension accounts with current values.
 */

import { OnboardingAccount } from '../types';
import { AccountsList } from './AccountsList';
import './StepAccounts.css';

interface StepPensjonProps {
  /** Pension accounts */
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

export function StepPensjon({
  accounts,
  errors,
  onUpdateAccount,
  onRemoveAccount,
  onAddAccount,
}: StepPensjonProps) {
  return (
    <div className="step-accounts">
      <div className="step-accounts__header">
        <h2 className="step-accounts__title">Pensjon</h2>
        <p className="step-accounts__subtitle">
          Legg inn dine pensjonskontoer
        </p>
      </div>

      <AccountsList
        category="pensjon"
        accounts={accounts}
        errors={errors}
        onUpdateAccount={onUpdateAccount}
        onRemoveAccount={onRemoveAccount}
        onAddAccount={onAddAccount}
        showLoanDetails={false}
      />
    </div>
  );
}
