/**
 * OnboardingPage
 *
 * Wrapper page for the onboarding wizard.
 * Shown to new users after first OAuth login.
 */

import { OnboardingWizard } from './onboarding/OnboardingWizard';
import { PageHeader } from '@finans/components';
import './OnboardingPage.css';

export default function OnboardingPage() {
  return (
    <div className="onboarding-page">
      <header className="onboarding-page__header">
        <h1 className="onboarding-page__logo">finans</h1>
      </header>

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
