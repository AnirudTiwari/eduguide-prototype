import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Toast from './Toast';

/**
 * Layout Component
 * Wraps page routes with the persistent Navbar header,
 * global toast notifications, and provides a consistent page shell
 * without a transformed ancestor that would trap fixed-position dialogs.
 */
export default function Layout() {
  const location = useLocation();

  return (
    <div className="app-layout">
      <Navbar />
      <Toast />
      <main key={location.pathname} className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
