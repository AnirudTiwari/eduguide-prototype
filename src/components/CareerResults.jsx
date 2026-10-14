import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getRecommendations } from '../data/careerRules';
import {
  getDateFromOffset,
  formatDate,
  getRelativeDeadlineLabel,
} from '../utils/dates';

/**
 * CareerResults Component
 * Renders the top 3 ranked career pathways, detailed college and exam routes,
 * collapsible other options, scoring transparency breakdown, and inline reset control.
 */
export default function CareerResults({ answers, onEdit, onReset }) {
  const {
    colleges,
    exams,
    savedIds,
    toggleSaved,
    isSaved,
    tasks,
    addTask,
  } = useApp();

  const [showOtherPaths, setShowOtherPaths] = useState(false);
  const [showScoringRules, setShowScoringRules] = useState(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  // Compute transparent rule-based recommendations
  const allRecommendations = getRecommendations(answers);
  const topPaths = allRecommendations.slice(0, 3);
  const otherPaths = allRecommendations.slice(3);

  // Check if scores are broad / low (e.g. top score < 3 or all top 3 paths are "Possible")
  const isBroadMatch =
    topPaths.length > 0 &&
    (topPaths[0].score < 3 || topPaths.every((r) => r.matchLevel === 'Possible'));

  // Helper to prioritize colleges based on location preference
  const getRelevantColleges = (courseCategory) => {
    if (!courseCategory) return [];

    const matched = colleges.filter((col) => col.course === courseCategory);

    // If user prefers Chandigarh/Punjab region, put those at top
    if (answers?.location === 'Chandigarh / Punjab region') {
      return [...matched].sort((a, b) => {
        const aRegional =
          a.state.includes('Punjab') || a.state.includes('Chandigarh');
        const bRegional =
          b.state.includes('Punjab') || b.state.includes('Chandigarh');
        if (aRegional && !bRegional) return -1;
        if (!aRegional && bRegional) return 1;
        return 0;
      });
    }

    return matched;
  };

  // Helper to check if an exam deadline is already on the action checklist
  const isExamTaskAdded = (examName) => {
    const taskTitle = `Apply: ${examName}`;
    return tasks.some(
      (t) => t.title === taskTitle || t.relatedTo === examName
    );
  };

  const handleAddExamTask = (exam) => {
    if (isExamTaskAdded(exam.name)) return;
    addTask({
      title: `Apply: ${exam.name}`,
      dueOffsetDays: exam.deadlineOffsetDays,
      relatedTo: exam.name,
    });
  };

  return (
    <div className="career-results-view">
      {/* 1. TOP HONESTY PANEL */}
      <aside className="honesty-panel" role="note">
        <div className="honesty-icon" aria-hidden="true">💡</div>
        <div className="honesty-text">
          <strong>Transparent Prototype System:</strong> These suggestions come from a simple, transparent rule-based demo (your answers add points to different paths). It is not an AI model or a validated career assessment. Please also talk to a counsellor or teacher.
        </div>
      </aside>

      {/* 2. USER PROFILE SUMMARY & EDIT CONTROL */}
      <div className="results-summary-card card">
        <div className="summary-left">
          <h3 className="summary-title">Your Profile Snapshot</h3>
          <div className="summary-tags">
            {answers.subjects && answers.subjects.length > 0 && (
              <span className="summary-pill">
                <strong>Subjects:</strong> {answers.subjects.join(', ')}
              </span>
            )}
            {answers.goalStyle && (
              <span className="summary-pill">
                <strong>Goal:</strong> {answers.goalStyle}
              </span>
            )}
            {answers.location && (
              <span className="summary-pill">
                <strong>Location:</strong> {answers.location}
              </span>
            )}
            {answers.performance && (
              <span className="summary-pill">
                <strong>Performance:</strong> {answers.performance}
              </span>
            )}
          </div>
        </div>

        <div className="summary-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onEdit}
          >
            ✎ Edit My Answers
          </button>

          {!isConfirmingReset ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsConfirmingReset(true)}
            >
              Start Over
            </button>
          ) : (
            <div className="inline-confirm-box">
              <span className="confirm-prompt">Reset answers?</span>
              <button
                type="button"
                className="btn btn-primary btn-sm confirm-btn"
                onClick={() => {
                  setIsConfirmingReset(false);
                  onReset();
                }}
              >
                Yes, Reset
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsConfirmingReset(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. TOP 3 CAREER PATHWAYS */}
      <section className="top-paths-section" aria-labelledby="top-paths-heading">
        <div className="section-title-row">
          <h2 id="top-paths-heading" className="section-title">
            Top Recommended Pathways
          </h2>
          <span className="tag-sample">Ranked Top 3</span>
        </div>

        {/* Gentle note when scores are broad/low */}
        {isBroadMatch && (
          <aside className="broad-matches-note" role="note">
            <span className="broad-note-icon" aria-hidden="true">💡</span>
            <span>Your answers were broad, so these are starting points to explore, not firm matches.</span>
          </aside>
        )}

        <div className="top-paths-grid">
          {topPaths.map((rec, index) => {
            const { path, score, matchLevel, reasons, competitiveNote } = rec;
            const relevantColleges = getRelevantColleges(path.courseCategory);
            const relevantExams = exams.filter((e) =>
              path.relatedExamIds.includes(e.id)
            );
            const hasListings =
              relevantColleges.length > 0 || relevantExams.length > 0;

            const badgeColorClass =
              matchLevel === 'Strong'
                ? 'badge-urgent'
                : matchLevel === 'Good'
                ? 'badge-warning'
                : 'badge-normal';

            return (
              <article key={path.id} className="career-card card">
                {/* Header Row */}
                <div className="career-card-header">
                  <div className="career-rank-title">
                    <span className="career-rank-badge">#{index + 1}</span>
                    <h3 className="career-path-title">{path.title}</h3>
                  </div>
                  <div className="career-badges-row">
                    <span className={`badge ${badgeColorClass}`}>
                      {matchLevel} Match
                    </span>
                    <span className="badge badge-normal">
                      Score: {score} pts
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="career-desc">{path.description}</p>

                {/* Why This Suits You */}
                <div className="reasons-block">
                  <h4 className="reasons-heading">Why this may suit you:</h4>
                  <ul className="reasons-list">
                    {reasons.map((reason, rIdx) => (
                      <li key={rIdx} className="reason-item">
                        <span className="reason-bullet" aria-hidden="true">✓</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Competitive Entrance Note */}
                {competitiveNote && (
                  <div className="competitive-callout">
                    <span className="callout-icon" aria-hidden="true">⚠️</span>
                    <span>{competitiveNote}</span>
                  </div>
                )}

                {/* Pathway Details: Colleges & Exams */}
                <div className="pathway-details-box">
                  <h4 className="pathway-heading">
                    Explore This Route (Illustrative Listings)
                  </h4>

                  {!hasListings ? (
                    <div className="empty-pathway-note">
                      ℹ️ No sample listings for this path yet. More coming in the full product.
                    </div>
                  ) : (
                    <div className="pathway-columns">
                      {/* Colleges Column */}
                      {relevantColleges.length > 0 && (
                        <div className="pathway-col">
                          <h5 className="sub-heading">
                            🎓 Relevant Colleges ({relevantColleges.length})
                          </h5>
                          <div className="pathway-items-list">
                            {relevantColleges.slice(0, 3).map((col) => {
                              const saved = isSaved(col.id);
                              return (
                                <div key={col.id} className="pathway-item-row">
                                  <div className="item-text-info">
                                    <div className="item-name" title={col.name}>
                                      {col.name}
                                    </div>
                                    <div className="item-meta">
                                      <span>{col.city}, {col.state}</span>
                                      <span>•</span>
                                      <span className="tag-sample">Illustrative details</span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    className={`btn-ghost-save ${saved ? 'saved' : ''}`}
                                    onClick={() => toggleSaved(col.id)}
                                    title={saved ? 'Remove bookmark' : 'Save bookmark'}
                                  >
                                    {saved ? '★ Saved' : '☆ Save'}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Exams Column */}
                      {relevantExams.length > 0 && (
                        <div className="pathway-col">
                          <h5 className="sub-heading">
                            📝 Relevant Entrance Exams ({relevantExams.length})
                          </h5>
                          <div className="pathway-items-list">
                            {relevantExams.map((exam) => {
                              const saved = isSaved(exam.id);
                              const taskAdded = isExamTaskAdded(exam.name);
                              const realDate = formatDate(
                                getDateFromOffset(exam.deadlineOffsetDays)
                              );

                              return (
                                <div key={exam.id} className="pathway-item-row">
                                  <div className="item-text-info">
                                    <div className="item-name">{exam.name}</div>
                                    <div className="item-meta">
                                      <span>Illustrative deadline: {realDate}</span>
                                      <span>({getRelativeDeadlineLabel(exam.deadlineOffsetDays)})</span>
                                    </div>
                                  </div>
                                  <div className="item-actions-row">
                                    <button
                                      type="button"
                                      className={`btn-ghost-save ${saved ? 'saved' : ''}`}
                                      onClick={() => toggleSaved(exam.id)}
                                      title={saved ? 'Remove bookmark' : 'Save bookmark'}
                                    >
                                      {saved ? '★' : '☆'}
                                    </button>
                                    <button
                                      type="button"
                                      className={`btn btn-sm ${
                                        taskAdded ? 'btn-secondary disabled' : 'btn-primary'
                                      }`}
                                      onClick={() => handleAddExamTask(exam)}
                                      disabled={taskAdded}
                                      style={{ fontSize: '11px', padding: '3px 7px' }}
                                    >
                                      {taskAdded ? '✓ Added' : '+ Add task'}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. EXPLORE OTHER OPTIONS EXPANDER */}
      <section className="other-options-section">
        <div className="expander-card card">
          <button
            type="button"
            className="expander-toggle-btn"
            onClick={() => setShowOtherPaths((prev) => !prev)}
            aria-expanded={showOtherPaths}
          >
            <div className="expander-text">
              <span className="expander-title">
                Explore 5 Other Career Pathways
              </span>
              <span className="expander-subtitle">
                {showOtherPaths ? 'Hide other options' : 'View rankings for the remaining fields'}
              </span>
            </div>
            <span className="expander-icon" aria-hidden="true">
              {showOtherPaths ? '▲' : '▼'}
            </span>
          </button>

          {showOtherPaths && (
            <div className="other-paths-list">
              {otherPaths.map((rec, idx) => (
                <div key={rec.path.id} className="other-path-item">
                  <div className="other-path-header">
                    <span className="other-rank">#{idx + 4}</span>
                    <span className="other-title">{rec.path.title}</span>
                    <span className="badge badge-normal" style={{ fontSize: '11px' }}>
                      {rec.matchLevel} Match ({rec.score} pts)
                    </span>
                  </div>
                  <p className="other-desc">{rec.path.description}</p>
                  <p className="other-reason">
                    <strong>Primary Match Reason:</strong> {rec.reasons[0]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. COLLAPSIBLE "HOW WE MATCHED YOU" TRANSPARENCY SECTION */}
      <section className="scoring-transparency-section">
        <div className="expander-card card">
          <button
            type="button"
            className="expander-toggle-btn"
            onClick={() => setShowScoringRules((prev) => !prev)}
            aria-expanded={showScoringRules}
          >
            <div className="expander-text">
              <span className="expander-title">
                🔍 How We Matched You (Transparent Rules)
              </span>
              <span className="expander-subtitle">
                Inspect exactly how your answers contributed to each pathway's score
              </span>
            </div>
            <span className="expander-icon" aria-hidden="true">
              {showScoringRules ? '▲' : '▼'}
            </span>
          </button>

          {showScoringRules && (
            <div className="rules-breakdown-body">
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                Each question in the questionnaire adds points (+2 or +3 for strong alignment, +1 for secondary alignment) based on verified course prerequisites and typical domain affinities:
              </p>
              <div className="rules-table-wrapper">
                <table className="rules-table">
                  <thead>
                    <tr>
                      <th>Question Category</th>
                      <th>Your Answer</th>
                      <th>Boosted Pathways</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Favourite Subjects</td>
                      <td>{answers.subjects?.join(', ') || 'None'}</td>
                      <td>Physics & Maths boost Engineering, CS & Data Science; Biology boosts Medicine.</td>
                    </tr>
                    <tr>
                      <td>Activities Enjoyed</td>
                      <td>{answers.activities?.join(', ') || 'None'}</td>
                      <td>Coding boosts Software; Circuits boost ECE; Experiments boost Pure Sciences.</td>
                    </tr>
                    <tr>
                      <td>Career Goal Style</td>
                      <td>{answers.goalStyle || 'None'}</td>
                      <td>High-growth tech boosts Software, ECE & Data; Business boosts Entrepreneurship.</td>
                    </tr>
                    <tr>
                      <td>Academic Range</td>
                      <td>{answers.performance || 'None'}</td>
                      <td>Competitive entry note attached if performance is Below 60% on highly competitive routes.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
