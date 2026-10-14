import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * Navbar Component
 * Displays the EduGuide brand and navigation links.
 * Shows a live count badge on the Dashboard link for saved items.
 * Responsive: shows horizontal links on desktop, collapsible menu on mobile.
 * Includes a visually secondary link to the Feedback page for student testers.
 */
export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { savedIds } = useApp();

  // Close mobile menu when a navigation item is clicked
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const mainNavItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Career Guidance', path: '/career' },
  ];

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-container">
        {/* Brand Logo with graduation cap inline SVG */}
        <NavLink to="/" className="navbar-brand" onClick={handleLinkClick}>
          <span className="brand-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </span>
          <span>EduGuide</span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <div className="desktop-nav-group">
          <ul className="nav-links desktop-nav">
            {mainNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  <span>{item.name}</span>
                  {item.path === '/' && savedIds.length > 0 && (
                    <span
                      className="nav-counter-badge"
                      title={`${savedIds.length} saved bookmarks`}
                    >
                      {savedIds.length}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Visually secondary Feedback link */}
          <NavLink
            to="/feedback"
            className={({ isActive }) =>
              isActive
                ? 'nav-link nav-link-secondary active'
                : 'nav-link nav-link-secondary'
            }
          >
            <span>💬 Feedback</span>
          </NavLink>
        </div>

        {/* Mobile Hamburger / Close Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isMobileMenuOpen ? (
            // Close (X) icon
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            // Hamburger icon
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-nav">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              onClick={handleLinkClick}
            >
              <span>{item.name}</span>
              {item.path === '/' && savedIds.length > 0 && (
                <span
                  className="nav-counter-badge"
                  style={{ marginLeft: 'auto' }}
                >
                  {savedIds.length} saved
                </span>
              )}
            </NavLink>
          ))}
          {/* Mobile Feedback Link */}
          <NavLink
            to="/feedback"
            className={({ isActive }) =>
              isActive
                ? 'nav-link nav-link-secondary active'
                : 'nav-link nav-link-secondary'
            }
            onClick={handleLinkClick}
            style={{ marginTop: 'var(--space-2)' }}
          >
            <span>💬 Feedback</span>
          </NavLink>
        </div>
      )}
    </nav>
  );
}
