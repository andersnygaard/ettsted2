/**
 * StepPensjon Component - Step 4 of Onboarding Wizard
 *
 * Collects pension accounts with current values.
 */

import { OnboardingAccount } from '../types';
import { AccountsList } from './AccountsList';
import { PageHeader } from '@finans/components';
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
      <PageHeader
        title="Pensjon"
        subtitle="Legg inn dine pensjonskontoer"
        reduced={true}
      />

      <AccountsList
        category="pensjon"
        accounts={accounts}
        errors={errors}
        onUpdateAccount={onUpdateAccount}
        onRemoveAccount={onRemoveAccount}
        onAddAccount={onAddAccount}
        showLoanDetails={false}
        showPublicPensionRadio={true}
      />
    </div>
  );
}
