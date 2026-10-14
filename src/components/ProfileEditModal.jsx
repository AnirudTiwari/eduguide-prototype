import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

/**
 * ProfileEditModal Component
 * Accessible popup modal for updating student profile:
 * - Escape key to close, click backdrop to close, body scroll-lock
 * - Fields: name (required, max 40), class/stream, city, target (max 40), interests (up to 5)
 * - Pure inline validation, no alert popups
 * - Updates AppContext and persists to localStorage immediately
 */
export default function ProfileEditModal({ isOpen, onClose }) {
  const { student, updateStudent } = useApp();

  const [name, setName] = useState('');
  const [classStream, setClassStream] = useState('12th PCM');
  const [city, setCity] = useState('');
  const [target, setTarget] = useState('');
  const [interests, setInterests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const classStreamOptions = [
    '11th PCM',
    '11th PCB',
    '11th Commerce',
    '11th Arts',
    '12th PCM',
    '12th PCB',
    '12th Commerce',
    '12th Arts',
    'Dropper / Gap year',
    'Other',
  ];

  const availableInterests = [
    'Electronics',
    'Coding',
    'Entrepreneurship',
    'Robotics',
    'Maths',
    'Biology',
    'Design',
    'Writing',
    'Research',
    'Sports',
  ];

  // Populate form with current student details whenever opened
  useEffect(() => {
    if (isOpen && student) {
      setName(student.name || '');
      setClassStream(student.classStream || '12th PCM');
      setCity(student.city || '');
      setTarget(student.target || '');
      setInterests(Array.isArray(student.interests) ? [...student.interests] : []);
      setErrorMessage('');
    }
  }, [isOpen, student]);

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

  if (!isOpen) return null;

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests((prev) => prev.filter((i) => i !== interest));
      setErrorMessage('');
    } else {
      if (interests.length >= 5) {
        setErrorMessage('You can choose a maximum of 5 interests.');
        return;
      }
      setInterests((prev) => [...prev, interest]);
      setErrorMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (trimmedName.length > 40) {
      setErrorMessage('Name cannot exceed 40 characters.');
      return;
    }

    if (target.trim().length > 40) {
      setErrorMessage('Target course/goal cannot exceed 40 characters.');
      return;
    }

    // Call updateStudent from AppContext (persists to localStorage & triggers toast)
    updateStudent({
      name: trimmedName,
      classStream,
      city: city.trim(),
      target: target.trim(),
      interests,
    });

    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <div
        className="modal-card profile-edit-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div className="opp-badges-row">
              <span className="tag-sample">Profile Settings</span>
            </div>
            <h2 id="edit-profile-title" className="modal-title">
              Edit Student Profile
            </h2>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close edit profile modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="modal-body profile-form-body">
          {errorMessage && (
            <div className="profile-error-alert" role="alert">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="student-name-input" className="form-label">
              Student Name <span className="required-star">*</span>
            </label>
            <input
              id="student-name-input"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              maxLength={40}
              placeholder="e.g. Anirud"
              required
            />
            <span className="field-hint">{name.length}/40 characters</span>
          </div>

          {/* Class / Stream Field */}
          <div className="form-group">
            <label htmlFor="student-stream-select" className="form-label">
              Class / Stream
            </label>
            <select
              id="student-stream-select"
              className="form-select"
              value={classStream}
              onChange={(e) => setClassStream(e.target.value)}
            >
              {classStreamOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* City Field */}
          <div className="form-group">
            <label htmlFor="student-city-input" className="form-label">
              City
            </label>
            <input
              id="student-city-input"
              type="text"
              className="form-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Chandigarh"
            />
          </div>

          {/* Target Course / Goal Field */}
          <div className="form-group">
            <label htmlFor="student-target-input" className="form-label">
              Target Course / Goal
            </label>
            <input
              id="student-target-input"
              type="text"
              className="form-input"
              value={target}
              onChange={(e) => {
                setTarget(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              maxLength={40}
              placeholder="e.g. B.Tech ECE"
            />
            <span className="field-hint">{target.length}/40 characters</span>
          </div>

          {/* Interests Chips (up to 5) */}
          <div className="form-group">
            <label className="form-label">
              Interests (Select up to 5)
              <span className="field-hint" style={{ display: 'inline', marginLeft: '6px' }}>
                ({interests.length}/5 selected)
              </span>
            </label>
            <div className="chips-grid" role="group" aria-label="Interests selection">
              {availableInterests.map((item) => {
                const selected = interests.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    className={`interest-chip-btn ${selected ? 'selected' : ''}`}
                    onClick={() => toggleInterest(item)}
                    aria-pressed={selected}
                  >
                    <span>{selected ? '✓ ' : '+ '}</span>
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer" style={{ paddingLeft: 0, paddingRight: 0, paddingBottom: 0 }}>
            <div className="modal-footer-left">
              <button type="submit" className="btn btn-primary">
                Save Profile
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
