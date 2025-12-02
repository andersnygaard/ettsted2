import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { LoginModal } from '../auth/LoginModal';
import './HomePage.css';

function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero__content">
          <span className="landing-hero__label">Portefølje & Formue Tracking</span>
          <h1 className="landing-hero__title">
            Ta kontroll over<br />din økonomi
          </h1>
          <p className="landing-hero__subtitle">
            Spor investeringer, visualiser formue, og planlegg din vei mot økonomisk frihet.
          </p>

          {isAuthenticated ? (
            <div className="landing-hero__actions">
              <Link to="/dashboard" className="landing-btn landing-btn--primary">
                <i>dashboard</i>
                <span>Gå til Dashboard</span>
              </Link>
              <Link to="/portfolio" className="landing-btn landing-btn--secondary">
                <i>account_balance</i>
                <span>Se Portefølje</span>
              </Link>
            </div>
          ) : (
            <div className="landing-hero__actions">
              <button
                className="landing-btn landing-btn--primary"
                onClick={() => setIsLoginModalOpen(true)}
                disabled={isLoading}
              >
                <i>login</i>
                <span>Logg inn</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features">
        <span className="landing-features__label">Funksjoner</span>
        <h2 className="landing-features__title">Alt du trenger for å spore formuen</h2>

        <div className="landing-features__grid">
          <article className="landing-feature-card">
            <div className="landing-feature-card__icon">
              <i>trending_up</i>
            </div>
            <h3>Portefølje</h3>
            <p>Følg med på investeringer på tvers av aksjer, fond, krypto og mer. Se total netto formue over tid.</p>
          </article>

          <article className="landing-feature-card">
            <div className="landing-feature-card__icon">
              <i>savings</i>
            </div>
            <h3>Sparing & F.I.R.E.</h3>
            <p>Track sparerate og følg din vei mot økonomisk uavhengighet med F.I.R.E. beregninger.</p>
          </article>

          <article className="landing-feature-card">
            <div className="landing-feature-card__icon">
              <i>account_balance</i>
            </div>
            <h3>Gjeld</h3>
            <p>Hold oversikt over lån og se hvor mye av gjelden din som er dekket av sparingen.</p>
          </article>

          <article className="landing-feature-card">
            <div className="landing-feature-card__icon">
              <i>calculate</i>
            </div>
            <h3>Kalkulatorer</h3>
            <p>Kraftige verktøy for renters rente, låneberegning og Monte Carlo simuleringer.</p>
          </article>

          <article className="landing-feature-card">
            <div className="landing-feature-card__icon">
              <i>elderly</i>
            </div>
            <h3>Pensjon</h3>
            <p>Se oppspart pensjon og fremtidige projeksjoner basert på arbeidsgiver og folketrygden.</p>
          </article>

          <article className="landing-feature-card">
            <div className="landing-feature-card__icon">
              <i>insights</i>
            </div>
            <h3>Visualiseringer</h3>
            <p>Interaktive grafer og prognoser som viser formuens utvikling og fremtidige mål.</p>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <h2 className="landing-cta__title">Klar til å starte?</h2>
        <p className="landing-cta__subtitle">Gratis å bruke. Ingen kredittkort nødvendig.</p>
        {!isAuthenticated && (
          <div className="landing-cta__actions">
            <button
              className="landing-btn landing-btn--primary landing-btn--large"
              onClick={() => setIsLoginModalOpen(true)}
              disabled={isLoading}
            >
              <i>rocket_launch</i>
              <span>Kom i gang</span>
            </button>
          </div>
        )}
      </section>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}

export default HomePage;
