import { useState } from 'react';
import { questions } from '../data/careerRules';

/**
 * CareerQuestionnaire Component
 * Renders a 6-step guided questionnaire with one question per card,
 * progress bar, option chips with check indicators, and gentle inline validation.
 */
export default function CareerQuestionnaire({
  initialAnswers,
  onComplete,
  onCancel,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize form state from existing answers or defaults
  const [formAnswers, setFormAnswers] = useState(() => {
    return (
      initialAnswers || {
        subjects: [],
        activities: [],
        performance: '',
        goalStyle: '',
        location: '',
        educationLevel: 'UG (undergraduate)',
      }
    );
  });

  const [validationError, setValidationError] = useState('');

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Handle option selection
  const handleOptionToggle = (option) => {
    setValidationError('');
    const qId = currentQ.id;

    if (currentQ.type === 'multi') {
      const currentSelected = formAnswers[qId] || [];
      const isAlreadySelected = currentSelected.includes(option);

      if (isAlreadySelected) {
        setFormAnswers((prev) => ({
          ...prev,
          [qId]: currentSelected.filter((item) => item !== option),
        }));
      } else {
        if (currentQ.max && currentSelected.length >= currentQ.max) {
          setValidationError(`You can select up to ${currentQ.max} options.`);
          return;
        }
        setFormAnswers((prev) => ({
          ...prev,
          [qId]: [...currentSelected, option],
        }));
      }
    } else {
      // Single select
      setFormAnswers((prev) => ({
        ...prev,
        [qId]: option,
      }));
    }
  };

  // Validate current question before proceeding
  const handleNext = () => {
    const qId = currentQ.id;
    const answer = formAnswers[qId];

    if (currentQ.type === 'multi') {
      if (!answer || answer.length === 0) {
        setValidationError('Please select at least one option to continue.');
        return;
      }
    } else {
      if (!answer) {
        setValidationError('Please select an option to continue.');
        return;
      }
    }

    setValidationError('');

    if (isLastQuestion) {
      onComplete(formAnswers);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setValidationError('');
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  // Check if an option is currently selected
  const isSelected = (option) => {
    const answer = formAnswers[currentQ.id];
    if (Array.isArray(answer)) {
      return answer.includes(option);
    }
    return answer === option;
  };

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="questionnaire-card card">
      {/* Progress Header */}
      <div className="q-progress-header">
        <div className="q-progress-meta">
          <span className="q-step-text">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="q-percent-text">{progressPercent}% complete</span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>

      {/* Question Details */}
      <div className="q-content">
        <h2 className="q-title">{currentQ.title}</h2>
        <p className="q-subtitle">{currentQ.subtitle}</p>

        {/* Options Selection Grid */}
        <div
          className="q-options-grid"
          role={currentQ.type === 'multi' ? 'group' : 'radiogroup'}
          aria-label={currentQ.title}
        >
          {currentQ.options.map((option) => {
            const selected = isSelected(option);
            return (
              <button
                key={option}
                type="button"
                className={`q-option-btn ${selected ? 'selected' : ''}`}
                onClick={() => handleOptionToggle(option)}
                role={currentQ.type === 'multi' ? 'checkbox' : 'radio'}
                aria-checked={selected}
              >
                <span className="q-check-box" aria-hidden="true">
                  {selected ? '✓' : ''}
                </span>
                <span className="q-option-text">{option}</span>
              </button>
            );
          })}
        </div>

        {/* Gentle Inline Validation Message */}
        {validationError && (
          <div className="q-validation-message" role="alert">
            <span className="val-icon">⚠️</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* Why We Ask Hint */}
        <div className="why-we-ask-hint">
          <span className="hint-icon" aria-hidden="true">💡</span>
          <span>
            <strong>Why we ask:</strong> {currentQ.whyWeAsk}
          </span>
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="q-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleBack}
        >
          {currentIndex === 0 ? (onCancel ? 'Cancel' : 'Back') : '← Back'}
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNext}
        >
          {isLastQuestion ? 'See My Recommendations →' : 'Next Question →'}
        </button>
      </div>
    </div>
  );
}
