import { useState, useEffect } from 'react';

/**
 * Feedback Page for Student Testers
 * Collects structured ratings and qualitative thoughts from user testers.
 * Features:
 * - 7 clear questions (role, ease, usefulness, best feature, adoption intent, 2 textareas)
 * - Persists responses into localStorage key 'eduguide_feedback_responses'
 * - Friendly Thank-You confirmation view with "Submit another response" button
 * - Tester Tools: live count, CSV export with RFC 4180 compliant escaping, inline clear confirm
 * - Note on local storage privacy
 */
export default function Feedback() {
  const [role, setRole] = useState('');
  const [easeRating, setEaseRating] = useState(null);
  const [usefulnessRating, setUsefulnessRating] = useState(null);
  const [mostUsefulFeature, setMostUsefulFeature] = useState('');
  const [wouldUse, setWouldUse] = useState('');
  const [confusingOrMissing, setConfusingOrMissing] = useState('');
  const [whatToChangeFirst, setWhatToChangeFirst] = useState('');

  const [validationError, setValidationError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [responsesCount, setResponsesCount] = useState(0);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  // Helper to load responses array safely from localStorage
  const getStoredResponses = () => {
    try {
      const raw = localStorage.getItem('eduguide_feedback_responses');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Error reading feedback from localStorage:', e);
      return [];
    }
  };

  // Sync count on mount
  useEffect(() => {
    const list = getStoredResponses();
    setResponsesCount(list.length);
  }, []);

  const handleRatingClick = (setter, val) => {
    setter(val);
    if (validationError) setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role) {
      setValidationError('Please select who you are in Question 1.');
      return;
    }
    if (!easeRating) {
      setValidationError('Please rate how easy EduGuide was to use in Question 2.');
      return;
    }
    if (!usefulnessRating) {
      setValidationError('Please rate how useful EduGuide would be in Question 3.');
      return;
    }
    if (!mostUsefulFeature) {
      setValidationError('Please select which feature was most useful in Question 4.');
      return;
    }
    if (!wouldUse) {
      setValidationError('Please select whether you would use EduGuide in Question 5.');
      return;
    }

    const newResponse = {
      id: `fb-${Date.now()}`,
      timestamp: new Date().toISOString(),
      role,
      easeRating,
      usefulnessRating,
      mostUsefulFeature,
      wouldUse,
      confusingOrMissing: confusingOrMissing.trim(),
      whatToChangeFirst: whatToChangeFirst.trim(),
    };

    const currentList = getStoredResponses();
    const updated = [newResponse, ...currentList];
    try {
      localStorage.setItem('eduguide_feedback_responses', JSON.stringify(updated));
      setResponsesCount(updated.length);
      setIsSubmitted(true);
      setValidationError('');
    } catch (err) {
      console.error('Failed to save feedback:', err);
      setValidationError('Could not save feedback to localStorage. Please check browser settings.');
    }
  };

  const handleResetForNextTester = () => {
    setRole('');
    setEaseRating(null);
    setUsefulnessRating(null);
    setMostUsefulFeature('');
    setWouldUse('');
    setConfusingOrMissing('');
    setWhatToChangeFirst('');
    setValidationError('');
    setIsSubmitted(false);
  };

  // Download all stored responses as CSV with quotes and commas safely escaped
  const handleDownloadCSV = () => {
    const list = getStoredResponses();
    if (list.length === 0) return;

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val);
      // Double up internal quotes and wrap in quotes
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = [
      'ID',
      'Timestamp',
      'Role',
      'Ease Rating (1-5)',
      'Usefulness Rating (1-5)',
      'Most Useful Feature',
      'Would Use',
      'Confusing or Missing',
      'What to Change First',
    ];

    const rows = list.map((item) => [
      escapeCsv(item.id),
      escapeCsv(item.timestamp),
      escapeCsv(item.role),
      escapeCsv(item.easeRating),
      escapeCsv(item.usefulnessRating),
      escapeCsv(item.mostUsefulFeature),
      escapeCsv(item.wouldUse),
      escapeCsv(item.confusingOrMissing),
      escapeCsv(item.whatToChangeFirst),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `eduguide_feedback_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearAllResponses = () => {
    try {
      localStorage.removeItem('eduguide_feedback_responses');
      setResponsesCount(0);
      setIsConfirmingClear(false);
    } catch (err) {
      console.error('Failed to clear responses:', err);
    }
  };

  return (
    <div className="container feedback-page">
      {/* Page Header */}
      <header className="page-header">
        <h1 className="page-title">Student Tester Feedback</h1>
        <p className="page-description">
          Help us evaluate EduGuide for our student entrepreneurship project. Your thoughts directly shape the next prototype.
        </p>
      </header>

      {/* Main Feedback Card or Thank You Card */}
      {!isSubmitted ? (
        <section className="card feedback-card" aria-labelledby="feedback-form-title">
          <div className="card-header-row">
            <div>
              <h2 id="feedback-form-title" className="card-title">
                Tester Questionnaire
              </h2>
              <p className="card-subtitle">Takes ~2 minutes • Anonymous</p>
            </div>
            <span className="tag-sample">Student Testing</span>
          </div>

          {validationError && (
            <div className="profile-error-alert" role="alert" style={{ marginBottom: 'var(--space-4)' }}>
              <span>⚠️</span>
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="feedback-form">
            {/* Q1: Who are you? */}
            <div className="feedback-question">
              <label htmlFor="role-select" className="question-title">
                1. Who are you? <span className="required-star">*</span>
              </label>
              <select
                id="role-select"
                className="form-select"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  if (validationError) setValidationError('');
                }}
              >
                <option value="">Select your current student stage...</option>
                <option value="Preparing for entrance exams">Preparing for entrance exams</option>
                <option value="Applying to colleges">Applying to colleges</option>
                <option value="Looking for scholarships">Looking for scholarships</option>
                <option value="Exploring career options">Exploring career options</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Q2: How easy was EduGuide to use? */}
            <div className="feedback-question">
              <span className="question-title">
                2. How easy was EduGuide to use? <span className="required-star">*</span>
              </span>
              <p className="rating-guide">1 = Very hard • 5 = Very easy</p>
              <div className="rating-button-row" role="radiogroup" aria-label="Ease of use rating">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    role="radio"
                    aria-checked={easeRating === val}
                    className={`rating-btn ${easeRating === val ? 'selected' : ''}`}
                    onClick={() => handleRatingClick(setEaseRating, val)}
                  >
                    <span className="rating-num">{val}</span>
                    <span className="rating-sub">
                      {val === 1 ? 'Very hard' : val === 5 ? 'Very easy' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: How useful would this be for you? */}
            <div className="feedback-question">
              <span className="question-title">
                3. How useful would this be for you? <span className="required-star">*</span>
              </span>
              <p className="rating-guide">1 = Not useful • 5 = Very useful</p>
              <div className="rating-button-row" role="radiogroup" aria-label="Usefulness rating">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    role="radio"
                    aria-checked={usefulnessRating === val}
                    className={`rating-btn ${usefulnessRating === val ? 'selected' : ''}`}
                    onClick={() => handleRatingClick(setUsefulnessRating, val)}
                  >
                    <span className="rating-num">{val}</span>
                    <span className="rating-sub">
                      {val === 1 ? 'Not useful' : val === 5 ? 'Very useful' : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Q4: Which feature was most useful? */}
            <div className="feedback-question">
              <label htmlFor="feature-select" className="question-title">
                4. Which feature was most useful? <span className="required-star">*</span>
              </label>
              <select
                id="feature-select"
                className="form-select"
                value={mostUsefulFeature}
                onChange={(e) => {
                  setMostUsefulFeature(e.target.value);
                  if (validationError) setValidationError('');
                }}
              >
                <option value="">Choose the standout feature...</option>
                <option value="Dashboard and deadlines">Dashboard and deadlines</option>
                <option value="Explore and save">Explore and save</option>
                <option value="Career guidance">Career guidance</option>
                <option value="Tasks and reminders">Tasks and reminders</option>
              </select>
            </div>

            {/* Q5: Would you use something like this? */}
            <div className="feedback-question">
              <span className="question-title">
                5. Would you use something like this? <span className="required-star">*</span>
              </span>
              <div className="choice-button-row" role="radiogroup" aria-label="Would you use EduGuide">
                {['Yes', 'Maybe', 'No'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={wouldUse === opt}
                    className={`choice-btn ${wouldUse === opt ? 'selected' : ''}`}
                    onClick={() => {
                      setWouldUse(opt);
                      if (validationError) setValidationError('');
                    }}
                  >
                    <span>{wouldUse === opt ? '✓ ' : ''}</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Q6: What was confusing or missing? */}
            <div className="feedback-question">
              <label htmlFor="confusing-text" className="question-title">
                6. What was confusing or missing? <span className="optional-tag">(Optional)</span>
              </label>
              <textarea
                id="confusing-text"
                className="form-textarea"
                rows={3}
                maxLength={500}
                value={confusingOrMissing}
                onChange={(e) => setConfusingOrMissing(e.target.value)}
                placeholder="Tell us about anything that was hard to find or unclear..."
              />
              <span className="field-hint">{confusingOrMissing.length}/500 characters</span>
            </div>

            {/* Q7: What would you change first? */}
            <div className="feedback-question">
              <label htmlFor="change-first-text" className="question-title">
                7. What would you change first? <span className="optional-tag">(Optional)</span>
              </label>
              <textarea
                id="change-first-text"
                className="form-textarea"
                rows={3}
                maxLength={500}
                value={whatToChangeFirst}
                onChange={(e) => setWhatToChangeFirst(e.target.value)}
                placeholder="What is the single highest-priority thing we should improve?"
              />
              <span className="field-hint">{whatToChangeFirst.length}/500 characters</span>
            </div>

            {/* Submit Button */}
            <div className="form-submit-row">
              <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
                Submit Feedback →
              </button>
            </div>
          </form>
        </section>
      ) : (
        /* Thank You Confirmation View */
        <section className="card feedback-thankyou-card" role="status">
          <div className="thankyou-icon">🎉</div>
          <h2 className="thankyou-title">Thank you for your feedback!</h2>
          <p className="thankyou-desc">
            Your response has been saved locally. It will help us refine the design and features for student users.
          </p>
          <div style={{ marginTop: 'var(--space-6)' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleResetForNextTester}
            >
              + Submit Another Response (Next Tester)
            </button>
          </div>
        </section>
      )}

      {/* Tester Tools Section */}
      <section className="tester-tools-card card" aria-labelledby="tester-tools-title">
        <div className="tester-tools-header">
          <div>
            <h3 id="tester-tools-title" className="tester-tools-title">
              🛠️ Tester Tools (Demonstration & Evaluation)
            </h3>
            <p className="tester-tools-note">
              Responses are stored only in this browser on this device.
            </p>
          </div>
          <div className="responses-counter-badge">
            Responses collected: <strong>{responsesCount}</strong>
          </div>
        </div>

        <div className="tester-tools-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleDownloadCSV}
            disabled={responsesCount === 0}
            title={responsesCount === 0 ? 'No responses recorded yet' : 'Export feedback to CSV'}
          >
            📥 Download all responses as CSV
          </button>

          {!isConfirmingClear ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsConfirmingClear(true)}
              disabled={responsesCount === 0}
            >
              🗑️ Clear all responses
            </button>
          ) : (
            <div className="inline-confirm-box">
              <span className="confirm-prompt">Clear all {responsesCount} responses?</span>
              <button
                type="button"
                className="btn btn-primary btn-sm confirm-btn"
                onClick={handleClearAllResponses}
              >
                Yes, Clear All
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsConfirmingClear(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
