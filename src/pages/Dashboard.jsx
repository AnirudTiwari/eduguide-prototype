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
 * - Welcome header with student profile details
 * - Merged upcoming deadlines (exams, scholarships, active tasks)
 * - Interactive checklist and inline task creation
 * - Compact Career Guidance card with top rule-based matches
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

  return (
    <div className="container">
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

      {/* 2. WELCOME HEADER WITH STUDENT PROFILE */}
      <header className="dashboard-header">
        <div>
          <h1 className="page-title">
            Welcome back, {student.name}! 👋
          </h1>
          <div className="student-meta">
            <span>
              {student.classStream} • Target: <strong>{student.target}</strong> • {student.city}
            </span>
            <span className="tag-sample">Sample Profile</span>
          </div>
          <div className="student-meta" style={{ marginTop: '6px' }}>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
              Interests:
            </span>
            {student.interests.map((interest) => (
              <span key={interest} className="student-tag">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Action controls: Edit Profile & Demo Reset */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsEditProfileOpen(true)}
            className="btn btn-secondary btn-sm"
            title="Edit student profile details"
          >
            ✏️ Edit profile
          </button>
          <button
            type="button"
            onClick={resetDemoData}
            className="btn btn-secondary btn-sm"
            title="Reset localStorage state to initial sample data"
          >
            ↺ Reset Demo Data
          </button>
        </div>
      </header>

      {/* 3. MAIN DASHBOARD GRID */}
      <div className="dashboard-grid">
        {/* LEFT COLUMN: Deadlines & Tasks */}
        <div className="grid-col">
          {/* UPCOMING DEADLINES CARD */}
          <section className="card" aria-labelledby="deadlines-heading">
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
                return (
                  <div key={`${item.type}-${item.id}-${index}`} className="deadline-item">
                    <div className="deadline-info">
                      <div className="deadline-title" title={item.title}>
                        {item.title}
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
          <section className="card" aria-labelledby="tasks-heading">
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
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                  No tasks right now. Add one below!
                </p>
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
                      <div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  Due in
                </span>
                <input
                  type="number"
                  min="0"
                  max="180"
                  className="task-days-input"
                  value={newDays}
                  onChange={(e) => setNewDays(e.target.value)}
                  title="Due in days from today"
                />
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  days
                </span>
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
          <section className="card" aria-labelledby="career-heading">
            <div className="card-header-row">
              <div>
                <h2 id="career-heading" className="card-title">
                  🧭 Career Guidance
                </h2>
                <p className="card-subtitle">
                  {careerAnswers
                    ? 'Top matches from your 1-minute questionnaire'
                    : 'Personalized pathway matching for 12th PCM'}
                </p>
              </div>
              <span className="tag-sample">
                {careerAnswers ? 'Matched' : '1-Min Quiz'}
              </span>
            </div>

            {!careerAnswers ? (
              <div className="dashboard-career-empty">
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
                  Take a quick 6-question questionnaire to discover transparent rule-based degree and career matches.
                </p>
                <Link to="/career" className="btn btn-primary btn-sm">
                  Take the 1-minute questionnaire
                </Link>
              </div>
            ) : (
              <div className="dashboard-career-matched">
                <div className="dash-career-list">
                  {topCareerMatches.map((rec, idx) => (
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
                      <p className="dash-career-reason">{rec.reasons[0]}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'flex-end' }}>
                  <Link to="/career" className="btn btn-secondary btn-sm">
                    View full guidance
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* SAVED ITEMS CARD */}
          <section className="card" aria-labelledby="saved-heading">
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
              <div className="counter-card">
                <div className="counter-num">{savedColleges.length}</div>
                <div className="counter-label">Colleges</div>
              </div>
              <div className="counter-card">
                <div className="counter-num">{savedScholarshipsList.length}</div>
                <div className="counter-label">Scholarships</div>
              </div>
              <div className="counter-card">
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
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                      <span className="tag-type" style={{ marginRight: '6px' }}>
                        College
                      </span>
                      <span title={col.name}>{col.name}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-ghost-save"
                      onClick={() => toggleSaved(col.id)}
                      title="Remove from saved"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {savedScholarshipsList.map((sch) => (
                  <div key={sch.id} className="saved-item">
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                      <span className="tag-type" style={{ marginRight: '6px' }}>
                        Scholarship
                      </span>
                      <span title={sch.name}>{sch.name}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-ghost-save"
                      onClick={() => toggleSaved(sch.id)}
                      title="Remove from saved"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {savedExamsList.map((ex) => (
                  <div key={ex.id} className="saved-item">
                    <div style={{ minWidth: 0, overflow: 'hidden' }}>
                      <span className="tag-type" style={{ marginRight: '6px' }}>
                        Exam
                      </span>
                      <span title={ex.name}>{ex.name}</span>
                    </div>
                    <button
                      type="button"
                      className="btn-ghost-save"
                      onClick={() => toggleSaved(ex.id)}
                      title="Remove from saved"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SCHOLARSHIPS FOR YOU CARD */}
          <section className="card" aria-labelledby="scholarships-heading">
            <div className="card-header-row">
              <div>
                <h2 id="scholarships-heading" className="card-title">
                  Scholarships for You
                </h2>
                <p className="card-subtitle">
                  Matches for 12th PCM & ECE target (Illustrative criteria)
                </p>
              </div>
              <span className="tag-sample">Illustrative Top 3</span>
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
                      <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-subtle)' }}>
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

      {/* 4. QUICK LINKS TO EXPLORE AND CAREER GUIDANCE */}
      <section className="quick-links-grid" aria-label="Explore other sections">
        <Link to="/explore" className="quick-link-card">
          <div>
            <div className="quick-link-title">🔍 Explore Directory</div>
            <div className="quick-link-desc">
              Browse real Indian colleges, entrance exams, and scholarship schemes
            </div>
          </div>
          <span style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>→</span>
        </Link>

        <Link to="/career" className="quick-link-card">
          <div>
            <div className="quick-link-title">🧭 Career Guidance</div>
            <div className="quick-link-desc">
              View pathways for Electronics, Coding, and Entrepreneurship
            </div>
          </div>
          <span style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>→</span>
        </Link>
      </section>

      {/* 5. EDIT PROFILE MODAL */}
      <ProfileEditModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </div>
  );
}
