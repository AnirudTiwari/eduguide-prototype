import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getRecommendations } from '../data/careerRules';
import ProfileEditModal from '../components/ProfileEditModal';
import {
  getDateFromOffset,
  formatDate,
  getRelativeDeadlineLabel,
  getUrgencyLevel,
} from '../utils/dates';

/**
 * Dashboard Page
 * Central hub for students displaying:
 * - Urgency banner for deadlines within 3 days
 * - Workspace hero card with student profile details and quick actions
 * - 4-card summary KPI metric row (Deadlines, Bookmarks, Tasks, Career status)
 * - Merged upcoming deadlines with distinctive urgency indicators
 * - Interactive action checklist and inline task creation
 * - Compact Career Guidance card with visual affinity meters and top matches
 * - Saved items counters and list
 * - Recommended scholarships preview
 * - Quick action links to Explore and Career Guidance
 */
export default function Dashboard() {
  const {
    student,
    tasks,
    addTask,
    toggleTask,
    savedIds,
    toggleSaved,
    isSaved,
    colleges,
    exams,
    scholarships,
    careerAnswers,
    resetDemoData,
  } = useApp();

  // State for new task inline form
  const [newTitle, setNewTitle] = useState('');
  const [newDays, setNewDays] = useState(3);

  // State for Profile Edit Modal
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Top career recommendations if questionnaire is answered
  const topCareerMatches = careerAnswers
    ? getRecommendations(careerAnswers).slice(0, 2)
    : [];

  // 1. Calculate merged upcoming deadlines (soonest first)
  // Include all exams, scholarships, and active (non-completed) tasks
  const examDeadlines = exams.map((exam) => ({
    id: exam.id,
    title: exam.name,
    type: 'Exam',
    offset: exam.deadlineOffsetDays,
  }));

  const scholarshipDeadlines = scholarships.map((sch) => ({
    id: sch.id,
    title: sch.name,
    type: 'Scholarship',
    offset: sch.deadlineOffsetDays,
  }));

  const taskDeadlines = tasks
    .filter((task) => !task.done)
    .map((task) => ({
      id: task.id,
      title: task.title,
      type: 'Task',
      offset: task.dueOffsetDays,
    }));

  const allDeadlines = [...examDeadlines, ...scholarshipDeadlines, ...taskDeadlines].sort(
    (a, b) => a.offset - b.offset
  );

  // Deadlines due within 3 days for the top reminder banner
  const urgentDeadlinesCount = allDeadlines.filter((item) => item.offset <= 3).length;

  // 2. Saved items lookup (safely matching existing items)
  const savedColleges = colleges.filter((col) => savedIds.includes(col.id));
  const savedScholarshipsList = scholarships.filter((sch) => savedIds.includes(sch.id));
  const savedExamsList = exams.filter((ex) => savedIds.includes(ex.id));

  const totalSavedCount =
    savedColleges.length + savedScholarshipsList.length + savedExamsList.length;

  // Pending vs completed tasks
  const pendingTasksCount = tasks.filter((task) => !task.done).length;
  const completedTasksCount = tasks.filter((task) => task.done).length;

  // Student initials for workspace avatar
  const studentInitials = student?.name
    ? student.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'EG';

  // Handle task submission
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle,
      dueOffsetDays: Number(newDays) || 1,
      relatedTo: 'Personal Goal',
    });

    setNewTitle('');
    setNewDays(3);
  };

  // Helper for rendering urgency badge
  const renderUrgencyBadge = (offset) => {
    const level = getUrgencyLevel(offset);
    const label = getRelativeDeadlineLabel(offset);
    const badgeClass =
      level === 'urgent'
        ? 'badge badge-urgent'
        : level === 'warning'
        ? 'badge badge-warning'
        : 'badge badge-normal';

    return <span className={badgeClass}>{label}</span>;
  };

  // Helper for category icons
  const getItemTypeIcon = (type) => {
    if (type === 'Exam') return '🎓';
    if (type === 'Scholarship') return '🏆';
    return '📋';
  };

  // Helper for visual match affinity percentage
  const getMatchPercent = (matchLevel) => {
    if (matchLevel === 'Strong') return 90;
    if (matchLevel === 'Good') return 68;
    return 45;
  };

  return (
    <div className="container dashboard-container">
      {/* 1. TOP REMINDER BANNER (if any deadline is within 3 days) */}
      {urgentDeadlinesCount > 0 && (
        <aside className="reminder-banner" role="alert">
          <div className="reminder-content">
            <span className="reminder-icon" aria-hidden="true">
              🔔
            </span>
            <span>
              <strong>Attention:</strong> {urgentDeadlinesCount}{' '}
              {urgentDeadlinesCount === 1 ? 'illustrative deadline is' : 'illustrative deadlines are'} coming up within the next 3 days.
            </span>
          </div>
          <span className="tag-sample">Illustrative Notice</span>
        </aside>
      )}

      {/* 2. WELCOME WORKSPACE HERO CARD */}
      <header className="dashboard-hero-card card" aria-label="Student Workspace Header">
        <div className="hero-profile-area">
          <div className="student-avatar" aria-hidden="true">
            {studentInitials}
          </div>

          <div className="hero-text-area">
            <div className="hero-top-badge-row">
              <span className="tag-sample">Student Workspace</span>
              <span className="student-status-pill">Academic Year 2024–25</span>
            </div>

            <h1 className="hero-greeting">
              Welcome back, {student.name}! 👋
            </h1>

            <div className="hero-meta-row">
              <span className="profile-chip">
                <span className="chip-icon" aria-hidden="true">🎓</span>
                <span>{student.classStream}</span>
              </span>
              <span className="profile-chip">
                <span className="chip-icon" aria-hidden="true">🎯</span>
                <span>Target: <strong>{student.target}</strong></span>
              </span>
              <span className="profile-chip">
                <span className="chip-icon" aria-hidden="true">📍</span>
                <span>{student.city}</span>
              </span>
            </div>

            {student.interests && student.interests.length > 0 && (
              <div className="hero-interests-row">
                <span className="interests-label">Focus Areas:</span>
                <div className="interests-tags-list">
                  {student.interests.map((interest) => (
                    <span key={interest} className="student-tag">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls: Primary Action, Edit Profile & Demo Reset */}
        <div className="hero-actions-area">
          {!careerAnswers ? (
            <Link to="/career" className="btn btn-primary btn-sm hero-primary-btn">
              <span aria-hidden="true">🧭</span> Take Career Quiz
            </Link>
          ) : (
            <Link to="/explore" className="btn btn-primary btn-sm hero-primary-btn">
              <span aria-hidden="true">🔍</span> Explore Directory
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsEditProfileOpen(true)}
            className="btn btn-secondary btn-sm"
            title="Edit student profile details"
          >
            ✏️ Edit Profile
          </button>

          <button
            type="button"
            onClick={resetDemoData}
            className="btn btn-ghost-subtle btn-sm"
            title="Reset localStorage state to initial sample data"
          >
            ↺ Reset Demo Data
          </button>
        </div>
      </header>

      {/* 3. SUMMARY KPI METRIC CARDS (Calculated from real local data) */}
      <section className="dashboard-metrics-grid" aria-label="Student Overview Metrics">
        {/* Metric 1: Upcoming Deadlines */}
        <div className="metric-card metric-card-deadlines animate-stagger-1">
          <div className="metric-card-top">
            <span className="metric-label">Active Deadlines</span>
            <span className="metric-icon-box deadlines-icon-box" aria-hidden="true">⏳</span>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{allDeadlines.length}</span>
            {urgentDeadlinesCount > 0 ? (
              <span className="metric-pill metric-pill-urgent">{urgentDeadlinesCount} urgent (≤3d)</span>
            ) : (
              <span className="metric-pill metric-pill-normal">Sorted by urgency</span>
            )}
          </div>
          <p className="metric-caption">Exams, scholarships & tasks</p>
        </div>

        {/* Metric 2: Saved Bookmarks */}
        <div className="metric-card metric-card-saved animate-stagger-2">
          <div className="metric-card-top">
            <span className="metric-label">Saved Opportunities</span>
            <span className="metric-icon-box saved-icon-box" aria-hidden="true">⭐</span>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{totalSavedCount}</span>
            <span className="metric-pill metric-pill-teal">
              {savedColleges.length} Col • {savedExamsList.length} Ex
            </span>
          </div>
          <p className="metric-caption">{savedScholarshipsList.length} scholarships tracked</p>
        </div>

        {/* Metric 3: Action Checklist */}
        <div className="metric-card metric-card-tasks animate-stagger-3">
          <div className="metric-card-top">
            <span className="metric-label">Action Checklist</span>
            <span className="metric-icon-box tasks-icon-box" aria-hidden="true">✅</span>
          </div>
          <div className="metric-value-row">
            <span className="metric-value">{pendingTasksCount}</span>
            <span className="metric-pill metric-pill-blue">
              {completedTasksCount} of {tasks.length} done
            </span>
          </div>
          <p className="metric-caption">Interactive student action items</p>
        </div>

        {/* Metric 4: Career Guidance */}
        <div className="metric-card metric-card-career animate-stagger-4">
          <div className="metric-card-top">
            <span className="metric-label">Career Guidance</span>
            <span className="metric-icon-box career-icon-box" aria-hidden="true">🧭</span>
          </div>
          <div className="metric-value-row">
            <span className="metric-value" style={{ fontSize: careerAnswers ? '1.35rem' : '1.4rem' }}>
              {careerAnswers ? 'Matched' : 'Not Taken'}
            </span>
            {careerAnswers ? (
              <span className="metric-pill metric-pill-teal">
                {topCareerMatches[0]?.matchLevel || 'Active'}
              </span>
            ) : (
              <Link to="/career" className="metric-pill metric-pill-action">
                Take quiz →
              </Link>
            )}
          </div>
          <p className="metric-caption" title={careerAnswers ? topCareerMatches[0]?.path.title : 'Discover suitable degree paths'}>
            {careerAnswers ? (topCareerMatches[0]?.path.title || 'Personalized') : '7-question rule engine'}
          </p>
        </div>
      </section>

      {/* 4. MAIN DASHBOARD TWO-COLUMN GRID */}
      <div className="dashboard-grid">
        {/* LEFT COLUMN: Deadlines & Tasks */}
        <div className="grid-col">
          {/* UPCOMING DEADLINES CARD */}
          <section className="card dashboard-section-card" aria-labelledby="deadlines-heading">
            <div className="card-header-row">
              <div>
                <h2 id="deadlines-heading" className="card-title">
                  Upcoming Deadlines
                </h2>
                <p className="card-subtitle">
                  Exams, scholarships, and tasks (Illustrative deadlines sorted by urgency)
                </p>
              </div>
              <span className="tag-sample">Illustrative dates</span>
            </div>

            <div className="deadlines-list">
              {allDeadlines.slice(0, 6).map((item, index) => {
                const realDate = formatDate(getDateFromOffset(item.offset));
                const urgency = getUrgencyLevel(item.offset);
                const typeIcon = getItemTypeIcon(item.type);

                return (
                  <div
                    key={`${item.type}-${item.id}-${index}`}
                    className={`deadline-item deadline-item-${urgency}`}
                  >
                    <div className="deadline-info">
                      <div className="deadline-title-row">
                        <span className="deadline-type-icon" aria-hidden="true">{typeIcon}</span>
                        <span className="deadline-title" title={item.title}>
                          {item.title}
                        </span>
                      </div>
                      <div className="deadline-meta">
                        <span className="tag-type">{item.type}</span>
                        <span>•</span>
                        <span>Illustrative deadline: {realDate}</span>
                      </div>
                    </div>
                    <div className="deadline-badges">
                      {renderUrgencyBadge(item.offset)}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* YOUR TASKS CARD */}
          <section className="card dashboard-section-card" aria-labelledby="tasks-heading">
            <div className="card-header-row">
              <div>
                <h2 id="tasks-heading" className="card-title">
                  Your Action Checklist
                </h2>
                <p className="card-subtitle">
                  Tick tasks when done, or add custom action items
                </p>
              </div>
              <span className="tag-sample">Interactive</span>
            </div>

            {/* Checklist */}
            <div className="task-list">
              {tasks.length === 0 ? (
                <div className="empty-checklist-state">
                  <span className="empty-icon" aria-hidden="true">📝</span>
                  <p>No tasks right now. Add a milestone below to stay organized!</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`task-item ${task.done ? 'completed' : ''}`}
                  >
                    <label className="task-checkbox-label">
                      <input
                        type="checkbox"
                        className="task-checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                        aria-label={`Mark "${task.title}" as ${task.done ? 'pending' : 'completed'}`}
                      />
                      <div className="task-text-container">
                        <div className="task-title">{task.title}</div>
                        <span className="task-related">
                          Related to: {task.relatedTo}
                        </span>
                      </div>
                    </label>
                    <div>
                      {task.done ? (
                        <span className="badge badge-normal">Completed</span>
                      ) : (
                        renderUrgencyBadge(task.dueOffsetDays)
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Inline Task Form */}
            <form onSubmit={handleAddTask} className="task-form">
              <input
                type="text"
                className="task-input"
                placeholder="New task title (e.g. Gather marksheets)..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <div className="task-days-picker">
                <span className="task-days-label">Due in</span>
                <input
                  type="number"
                  min="0"
                  max="180"
                  className="task-days-input"
                  value={newDays}
                  onChange={(e) => setNewDays(e.target.value)}
                  title="Due in days from today"
                />
                <span className="task-days-unit">days</span>
              </div>
              <button type="submit" className="btn btn-primary btn-sm">
                + Add Task
              </button>
            </form>
          </section>
        </div>

        {/* RIGHT COLUMN: Career Guidance, Saved Bookmarks & Scholarships */}
        <div className="grid-col">
          {/* COMPACT CAREER GUIDANCE CARD */}
          <section className="card dashboard-section-card" aria-labelledby="career-heading">
            <div className="card-header-row">
              <div>
                <h2 id="career-heading" className="card-title">
                  🧭 Career Guidance
                </h2>
                <p className="card-subtitle">
                  {careerAnswers
                    ? 'Top matches from your 1-minute questionnaire'
                    : 'Personalized pathway matching for your stream'}
                </p>
              </div>
              <span className="tag-sample">
                {careerAnswers ? 'Matched' : '7-Question Quiz'}
              </span>
            </div>

            {!careerAnswers ? (
              <div className="dashboard-career-empty">
                <div className="career-empty-icon" aria-hidden="true">🧭</div>
                <h3 className="career-empty-title">Discover Your Top Undergraduate Pathways</h3>
                <p className="career-empty-desc">
                  Take a quick 7-question questionnaire to discover transparent rule-based degree and career matches tailored to your strengths.
                </p>
                <div className="career-empty-bullets">
                  <span>⚡ 1 minute to complete</span>
                  <span>🔍 100% transparent rules</span>
                  <span>🎓 Direct college & exam links</span>
                </div>
                <Link to="/career" className="btn btn-primary btn-sm career-start-btn">
                  Take the 1-minute questionnaire →
                </Link>
              </div>
            ) : (
              <div className="dashboard-career-matched">
                <div className="dash-career-list">
                  {topCareerMatches.map((rec, idx) => {
                    const matchPercent = getMatchPercent(rec.matchLevel);

                    return (
                      <div key={rec.path.id} className="dash-career-item">
                        <div className="dash-career-top">
                          <span className="dash-career-title">
                            #{idx + 1} {rec.path.title}
                          </span>
                          <span
                            className={`badge ${
                              rec.matchLevel === 'Strong'
                                ? 'badge-urgent'
                                : rec.matchLevel === 'Good'
                                ? 'badge-warning'
                                : 'badge-normal'
                            }`}
                            style={{ fontSize: '11px' }}
                          >
                            {rec.matchLevel} Match
                          </span>
                        </div>

                        {/* Visual Affinity Match Meter */}
                        <div className="match-meter-container" aria-label={`Match affinity: ${rec.matchLevel}`}>
                          <div className="match-meter-track">
                            <div
                              className={`match-meter-fill match-fill-${rec.matchLevel.toLowerCase()}`}
                              style={{ width: `${matchPercent}%` }}
                            />
                          </div>
                        </div>

                        <p className="dash-career-reason">{rec.reasons[0]}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="dash-career-footer">
                  <Link to="/career" className="btn btn-secondary btn-sm">
                    View full guidance →
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* SAVED ITEMS CARD */}
          <section className="card dashboard-section-card" aria-labelledby="saved-heading">
            <div className="card-header-row">
              <div>
                <h2 id="saved-heading" className="card-title">
                  Saved Bookmarks
                </h2>
                <p className="card-subtitle">
                  Colleges, exams, and scholarships you want to track
                </p>
              </div>
              <span className="tag-sample">Saved ({totalSavedCount})</span>
            </div>

            {/* Counts Row */}
            <div className="saved-counters">
              <div className="counter-card counter-card-colleges">
                <div className="counter-num">{savedColleges.length}</div>
                <div className="counter-label">Colleges</div>
              </div>
              <div className="counter-card counter-card-scholarships">
                <div className="counter-num">{savedScholarshipsList.length}</div>
                <div className="counter-label">Scholarships</div>
              </div>
              <div className="counter-card counter-card-exams">
                <div className="counter-num">{savedExamsList.length}</div>
                <div className="counter-label">Exams</div>
              </div>
            </div>

            {/* List of saved names or empty state */}
            {totalSavedCount === 0 ? (
              <div className="empty-state">
                <p>You haven't saved any colleges, exams, or scholarships yet.</p>
                <Link to="/explore" className="btn btn-primary btn-sm">
                  Explore Opportunities →
                </Link>
              </div>
            ) : (
              <div className="saved-list">
                {savedColleges.map((col) => (
                  <div key={col.id} className="saved-item">
                    <div className="saved-item-info">
                      <span className="tag-type">College</span>
                      <span className="saved-item-name" title={col.name}>{col.name}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-ghost-save"
                      onClick={() => toggleSaved(col.id)}
                      title="Remove from saved"
                      aria-label={`Remove ${col.name} from saved`}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {savedScholarshipsList.map((sch) => (
                  <div key={sch.id} className="saved-item">
                    <div className="saved-item-info">
                      <span className="tag-type">Scholarship</span>
                      <span className="saved-item-name" title={sch.name}>{sch.name}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-ghost-save"
                      onClick={() => toggleSaved(sch.id)}
                      title="Remove from saved"
                      aria-label={`Remove ${sch.name} from saved`}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {savedExamsList.map((ex) => (
                  <div key={ex.id} className="saved-item">
                    <div className="saved-item-info">
                      <span className="tag-type">Exam</span>
                      <span className="saved-item-name" title={ex.name}>{ex.name}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-ghost-save"
                      onClick={() => toggleSaved(ex.id)}
                      title="Remove from saved"
                      aria-label={`Remove ${ex.name} from saved`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SCHOLARSHIPS FOR YOU CARD */}
          <section className="card dashboard-section-card" aria-labelledby="scholarships-heading">
            <div className="card-header-row">
              <div>
                <h2 id="scholarships-heading" className="card-title">
                  Scholarships for You
                </h2>
                <p className="card-subtitle">
                  Matches for {student.classStream} (Illustrative criteria)
                </p>
              </div>
              <span className="tag-sample">Top 3 Matches</span>
            </div>

            <div className="scholarships-list">
              {scholarships.slice(0, 3).map((sch) => {
                const saved = isSaved(sch.id);
                const realDate = formatDate(getDateFromOffset(sch.deadlineOffsetDays));

                return (
                  <article key={sch.id} className="scholarship-item">
                    <div className="scholarship-top-row">
                      <div className="scholarship-name">{sch.name}</div>
                      <span className="scholarship-amount">{sch.amount}</span>
                    </div>

                    <p className="scholarship-eligibility">
                      <strong>Eligibility:</strong> {sch.eligibility}
                    </p>

                    <div className="scholarship-footer">
                      <span className="scholarship-deadline-meta">
                        Illustrative deadline: {realDate} ({getRelativeDeadlineLabel(sch.deadlineOffsetDays)})
                      </span>
                      <button
                        type="button"
                        className={`btn-ghost-save ${saved ? 'saved' : ''}`}
                        onClick={() => toggleSaved(sch.id)}
                        aria-pressed={saved}
                      >
                        {saved ? '★ Saved' : '☆ Save'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* 5. QUICK LINKS TO EXPLORE AND CAREER GUIDANCE */}
      <section className="quick-links-grid" aria-label="Explore other sections">
        <Link to="/explore" className="quick-link-card">
          <div className="quick-link-content">
            <div className="quick-link-title">🔍 Explore Directory</div>
            <div className="quick-link-desc">
              Browse real Indian colleges, entrance exams, and scholarship schemes
            </div>
          </div>
          <span className="quick-link-arrow" aria-hidden="true">→</span>
        </Link>

        <Link to="/career" className="quick-link-card">
          <div className="quick-link-content">
            <div className="quick-link-title">🧭 Career Guidance</div>
            <div className="quick-link-desc">
              View pathways for Electronics, Coding, and Entrepreneurship
            </div>
          </div>
          <span className="quick-link-arrow" aria-hidden="true">→</span>
        </Link>
      </section>

      {/* 6. EDIT PROFILE MODAL */}
      <ProfileEditModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
}
