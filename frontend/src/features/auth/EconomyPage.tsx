/**
 * EconomyPage
 *
 * Page for existing users to edit their economy setup (profile and accounts).
 * Uses OnboardingWizard in 'edit' mode with pre-populated user data.
 */

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { OnboardingWizard } from './onboarding/OnboardingWizard';
import { OnboardingState } from './onboarding/types';
import { generateTempId } from './onboarding/defaultAccounts';
import { LoadingSpinner } from '../../shared/components';
import { snapshotApi } from '@/shared/api/services';
import './OnboardingPage.css';

/**
 * Convert existing user data to OnboardingWizard initial state
 *
 * @param user User data with accounts
 * @param latestSnapshot Optional latest snapshot containing current account values
 * @returns Initial state for OnboardingWizard in edit mode
 */
function convertUserToInitialState(
  user: NonNullable<ReturnType<typeof useAuth>['user']>,
  latestSnapshot?: Awaited<ReturnType<typeof snapshotApi.getAll>>[0]
): Partial<OnboardingState> {
  /**
   * Find account value from latest snapshot by name (case-insensitive)
   */
  function getAccountValue(accountName: string): number {
    if (!latestSnapshot) return 0;
    const snapshotAccount = latestSnapshot.accounts.find(
      acc => acc.name.toLowerCase() === accountName.toLowerCase()
    );
    return snapshotAccount?.value ?? 0;
  }

  // Group accounts by category
  const sparingAccounts = user.accounts
    .filter(acc => acc.category === 'sparing')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(acc => ({
      tempId: acc.id,
      name: acc.name,
      category: acc.category as 'sparing',
      value: getAccountValue(acc.name),
      isActive: acc.isActive,
    }));

  const gjeldAccounts = user.accounts
    .filter(acc => acc.category === 'gjeld')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(acc => ({
      tempId: acc.id,
      name: acc.name,
      category: acc.category as 'gjeld',
      value: getAccountValue(acc.name),
      isActive: acc.isActive,
      loanDetails: acc.loanDetails,
    }));

  const pensjonAccounts = user.accounts
    .filter(acc => acc.category === 'pensjon')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(acc => ({
      tempId: acc.id,
      name: acc.name,
      category: acc.category as 'pensjon',
      value: getAccountValue(acc.name),
      isActive: acc.isActive,
    }));

  // Ensure at least one account per category with defaults if empty
  if (sparingAccounts.length === 0) {
    sparingAccounts.push({
      tempId: generateTempId(),
      name: 'Ny konto',
      category: 'sparing',
      value: 0,
      isActive: true,
    });
  }

  if (gjeldAccounts.length === 0) {
    gjeldAccounts.push({
      tempId: generateTempId(),
      name: 'Nytt lån',
      category: 'gjeld',
      value: 0,
      isActive: true,
      loanDetails: { interestRate: 5.5, remainingYears: 20 },
    });
  }

  if (pensjonAccounts.length === 0) {
    pensjonAccounts.push({
      tempId: generateTempId(),
      name: 'Ny pensjon',
      category: 'pensjon',
      value: 0,
      isActive: true,
    });
  }

  return {
    userInfo: {
      nickname: user.nickname,
    },
    profile: {
      monthlySalary: user.profile.monthlySalary,
      annualExpenses: user.profile.annualExpenses,
      birthYear: user.profile.birthYear,
      plannedRetirementAge: user.profile.plannedRetirementAge,
      fireNumber: user.profile.fireNumber,
    },
    accounts: {
      sparing: sparingAccounts,
      gjeld: gjeldAccounts,
      pensjon: pensjonAccounts,
    },
  };
}

export default function EconomyPage() {
  const navigate = useNavigate();
  const { user, isLoading: userLoading } = useAuth();

  // Fetch latest snapshot to populate account values
  const { data: snapshots = [], isLoading: snapshotsLoading } = useQuery({
    queryKey: ['snapshots', 'latest'],
    queryFn: () =>
      snapshotApi.getAll({
        orderBy: 'date',
        ascending: false,
        limit: 1
      }),
    enabled: !!user,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const latestSnapshot = snapshots[0];

  if (userLoading || snapshotsLoading) {
    return <LoadingSpinner text="Laster..." />;
  }

  if (!user) {
    navigate('/');
    return null;
  }

  const initialState = convertUserToInitialState(user, latestSnapshot);

  return (
    <div className="onboarding-page">
      <header className="onboarding-page__header">
        <h1 className="onboarding-page__logo">finans</h1>
      </header>

      <main className="onboarding-page__main">
        <div className="onboarding-page__intro">
          <h2 className="onboarding-page__title">Min økonomi</h2>
          <p className="onboarding-page__subtitle">
            Oppdater din profil og kontoer
          </p>
        </div>

        <OnboardingWizard
          mode="edit"
          initialState={initialState}
          onComplete={() => navigate('/dashboard')}
        />
      </main>
    </div>
  );
}
