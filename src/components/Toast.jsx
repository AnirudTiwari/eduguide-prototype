import { useApp } from '../context/AppContext';

/**
 * Toast Component
 * Displays temporary feedback messages (e.g., "Saved to bookmarks", "Added to your tasks")
 * positioned at the top-right of the viewport.
 */
export default function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="toast-notification" role="status" aria-live="polite">
      <span className="toast-icon" aria-hidden="true">✓</span>
      <span>{toastMessage}</span>
    </div>
  );
}
