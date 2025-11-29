export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = '/.auth/login/google';
  };

  const handleFacebookLogin = () => {
    window.location.href = '/.auth/login/facebook';
  };

  return (
    <div className="middle-align center-align">
      <div className="page padding">
        <div className="row">
          <div className="max center-align">
            <h1 className="large-text">Velkommen til Finans</h1>
            <p className="large-text">Logg inn for å spore porteføljen din</p>

            <div className="space"></div>

            <div className="row">
              <button
                onClick={handleGoogleLogin}
                className="button large-elevate"
                type="button"
              >
                <i className="fab fa-google"></i>
                <span>Logg inn med Google</span>
              </button>
            </div>

            <div className="space"></div>

            <div className="row">
              <button
                onClick={handleFacebookLogin}
                className="button large-elevate"
                type="button"
              >
                <i className="fab fa-facebook"></i>
                <span>Logg inn med Facebook</span>
              </button>
            </div>

            <div className="space"></div>

            <p className="small-text">
              Ved å logge inn godtar du våre vilkår og personvernregler
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
