import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import './Layout.css';

function Layout() {
  return (
    <div className="app-layout">
      {/* Skip link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Hopp til hovedinnhold
      </a>

      {/* App Header with Navigation */}
      <AppHeader />

      {/* Main Content - tabindex for skip link focus */}
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
