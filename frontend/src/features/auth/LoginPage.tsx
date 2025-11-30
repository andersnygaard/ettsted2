import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect authenticated users to dashboard
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = () => {
    window.location.href = '/.auth/login/google?post_login_redirect_uri=/dashboard';
  };

  const handleFacebookLogin = () => {
    window.location.href = '/.auth/login/facebook?post_login_redirect_uri=/dashboard';
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
