import { Link } from 'react-router-dom';

/**
 * 404 Not Found Page
 * Friendly fallback for invalid or unknown routes.
 */
export default function NotFound() {
  return (
    <div className="container not-found-page">
      <div className="card not-found-card">
        <div className="not-found-icon">🧭</div>
        <h1 className="not-found-title">Page Not Found (404)</h1>
        <p className="not-found-text">
          We couldn't find the page you were looking for. It may have moved or the link might be broken.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            ← Back to Dashboard
          </Link>
          <Link to="/explore" className="btn btn-secondary">
            Explore Opportunities
          </Link>
        </div>
      </div>
    </div>
  );
}
