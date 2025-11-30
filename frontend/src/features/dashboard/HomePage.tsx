import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import './HomePage.css';

function HomePage() {
  const { user, isAuthenticated, login } = useAuth();

  return (
    <div className="home-page">
      <div className="home-page__content">
        <article className="home-page__welcome-card">
          <h3>Velkommen til Finans</h3>
          <p>Din personlige plattform for portefølje og formue tracking</p>

          {isAuthenticated ? (
            <>
              <p className="home-page__greeting">Hei, {user?.username}!</p>
              <div className="home-page__actions">
                <Link to="/dashboard" className="home-page__btn home-page__btn--primary">
                  <i>dashboard</i>
                  <span>Gå til Dashboard</span>
                </Link>
                <Link to="/portfolio" className="home-page__btn home-page__btn--secondary">
                  <i>account_balance</i>
                  <span>Se Portefølje</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <p>Logg inn for å komme i gang med å tracke din portefølje.</p>
              <div className="home-page__actions">
                <button
                  className="home-page__btn home-page__btn--primary"
                  onClick={() => login('google')}
                >
                  <i>login</i>
                  <span>Logg inn med Google</span>
                </button>
                <button
                  className="home-page__btn home-page__btn--secondary"
                  onClick={() => login('facebook')}
                >
                  <i>login</i>
                  <span>Logg inn med Facebook</span>
                </button>
              </div>
            </>
          )}
        </article>

        <div className="home-page__features">
          <article className="home-page__feature-card">
            <i>trending_up</i>
            <h6>Track Portefølje</h6>
            <p>Følg med på investeringer på tvers av aksjer, fond, krypto og mer</p>
          </article>
          <article className="home-page__feature-card">
            <i>calculate</i>
            <h6>Finansielle Kalkulatorer</h6>
            <p>Bruk kraftige verktøy for renters rente og Monte Carlo simuleringer</p>
          </article>
          <article className="home-page__feature-card">
            <i>insights</i>
            <h6>Visualiseringer</h6>
            <p>Se din formue vokse med interaktive grafer og prognoser</p>
          </article>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
