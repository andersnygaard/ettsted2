import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthUser } from '../../utils/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetchAuthUser().then(user => {
      if (user) {
        navigate('/dashboard', { replace: true });
      } else {
        setChecking(false);
      }
    });
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = '/.auth/login/google?post_login_redirect_uri=/dashboard';
  };

  const handleFacebookLogin = () => {
    window.location.href = '/.auth/login/facebook?post_login_redirect_uri=/dashboard';
  };

  if (checking) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'var(--background)',
      padding: '1rem'
    }}>
      <article style={{
        padding: '3rem',
        borderRadius: '12px',
        background: 'var(--surface)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h1 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--on-surface)' }}>
          Rentesrente Kalkulator
        </h1>
        <p style={{ color: 'var(--on-surface)', opacity: 0.7, marginBottom: '2rem' }}>
          Logg inn for å bruke kalkulatoren
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            onClick={handleGoogleLogin}
            style={{
              padding: '1rem',
              fontSize: '1rem',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '8px',
              background: 'var(--surface-variant)',
              color: 'var(--on-surface-variant)',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#4285F4">
              <path d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2z"/>
            </svg>
            Logg inn med Google
          </button>

          <button
            onClick={handleFacebookLogin}
            style={{
              padding: '1rem',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '8px',
              background: '#1877F2',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Logg inn med Facebook
          </button>
        </div>
      </article>
    </div>
  );
}
