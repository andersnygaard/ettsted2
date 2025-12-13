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

      {/* Main Content */}
      <main id="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
