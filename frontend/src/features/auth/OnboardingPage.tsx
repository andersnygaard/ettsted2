/**
 * OnboardingPage
 *
 * Wrapper page for the onboarding wizard.
 * Shown to new users after first OAuth login.
 */

import { OnboardingWizard } from './onboarding/OnboardingWizard';
import './OnboardingPage.css';

export default function OnboardingPage() {
  return (
    <div className="onboarding-page">
      <header className="onboarding-page__header">
        <h1 className="onboarding-page__logo">finans</h1>
      </header>

      <main className="onboarding-page__main">
        <div className="onboarding-page__intro">
          <h2 className="onboarding-page__title">Velkommen til Finans</h2>
          <p className="onboarding-page__subtitle">
            La oss sette opp din profil og portefølje
          </p>
        </div>

        <OnboardingWizard />
      </main>
    </div>
  );
}
