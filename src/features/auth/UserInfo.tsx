import { useEffect, useState } from 'react';

interface AuthUser {
  identityProvider?: string;
  userDetails?: string;
  userId?: string;
  claims?: Array<{ typ: string; val: string }>;
  givenName?: string;
  familyName?: string;
  userPrincipalName?: string;
}

export default function UserInfo() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/.auth/me')
      .then((res) => res.json())
      .then((data) => {
        setUser(data.clientPrincipal || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    window.location.href = '/.auth/logout';
  };

  if (loading) return null;
  if (!user) return null;

  // Get user name from claims or provider fields
  const userName =
    user.givenName && user.familyName
      ? `${user.givenName} ${user.familyName}`
      : user.userDetails || user.userId || 'User';

  // Get profile image from provider
  const getProfileImage = (): string | null => {
    const emailClaim = user.claims?.find((c) => c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress');
    if (!emailClaim) return null;

    // Use gravatar for generic profile image
    const email = emailClaim.val.toLowerCase();
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
  };

  const profileImage = getProfileImage();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      marginBottom: '2rem'
    }}>
      {profileImage && (
        <img
          src={profileImage}
          alt={userName}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}
        />
      )}
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem' }}>
          {userName}
        </p>
        <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
          {user.identityProvider || 'Autentisert'}
        </p>
      </div>
      <button
        onClick={handleLogout}
        style={{
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          transition: 'background 0.3s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        Logg ut
      </button>
    </div>
  );
}
