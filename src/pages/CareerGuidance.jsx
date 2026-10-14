import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import CareerQuestionnaire from '../components/CareerQuestionnaire';
import CareerResults from '../components/CareerResults';

/**
 * CareerGuidance Page Component
 * Central view for career exploration:
 * - Shows an intro start card on first visit
 * - Presents a 6-step questionnaire
 * - Displays transparent rule-based recommendations with relevant colleges & exams
 */
export default function CareerGuidance() {
  const { careerAnswers, setCareerAnswers, clearCareerAnswers } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  // When user completes questionnaire
  const handleCompleteQuestionnaire = (answers) => {
    setCareerAnswers(answers);
    setIsEditing(false);
  };

  // When user resets answers
  const handleReset = () => {
    clearCareerAnswers();
    setIsEditing(false);
  };

  return (
    <div className="container career-page">
      {/* Page Header */}
      <header className="page-header career-header">
        <div className="career-header-text">
          <div className="breadcrumb-nav">
            <Link to="/" className="breadcrumb-link">
              ← Back to Dashboard
            </Link>
          </div>
          <h1 className="page-title">Career Guidance & Pathways</h1>
          <p className="page-description">
            Transparent, rule-based recommendations connecting your subject strengths to higher education degrees.
          </p>
        </div>
        <span className="tag-sample" style={{ alignSelf: 'flex-start' }}>
          Rule Engine Demo
        </span>
      </header>

      {/* Main Content Area: Intro Card vs Questionnaire vs Results */}
      {!careerAnswers && !isEditing ? (
        // 1. FIRST VISIT INTRO CARD
        <div className="career-intro-card card">
          <div className="intro-badge">
            <span>🧭 1-Minute Career Explorer</span>
          </div>
          <h2 className="intro-title">
            Find Career Pathways That Match Your Strengths
          </h2>
          <p className="intro-subtitle">
            Answer 6 simple questions about your favourite subjects, activities, and goals to discover tailored undergraduate pathways.
          </p>

          <div className="intro-features-grid">
            <div className="intro-feature">
              <span className="feat-icon">⚡</span>
              <div>
                <strong>Takes About 1 Minute</strong>
                <p>6 quick single- and multi-select questions.</p>
              </div>
            </div>

            <div className="intro-feature">
              <span className="feat-icon">🔍</span>
              <div>
                <strong>100% Transparent Rules</strong>
                <p>Simple point-scoring logic with clear explanations.</p>
              </div>
            </div>

            <div className="intro-feature">
              <span className="feat-icon">🎓</span>
              <div>
                <strong>Direct Pathway Links</strong>
                <p>Maps recommendations to relevant colleges and entrance exams.</p>
              </div>
            </div>
          </div>

          <div className="intro-action-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Start 1-Minute Questionnaire →
            </button>
          </div>
        </div>
      ) : isEditing ? (
        // 2. QUESTIONNAIRE VIEW
        <CareerQuestionnaire
          initialAnswers={careerAnswers}
          onComplete={handleCompleteQuestionnaire}
          onCancel={careerAnswers ? () => setIsEditing(false) : null}
        />
      ) : (
        // 3. RESULTS VIEW
        <CareerResults
          answers={careerAnswers}
          onEdit={() => setIsEditing(true)}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
