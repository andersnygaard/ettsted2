import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';

function Layout() {
  return (
    <div className="app-layout">
      {/* App Header with Navigation */}
      <AppHeader />

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
