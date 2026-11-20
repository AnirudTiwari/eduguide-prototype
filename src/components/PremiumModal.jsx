import { useState, useEffect } from 'react';

/**
 * PremiumModal Component
 * Interactive modal demonstrating EduGuide's proposed freemium tier:
 * - Tab 1: Package Overview (benefits, ₹299 illustrative pricing, freemium comparison, honest prototype notice)
 * - Tab 2: Preview Premium Experience (interactive prototype roadmap & college tiering using student's actual responses)
 * - Fully accessible: Escape key to close, backdrop click, body scroll locking, keyboard navigation.
 */
export default function PremiumModal({
  isOpen,
  onClose,
  initialTab = 'overview',
  answers,
  colleges = [],
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync activeTab when modal is reopened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'overview');
    }
  }, [isOpen, initialTab]);

  // Handle escape key and body scroll lock
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

  if (!isOpen) return null;

  // Filter colleges based on user stream / course preference if available
  const relevantColleges = colleges.length > 0 ? colleges : [];

  // Group into illustrative tiers for the prototype demonstration
  const dreamColleges = relevantColleges.filter((c) =>
    ['col-4', 'col-5'].includes(c.id)
  );
  const targetColleges = relevantColleges.filter((c) =>
    ['col-1', 'col-2'].includes(c.id)
  );
  const safeColleges = relevantColleges.filter((c) =>
    ['col-3', 'col-6'].includes(c.id)
  );

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="premium-modal-title"
    >
      <div
        className="modal-card premium-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header premium-modal-header">
          <div>
            <div className="opp-badges-row">
              <span className="badge badge-warning">Proposed Freemium Tier</span>
              <span className="tag-sample">Concept Prototype</span>
            </div>
            <h2 id="premium-modal-title" className="modal-title">
              EduGuide Premium — Personalized Guidance
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

        {/* Tab Navigation */}
        <div className="premium-tab-nav" role="tablist" aria-label="Premium information views">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'overview'}
            className={`premium-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📋 Package Overview & Benefits
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'preview'}
            className={`premium-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            ✨ Preview Premium Experience (Demo)
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body premium-modal-body">
          {activeTab === 'overview' ? (
            /* TAB 1: PACKAGE OVERVIEW */
            <div className="premium-overview-content">
              {/* Intro Banner */}
              <div className="premium-intro-callout">
                <p className="premium-intro-desc">
                  Get more structured support for planning your admission journey, exploring suitable opportunities, and staying organized.
                </p>
                <div className="premium-price-box">
                  <span className="price-tag">₹299</span>
                  <div className="price-details">
                    <strong className="price-title">Proposed Student Package</strong>
                    <span className="price-discreet-note">
                      Illustrative pricing. Package details and availability are subject to validation.
                    </span>
                  </div>
                </div>
              </div>

              {/* 4 Proposed Benefits */}
              <div className="premium-benefits-section">
                <h3 className="premium-section-heading">Proposed Premium Benefits</h3>
                <div className="premium-benefits-grid">
                  <div className="premium-benefit-item">
                    <div className="benefit-icon" aria-hidden="true">🎯</div>
                    <div className="benefit-text">
                      <strong>Enhanced personalized admission planning</strong>
                      <p>
                        Structured milestone planning tailored to your academic stream, chosen career directions, and target institutions.
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item premium-benefit-item">
                    <div className="benefit-icon" aria-hidden="true">⏱️</div>
                    <div className="benefit-text">
                      <strong>Advanced application and deadline tracking</strong>
                      <p>
                        Intelligent lead-time buffers (e.g. 7-day advance targets) and milestone checklists to prevent missed exam registrations.
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item premium-benefit-item">
                    <div className="benefit-icon" aria-hidden="true">🎓</div>
                    <div className="benefit-text">
                      <strong>More detailed college and course guidance</strong>
                      <p>
                        In-depth branch comparisons, seat-matrix overviews, historical cut-off references, and tuition fee transparency.
                      </p>
                    </div>
                  </div>

                  <div className="benefit-item premium-benefit-item">
                    <div className="benefit-icon" aria-hidden="true">📊</div>
                    <div className="benefit-text">
                      <strong>Priority-based application planning</strong>
                      <p>
                        Strategic grouping of colleges into Dream (Reach), Target, and Safe safety-net categories to balance risk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Freemium Plan Comparison Table */}
              <div className="plan-comparison-section">
                <h3 className="premium-section-heading">Free vs. Proposed Premium Package</h3>
                <div className="comparison-table-wrapper">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th>Capability</th>
                        <th>EduGuide Free (Current)</th>
                        <th>EduGuide Premium (Proposed)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>College, Exam & Scholarship Discovery</td>
                        <td><span className="comp-check">✓ Included</span></td>
                        <td><span className="comp-check">✓ Included</span></td>
                      </tr>
                      <tr>
                        <td>Deadline Tracking & Basic Checklist</td>
                        <td><span className="comp-check">✓ Included</span></td>
                        <td><span className="comp-check">✓ Advanced with 7-Day Buffers</span></td>
                      </tr>
                      <tr>
                        <td>Rule-Based Career Guidance Questionnaire</td>
                        <td><span className="comp-check">✓ Included</span></td>
                        <td><span className="comp-check">✓ Included</span></td>
                      </tr>
                      <tr>
                        <td>Priority College Tiering (Dream / Target / Safe)</td>
                        <td>— Standard Directory</td>
                        <td><span className="comp-check">✓ Automated Strategic Grouping</span></td>
                      </tr>
                      <tr>
                        <td>4-Phase Admission Roadmap</td>
                        <td>— Basic Recommendations</td>
                        <td><span className="comp-check">✓ Structured Step-by-Step Milestones</span></td>
                      </tr>
                      <tr>
                        <td>Pricing</td>
                        <td><strong>Free Forever</strong></td>
                        <td><strong>₹299 (Illustrative package)</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Honest Startup Prototype Notice */}
              <aside className="honesty-panel" role="note" style={{ marginTop: 'var(--space-4)' }}>
                <div className="honesty-icon" aria-hidden="true">ℹ️</div>
                <div className="honesty-text">
                  <strong>Startup Prototype Transparency:</strong> EduGuide is currently a student entrepreneurship prototype. Real payment processing, card transactions, active subscriptions, and paid human counselling services are not yet operational. This section illustrates our proposed freemium business model for academic presentation and user feedback.
                </div>
              </aside>

              {/* CTA to Interactive Preview */}
              <div className="premium-overview-action">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab('preview')}
                >
                  Preview Premium Experience (Interactive Demo) →
                </button>
              </div>
            </div>
          ) : (
            /* TAB 2: PREVIEW PREMIUM EXPERIENCE (DEMO) */
            <div className="premium-preview-content">
              {/* Concept Demo Notice */}
              <aside className="preview-demo-banner" role="status">
                <span className="banner-icon" aria-hidden="true">✨</span>
                <span>
                  <strong>Interactive Concept Preview:</strong> Below is an illustrative demonstration of how personalized guidance would look using your questionnaire responses and sample institutional data.
                </span>
              </aside>

              {/* Feature 1: Priority College Tiering */}
              <section className="preview-section" aria-labelledby="tiering-heading">
                <div className="preview-section-header">
                  <h3 id="tiering-heading" className="preview-heading">
                    1. Priority College Tiering (Strategic Risk Balancing)
                  </h3>
                  <span className="tag-sample">Personalized Preview</span>
                </div>
                <p className="preview-subtext">
                  Colleges from your pathway categorized by selectivity to ensure you apply with a balanced portfolio.
                </p>

                <div className="tier-cards-grid">
                  {/* Dream Tier */}
                  <div className="tier-card tier-dream">
                    <div className="tier-card-header">
                      <span className="tier-badge badge-dream">🌟 Dream / Reach</span>
                      <span className="tier-target-text">High competition • Aspirational</span>
                    </div>
                    <ul className="tier-college-list">
                      {dreamColleges.map((c) => (
                        <li key={c.id} className="tier-college-item">
                          <strong>{c.name}</strong>
                          <span className="tier-college-meta">{c.city}, {c.state} • {c.course}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="tier-tip">
                      💡 Tip: Target top percentile scores; register early for national entrance tests.
                    </div>
                  </div>

                  {/* Target Tier */}
                  <div className="tier-card tier-target">
                    <div className="tier-card-header">
                      <span className="tier-badge badge-target">🎯 Target</span>
                      <span className="tier-target-text">Strong match for current performance</span>
                    </div>
                    <ul className="tier-college-list">
                      {targetColleges.map((c) => (
                        <li key={c.id} className="tier-college-item">
                          <strong>{c.name}</strong>
                          <span className="tier-college-meta">{c.city}, {c.state} • {c.course}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="tier-tip">
                      💡 Tip: Complete application forms in round 1 counselling for maximum branch choices.
                    </div>
                  </div>

                  {/* Safe Tier */}
                  <div className="tier-card tier-safe">
                    <div className="tier-card-header">
                      <span className="tier-badge badge-safe">🛡️ Safe / Backup</span>
                      <span className="tier-target-text">Dependable regional safety net</span>
                    </div>
                    <ul className="tier-college-list">
                      {safeColleges.map((c) => (
                        <li key={c.id} className="tier-college-item">
                          <strong>{c.name}</strong>
                          <span className="tier-college-meta">{c.city}, {c.state} • {c.course}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="tier-tip">
                      💡 Tip: Ensure verified marksheets are ready early to secure eligibility.
                    </div>
                  </div>
                </div>
              </section>

              {/* Feature 2: 4-Phase Admission Roadmap */}
              <section className="preview-section" aria-labelledby="roadmap-heading">
                <div className="preview-section-header">
                  <h3 id="roadmap-heading" className="preview-heading">
                    2. Structured 4-Phase Admission Roadmap
                  </h3>
                  <span className="tag-sample">Step-by-Step Plan</span>
                </div>
                <p className="preview-subtext">
                  Chronological milestone guidance tailored to undergraduate admissions.
                </p>

                <div className="roadmap-timeline">
                  <div className="roadmap-step">
                    <div className="step-num-badge">1</div>
                    <div className="step-content">
                      <h4 className="step-title">Phase 1: Foundation & Eligibility Review</h4>
                      <p className="step-desc">
                        Audit class 12th subject requirements against targeted entrance tests (JEE Main, CUET, or NEET). Gather identity and category documentation.
                      </p>
                      <span className="step-timing">Month 1–2 • Completed at own pace</span>
                    </div>
                  </div>

                  <div className="roadmap-step">
                    <div className="step-num-badge">2</div>
                    <div className="step-content">
                      <h4 className="step-title">Phase 2: Exam Registration & 7-Day Safety Buffer</h4>
                      <p className="step-desc">
                        Submit exam forms at least 7 days before illustrative cut-off dates to avoid payment gateway traffic and technical glitches.
                      </p>
                      <span className="step-timing">Month 3–4 • Active deadline tracking</span>
                    </div>
                  </div>

                  <div className="roadmap-step">
                    <div className="step-num-badge">3</div>
                    <div className="step-content">
                      <h4 className="step-title">Phase 3: Counselling Strategy & Branch Preference</h4>
                      <p className="step-desc">
                        Structure choice-filling lists across Dream, Target, and Safety colleges based on your verified scorecard and budget.
                      </p>
                      <span className="step-timing">Month 5–6 • Decision milestone</span>
                    </div>
                  </div>

                  <div className="roadmap-step">
                    <div className="step-num-badge">4</div>
                    <div className="step-content">
                      <h4 className="step-title">Phase 4: Document Verification & Enrollment</h4>
                      <p className="step-desc">
                        Seat confirmation, initial tuition remittance, hostel reservation, and final campus physical verification.
                      </p>
                      <span className="step-timing">Month 7 • Final enrollment</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer Note */}
              <div className="preview-footer-note">
                <span>ℹ️</span>
                <span>
                  This preview is generated strictly as an educational prototype demonstration. All colleges and steps are illustrative examples.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer premium-modal-footer">
          <div className="modal-footer-left">
            <span className="modal-footer-pricing-summary">
              EduGuide Freemium Concept • <strong>₹299</strong> (Illustrative package)
            </span>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
