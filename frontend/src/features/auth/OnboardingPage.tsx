/**
 * OnboardingPage
 *
 * Wrapper page for the onboarding wizard.
 * Shown to new users after first OAuth login.
 */

import { OnboardingWizard } from './onboarding/OnboardingWizard';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { PageHeader } from '@finans/components';
import './OnboardingPage.css';

export default function OnboardingPage() {
  usePageTitle('Velkommen');
  return (
    <div className="onboarding-page">
      <main className="onboarding-page__main">
        <PageHeader
          title="Velkommen til Finans"
          subtitle="La oss sette opp din profil og portefølje"
        />

        <OnboardingWizard />
      </main>
    </div>
  );
}
