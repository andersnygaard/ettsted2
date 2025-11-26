import { useState } from 'react';

export default function HomePage() {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = '/.auth/login/google?post_login_redirect_uri=/dashboard';
  };

  const handleFacebookLogin = () => {
    window.location.href = '/.auth/login/facebook?post_login_redirect_uri=/dashboard';
  };

  return (
    <>
      <header className="primary">
        <nav>
          <div className="max">
            <span className="bold">Finans App</span>
          </div>
          <a href="/calculator">Kalkulatorer</a>
          <a href="#om-oss">Om oss</a>
          <button onClick={() => setShowLoginDialog(true)}>Logg inn</button>
        </nav>
      </header>

      <main className="responsive">
        <article className="large-padding center-align" style={{ marginTop: '4rem' }}>
          <h1>Smarte finansverktøy</h1>
          <p className="large-text">
            Få full kontroll over din økonomi med våre enkle og kraftige kalkulatorer.
          </p>
          <button className="extra" onClick={() => setShowLoginDialog(true)}>
            <span>Kom i gang</span>
            <i>arrow_forward</i>
          </button>
        </article>

        <div className="grid medium-padding">
          <article className="s12 m6 l4">
            <i className="extra-large">savings</i>
            <h5>Rentesrente Kalkulator</h5>
            <p>Se hvordan pengene dine vokser over tid med rentesrente-effekten.</p>
          </article>

          <article className="s12 m6 l4">
            <i className="extra-large">trending_up</i>
            <h5>Visualiser Veksten</h5>
            <p>Interaktive grafer som viser utviklingen av investeringene dine.</p>
          </article>

          <article className="s12 m6 l4">
            <i className="extra-large">security</i>
            <h5>Sikker Innlogging</h5>
            <p>Logg inn trygt med Google eller Facebook.</p>
          </article>
        </div>

        <article id="om-oss" className="medium-padding">
          <h3>Om oss</h3>
          <p>
            Finans App er laget for å hjelpe deg med å ta bedre økonomiske beslutninger.
            Våre verktøy er enkle å bruke og gir deg innsikt i hvordan sparepengene dine kan vokse.
          </p>
        </article>
      </main>

      {showLoginDialog && (
        <div className="overlay active" onClick={() => setShowLoginDialog(false)}>
          <dialog className="active" onClick={(e) => e.stopPropagation()}>
            <h5>Velg innloggingsmetode</h5>
            <nav className="vertical">
              <button className="border" onClick={handleGoogleLogin}>
                <i>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </i>
                <span>Google</span>
              </button>
              <button style={{ background: '#1877F2', color: 'white' }} onClick={handleFacebookLogin}>
                <i>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </i>
                <span>Facebook</span>
              </button>
            </nav>
            <nav className="right-align">
              <button className="border" onClick={() => setShowLoginDialog(false)}>
                Avbryt
              </button>
            </nav>
          </dialog>
        </div>
      )}
    </>
  );
}
