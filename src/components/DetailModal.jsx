import { useEffect } from 'react';
import {
  getDateFromOffset,
  formatDate,
  getRelativeDeadlineLabel,
  getUrgencyLevel,
} from '../utils/dates';

/**
 * DetailModal Component
 * Accessible popup modal displaying complete information, highlights,
 * save toggle, task creation, and a search link to the official site.
 */
export default function DetailModal({
  isOpen,
  onClose,
  item,
  type,
  isSaved,
  onToggleSave,
  onAddTask,
  tasks = [],
}) {
  // Prevent background scrolling and attach Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  // Determine if a deadline task already exists in tasks
  const taskTitle = `Apply: ${item.name}`;
  const isAlreadyInTasks = tasks.some(
    (t) => t.title === taskTitle || t.relatedTo === item.name
  );

  const handleAddDeadlineTask = () => {
    if (isAlreadyInTasks) return;
    onAddTask({
      title: taskTitle,
      dueOffsetDays: item.deadlineOffsetDays,
      relatedTo: item.name,
    });
  };

  const deadlineOffset = item.deadlineOffsetDays;
  const realDate =
    deadlineOffset !== undefined
      ? formatDate(getDateFromOffset(deadlineOffset))
      : null;
  const relativeLabel =
    deadlineOffset !== undefined
      ? getRelativeDeadlineLabel(deadlineOffset)
      : null;
  const urgencyLevel =
    deadlineOffset !== undefined ? getUrgencyLevel(deadlineOffset) : null;

  // Official site Google search URL
  const searchOfficialUrl = `https://www.google.com/search?q=${encodeURIComponent(
    item.name + ' official website'
  )}`;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div className="opp-badges-row">
              <span className="tag-sample">Illustrative details</span>
              <span className="tag-type">
                {type === 'colleges'
                  ? 'College'
                  : type === 'exams'
                  ? 'Entrance Exam'
                  : 'Scholarship'}
              </span>
              {item.level && <span className="tag-level">{item.level}</span>}
            </div>
            <h2 id="modal-title" className="modal-title">
              {item.name}
            </h2>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body">
          {/* CATEGORY 1: COLLEGE DETAILS */}
          {type === 'colleges' && (
            <div className="modal-details-stack">
              <div className="detail-grid">
                <div className="detail-stat">
                  <span className="stat-label">Location</span>
                  <span className="stat-value">{item.city}, {item.state}</span>
                </div>
                <div className="detail-stat">
                  <span className="stat-label">Degree Level</span>
                  <span className="stat-value">{item.level}</span>
                </div>
                <div className="detail-stat">
                  <span className="stat-label">Target Course Category</span>
                  <span className="stat-value">{item.course}</span>
                </div>
                <div className="detail-stat">
                  <span className="stat-label">Tuition Fees</span>
                  <span className="stat-value">{item.fees}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4 className="detail-section-title">Campus & Program Overview</h4>
                <p className="detail-text">{item.blurb}</p>
              </div>

              {item.highlights && item.highlights.length > 0 && (
                <div className="detail-section">
                  <h4 className="detail-section-title">Campus Highlights</h4>
                  <ul className="highlights-list">
                    {item.highlights.map((point, index) => (
                      <li key={index} className="highlight-item">
                        <span className="highlight-bullet">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* CATEGORY 2: EXAM DETAILS */}
          {type === 'exams' && (
            <div className="modal-details-stack">
              <div className="detail-grid">
                <div className="detail-stat">
                  <span className="stat-label">Examination Level</span>
                  <span className="stat-value">{item.level}</span>
                </div>
                <div className="detail-stat">
                  <span className="stat-label">Application Timeline</span>
                  <span className="stat-value">
                    Illustrative deadline: {realDate} ({relativeLabel})
                  </span>
                </div>
              </div>

              {urgencyLevel && (
                <div className="modal-urgency-callout">
                  <span className="callout-icon">⏱</span>
                  <span>
                    Illustrative deadline: <strong>{relativeLabel}</strong> ({realDate}).
                  </span>
                </div>
              )}

              <div className="detail-section">
                <h4 className="detail-section-title">About this Assessment</h4>
                <p className="detail-text">{item.blurb}</p>
              </div>
            </div>
          )}

          {/* CATEGORY 3: SCHOLARSHIP DETAILS */}
          {type === 'scholarships' && (
            <div className="modal-details-stack">
              <div className="detail-grid">
                <div className="detail-stat">
                  <span className="stat-label">Grant Amount</span>
                  <span className="stat-value">{item.amount}</span>
                </div>
                <div className="detail-stat">
                  <span className="stat-label">Scholarship Level</span>
                  <span className="stat-value">{item.level}</span>
                </div>
                <div className="detail-stat" style={{ gridColumn: 'span 2' }}>
                  <span className="stat-label">Application Timeline</span>
                  <span className="stat-value">
                    Illustrative deadline: {realDate} ({relativeLabel})
                  </span>
                </div>
              </div>

              <div className="detail-section">
                <h4 className="detail-section-title">Eligibility Criteria</h4>
                <div className="eligibility-box">
                  <span className="box-icon">🎯</span>
                  <span>{item.eligibility}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4 className="detail-section-title">Scheme Description</h4>
                <p className="detail-text">{item.blurb}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="modal-footer">
          <div className="modal-footer-left">
            {/* Bookmark button */}
            <button
              type="button"
              className={`btn-ghost-save ${isSaved ? 'saved' : ''}`}
              onClick={() => onToggleSave(item.id)}
              aria-pressed={isSaved}
            >
              <span>{isSaved ? '★' : '☆'}</span>
              <span>{isSaved ? 'Saved in Bookmarks' : 'Save Bookmark'}</span>
            </button>

            {/* Official search link */}
            <a
              href={searchOfficialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              title="Search Google for official website"
            >
              🔍 Search official site ↗
            </a>

            {/* For exams and scholarships: Add deadline to tasks */}
            {(type === 'exams' || type === 'scholarships') && (
              <button
                type="button"
                className={`btn btn-sm ${
                  isAlreadyInTasks ? 'btn-secondary disabled' : 'btn-primary'
                }`}
                onClick={handleAddDeadlineTask}
                disabled={isAlreadyInTasks}
                title={
                  isAlreadyInTasks
                    ? 'This deadline is already present on your action checklist'
                    : 'Add a reminder task on your Dashboard'
                }
              >
                {isAlreadyInTasks
                  ? '✓ Already in your tasks'
                  : '+ Add deadline to my tasks'}
              </button>
            )}
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Disclaimer Footer Note */}
        <div className="modal-disclaimer">
          College, exam and scholarship names are real. Dates, fees and eligibility shown here are illustrative and not verified. Always check the official website before applying.
        </div>
      </div>
    </div>
  );
}
