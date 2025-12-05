/**
 * StepSparing Component - Step 2 of Onboarding Wizard
 *
 * Collects savings accounts with current values.
 */

import { OnboardingAccount } from '../types';
import { AccountsList } from './AccountsList';
import { PageHeader } from '@finans/components';
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
      <PageHeader
        title="Sparing"
        subtitle="Legg inn dine sparekontoer og investeringer"
        reduced={true}
      />

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
