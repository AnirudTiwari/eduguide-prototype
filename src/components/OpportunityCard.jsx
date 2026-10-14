import {
  getDateFromOffset,
  formatDate,
  getRelativeDeadlineLabel,
  getUrgencyLevel,
} from '../utils/dates';

/**
 * OpportunityCard Component
 * Renders an equal-height card for a College, Exam, or Scholarship item.
 * Clicking anywhere on the card opens the detail view; clicking the star button saves/un-saves it.
 *
 * @param {Object} props
 * @param {Object} props.item - The data item
 * @param {'colleges' | 'exams' | 'scholarships'} props.type - The active category type
 * @param {boolean} props.isSaved - Whether this item is saved in bookmarks
 * @param {Function} props.onToggleSave - Handler to toggle bookmark status
 * @param {Function} props.onClickCard - Handler to open full detail view
 */
export default function OpportunityCard({
  item,
  type,
  isSaved,
  onToggleSave,
  onClickCard,
}) {
  // Safe helper to toggle save without triggering the parent card's click event
  const handleSaveClick = (e) => {
    e.stopPropagation();
    onToggleSave(item.id);
  };

  // Helper to render urgency badge for exams and scholarships
  const renderDeadlineBadge = (offsetDays) => {
    const level = getUrgencyLevel(offsetDays);
    const label = getRelativeDeadlineLabel(offsetDays);
    const realDate = formatDate(getDateFromOffset(offsetDays));

    const badgeClass =
      level === 'urgent'
        ? 'badge badge-urgent'
        : level === 'warning'
        ? 'badge badge-warning'
        : 'badge badge-normal';

    return (
      <div className="card-deadline-row">
        <span className={badgeClass}>{label}</span>
        <span className="card-deadline-date">Illustrative deadline: {realDate}</span>
      </div>
    );
  };

  return (
    <div
      className={`opportunity-card ${isSaved ? 'is-saved' : ''}`}
      onClick={onClickCard}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClickCard();
        }
      }}
      aria-label={`View details for ${item.name}`}
    >
      {/* Top Header Row with Title, Illustrative Tag, and Bookmark Star */}
      <div className="opp-header">
        <div className="opp-title-area">
          <div className="opp-badges-row">
            <span className="tag-sample">Illustrative details</span>
            <span className="tag-type">
              {type === 'colleges'
                ? 'College'
                : type === 'exams'
                ? 'Exam'
                : 'Scholarship'}
            </span>
            {item.level && <span className="tag-level">{item.level}</span>}
          </div>
          <h3 className="opp-title">{item.name}</h3>
        </div>

        {/* Bookmark Star Button */}
        <button
          type="button"
          className={`btn-star-bookmark ${isSaved ? 'saved' : ''}`}
          onClick={handleSaveClick}
          aria-label={isSaved ? `Remove ${item.name} from saved` : `Save ${item.name}`}
          title={isSaved ? 'Saved to bookmarks' : 'Save bookmark'}
        >
          <span className="star-icon" aria-hidden="true">
            {isSaved ? '★' : '☆'}
          </span>
          <span className="star-text">{isSaved ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Meta Specifics */}
      <div className="opp-body">
        {type === 'colleges' && (
          <div className="opp-meta-list">
            <div className="opp-meta-row">
              <span className="meta-icon" aria-hidden="true">📍</span>
              <span>{item.city}, {item.state}</span>
            </div>
            <div className="opp-meta-row">
              <span className="meta-icon" aria-hidden="true">🎓</span>
              <span className="opp-course-text">{item.course}</span>
            </div>
            <div className="opp-meta-row">
              <span className="meta-icon" aria-hidden="true">💳</span>
              <span className="opp-fees-text">{item.fees}</span>
            </div>
          </div>
        )}

        {type === 'exams' && (
          <div className="opp-meta-list">
            {renderDeadlineBadge(item.deadlineOffsetDays)}
          </div>
        )}

        {type === 'scholarships' && (
          <div className="opp-meta-list">
            <div className="opp-amount-row">
              <span className="scholarship-amount-pill">{item.amount}</span>
            </div>
            <div className="opp-eligibility-preview">
              <strong>Eligibility:</strong> {item.eligibility}
            </div>
            {renderDeadlineBadge(item.deadlineOffsetDays)}
          </div>
        )}

        {/* Short Blurb */}
        <p className="opp-blurb">{item.blurb}</p>
      </div>

      {/* Bottom Footer Prompt */}
      <div className="opp-footer">
        <span className="view-details-link">
          View Details & Highlights →
        </span>
      </div>
    </div>
  );
}
