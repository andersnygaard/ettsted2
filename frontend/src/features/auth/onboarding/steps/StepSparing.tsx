/**
 * StepSparing Component - Step 2 of Onboarding Wizard
 *
 * Collects savings accounts with current values.
 */

import { OnboardingAccount } from '../types';
import { AccountsList } from './AccountsList';
import './StepAccounts.css';

interface StepSparingProps {
  /** Savings accounts */
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

export function StepSparing({
  accounts,
  errors,
  onUpdateAccount,
  onRemoveAccount,
  onAddAccount,
}: StepSparingProps) {
  return (
    <div className="step-accounts">
      <div className="step-accounts__header">
        <h2 className="step-accounts__title">Sparing</h2>
        <p className="step-accounts__subtitle">
          Legg inn dine sparekontoer og investeringer
        </p>
      </div>

      <AccountsList
        category="sparing"
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
