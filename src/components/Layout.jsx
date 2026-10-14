import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Toast from './Toast';

/**
 * Layout Component
 * Wraps page routes with the persistent Navbar header,
 * global toast notifications, and provides a consistent page shell.
 */
export default function Layout() {
  return (
    <div className="app-layout">
      <Navbar />
      <Toast />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
