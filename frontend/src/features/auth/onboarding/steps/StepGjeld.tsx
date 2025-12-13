/**
 * StepGjeld Component - Step 3 of Onboarding Wizard
 *
 * Collects debt accounts with current values and loan details.
 */

import { OnboardingAccount } from '../types';
import { AccountsList } from './AccountsList';
import { PageHeader } from '@finans/components';
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
      <PageHeader
        title="Gjeld"
        subtitle="Legg inn dine lån og gjeld"
        reduced={true}
      />
      <p className="step-accounts__note">
        Skriv lånebeløp som positivt tall (f.eks. 500 000) - det konverteres automatisk til gjeld
      </p>

      <AccountsList
        category="gjeld"
        accounts={accounts}
        errors={errors}
        onUpdateAccount={onUpdateAccount}
        onRemoveAccount={onRemoveAccount}
        onAddAccount={onAddAccount}
        showLoanDetails={true}
        showPrimaryResidenceRadio={true}
      />
    </div>
  );
}
