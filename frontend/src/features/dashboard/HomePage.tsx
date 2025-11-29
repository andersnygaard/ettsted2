import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

function HomePage() {
  const { user, isAuthenticated, login } = useAuth();

  return (
    <div className="container">
      <div className="grid center-align">
        <div className="s12 m8 l6">
          <article className="border round">
            <h3>Velkommen til Finans</h3>
            <p className="large-text">
              Din personlige plattform for portefølje og formue tracking
            </p>

            {isAuthenticated ? (
              <>
                <p>Hei, {user?.username}! 👋</p>
                <div className="space"></div>
                <div className="row">
                  <Link to="/dashboard" className="button large">
                    <i>dashboard</i>
                    <span>Gå til Dashboard</span>
                  </Link>
                  <Link to="/portfolio" className="button large border">
                    <i>account_balance</i>
                    <span>Se Portefølje</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p>Logg inn for å komme i gang med å tracke din portefølje.</p>
                <div className="space"></div>
                <div className="row">
                  <button className="large" onClick={() => login('google')}>
                    <i>login</i>
                    <span>Logg inn med Google</span>
                  </button>
                  <button className="large border" onClick={() => login('facebook')}>
                    <i>login</i>
                    <span>Logg inn med Facebook</span>
                  </button>
                </div>
              </>
            )}
          </article>

          <div className="space"></div>

          <div className="grid">
            <div className="s12 m4">
              <article className="border round center-align">
                <i className="extra-large primary-text">trending_up</i>
                <h6>Track Portefølje</h6>
                <p className="small-text">
                  Følg med på investeringer på tvers av aksjer, fond, krypto og mer
                </p>
              </article>
            </div>
            <div className="s12 m4">
              <article className="border round center-align">
                <i className="extra-large primary-text">calculate</i>
                <h6>Finansielle Kalkulatorer</h6>
                <p className="small-text">
                  Bruk kraftige verktøy for renters rente og Monte Carlo simuleringer
                </p>
              </article>
            </div>
            <div className="s12 m4">
              <article className="border round center-align">
                <i className="extra-large primary-text">insights</i>
                <h6>Visualiseringer</h6>
                <p className="small-text">
                  Se din formue vokse med interaktive grafer og prognoser
                </p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
