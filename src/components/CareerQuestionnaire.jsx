import { useState } from 'react';
import { questions } from '../data/careerRules';

/**
 * CareerQuestionnaire Component
 * Renders a 7-step guided questionnaire with one question per card,
 * progress bar, option chips with check indicators, and gentle inline validation.
 */
export default function CareerQuestionnaire({
  initialAnswers,
  onComplete,
  onCancel,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize form state from existing answers or defaults safely
  const [formAnswers, setFormAnswers] = useState(() => {
    const defaults = {
      location: '',
      subjects: [],
      activities: [],
      achievements: [],
      achievementDescription: '',
      achievementLevel: '',
      performance: '',
      goalStyle: '',
      educationLevel: 'UG (undergraduate)',
    };
    return initialAnswers ? { ...defaults, ...initialAnswers } : defaults;
  });

  const [validationError, setValidationError] = useState('');

  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Handle option selection
  const handleOptionToggle = (option) => {
    setValidationError('');
    const qId = currentQ.id;

    if (currentQ.type === 'achievements') {
      const currentSelected = Array.isArray(formAnswers.achievements) ? formAnswers.achievements : [];
      if (option === 'No recent achievements') {
        // Mutual exclusivity: selecting "No recent achievements" clears all other selections
        if (currentSelected.includes('No recent achievements')) {
          setFormAnswers((prev) => ({ ...prev, achievements: [] }));
        } else {
          setFormAnswers((prev) => ({
            ...prev,
            achievements: ['No recent achievements'],
            achievementDescription: '',
            achievementLevel: '',
          }));
        }
      } else {
        // Remove "No recent achievements" when selecting any achievement category
        const withoutNone = currentSelected.filter((item) => item !== 'No recent achievements');
        const isAlreadySelected = withoutNone.includes(option);
        if (isAlreadySelected) {
          setFormAnswers((prev) => ({
            ...prev,
            achievements: withoutNone.filter((item) => item !== option),
          }));
        } else {
          setFormAnswers((prev) => ({
            ...prev,
            achievements: [...withoutNone, option],
          }));
        }
      }
    } else if (currentQ.type === 'multi') {
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

  const handleAchievementDescriptionChange = (e) => {
    const val = e.target.value;
    setFormAnswers((prev) => ({ ...prev, achievementDescription: val }));
  };

  const handleAchievementLevelToggle = (lvl) => {
    setFormAnswers((prev) => ({
      ...prev,
      achievementLevel: prev.achievementLevel === lvl ? '' : lvl,
    }));
  };

  // Validate current question before proceeding
  const handleNext = () => {
    const qId = currentQ.id;

    // Optional questions (like achievements) can be skipped without validation error
    if (currentQ.optional) {
      setValidationError('');
      if (isLastQuestion) {
        onComplete(formAnswers);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
      return;
    }

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
    if (currentQ.type === 'achievements') {
      const achievements = formAnswers.achievements || [];
      return achievements.includes(option);
    }
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

      {/* Question Details with smooth step transition */}
      <div key={currentQ.id} className="q-content question-fade-enter">
        <h2 className="q-title">{currentQ.title}</h2>
        <p className="q-subtitle">{currentQ.subtitle}</p>

        {/* Options Selection Grid */}
        <div
          className="q-options-grid"
          role={currentQ.type === 'single' ? 'radiogroup' : 'group'}
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
                role={currentQ.type === 'single' ? 'radio' : 'checkbox'}
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

        {/* Optional Achievement Description & Level Selector */}
        {currentQ.type === 'achievements' && !formAnswers.achievements.includes('No recent achievements') && (
          <div className="q-achievements-extra">
            <div className="q-extra-field">
              <label htmlFor="achievement-desc-input" className="q-extra-label">
                Briefly describe your achievement <span className="optional-text">(optional)</span>
              </label>
              <input
                id="achievement-desc-input"
                type="text"
                className="q-text-input"
                placeholder="e.g. Won 2nd place in inter-school science exhibition, built an IoT robot..."
                maxLength={200}
                value={formAnswers.achievementDescription || ''}
                onChange={handleAchievementDescriptionChange}
              />
              <span className="q-char-hint">
                {(formAnswers.achievementDescription || '').length}/200 characters
              </span>
            </div>

            <div className="q-extra-field">
              <label className="q-extra-label">
                Level of achievement <span className="optional-text">(optional)</span>
              </label>
              <div className="q-levels-grid" role="group" aria-label="Level of achievement">
                {currentQ.levelOptions.map((lvl) => {
                  const isLvlSelected = formAnswers.achievementLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      className={`q-level-btn ${isLvlSelected ? 'selected' : ''}`}
                      onClick={() => handleAchievementLevelToggle(lvl)}
                      aria-pressed={isLvlSelected}
                    >
                      <span className="q-check-box" aria-hidden="true">
                        {isLvlSelected ? '✓' : ''}
                      </span>
                      <span>{lvl}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

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
