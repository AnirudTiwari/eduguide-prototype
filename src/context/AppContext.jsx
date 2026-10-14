import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  student as initialStudent,
  colleges as initialColleges,
  exams as initialExams,
  scholarships as initialScholarships,
  tasks as initialTasks,
} from '../data/mockData';

// Default seeded saved items: 2 colleges, 1 scholarship, 1 exam
export const initialSavedIds = ['col-1', 'col-2', 'sch-1', 'exam-1'];

// Create the Context object
export const AppContext = createContext(null);

/**
 * AppProvider Component
 * Manages global student state, saved bookmarks, tasks, career guidance answers,
 * toast notifications, and demo resets.
 * Synchronizes automatically with localStorage for persistence across refreshes.
 */
export function AppProvider({ children }) {
  // Student profile state
  const [student, setStudent] = useLocalStorage('eduguide_student', initialStudent);

  // Saved items (unique IDs across colleges, exams, scholarships)
  const [savedIds, setSavedIds] = useLocalStorage('eduguide_saved_ids', initialSavedIds);

  // Tasks state
  const [tasks, setTasks] = useLocalStorage('eduguide_tasks', initialTasks);

  // Career Guidance Questionnaire Answers
  const [storedCareerAnswers, setStoredCareerAnswers] = useLocalStorage(
    'eduguide_career_answers',
    null
  );

  // Guard against corrupt or invalid localStorage entries
  const careerAnswers =
    storedCareerAnswers &&
    typeof storedCareerAnswers === 'object' &&
    !Array.isArray(storedCareerAnswers)
      ? storedCareerAnswers
      : null;

  // Toast confirmation message state (auto-dismissed after 2 seconds)
  const [toastMessage, setToastMessage] = useState(null);

  /**
   * Displays a temporary notification pill for 2 seconds
   */
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 2000);
  };

  // Static/catalog data from mock dataset
  const colleges = initialColleges;
  const exams = initialExams;
  const scholarships = initialScholarships;

  /**
   * Toggles bookmark/saved status for an item ID
   */
  const toggleSaved = (id) => {
    setSavedIds((prev) => {
      const willSave = !prev.includes(id);
      showToast(willSave ? 'Saved to bookmarks' : 'Removed from bookmarks');
      return willSave ? [...prev, id] : prev.filter((itemId) => itemId !== id);
    });
  };

  /**
   * Checks whether a specific item ID is saved
   */
  const isSaved = (id) => savedIds.includes(id);

  /**
   * Adds a new task to the student checklist
   */
  const addTask = ({ title, dueOffsetDays = 3, relatedTo = 'General Goal' }) => {
    if (!title || !title.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      relatedTo: relatedTo.trim() || 'General Goal',
      dueOffsetDays: Number(dueOffsetDays) || 0,
      done: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    showToast('Added to your tasks');
  };

  /**
   * Toggles done status of a task
   */
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  /**
   * Updates student profile fields
   */
  const updateStudent = (newData) => {
    setStudent((prev) => ({ ...prev, ...newData }));
    showToast('Profile updated');
  };

  /**
   * Sets career questionnaire answers
   */
  const setCareerAnswers = (answers) => {
    setStoredCareerAnswers(answers);
    showToast('Career answers saved');
  };

  /**
   * Clears career questionnaire answers
   */
  const clearCareerAnswers = () => {
    setStoredCareerAnswers(null);
    try {
      window.localStorage.removeItem('eduguide_career_answers');
    } catch (e) {
      console.warn('Could not clear career answers:', e);
    }
    showToast('Career guidance reset');
  };

  /**
   * Resets all demo data and localStorage back to default values
   */
  const resetDemoData = () => {
    setStudent(initialStudent);
    setTasks(initialTasks);
    setSavedIds(initialSavedIds);
    setStoredCareerAnswers(null);
    try {
      window.localStorage.removeItem('eduguide_student');
      window.localStorage.removeItem('eduguide_tasks');
      window.localStorage.removeItem('eduguide_saved_ids');
      window.localStorage.removeItem('eduguide_career_answers');
    } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
    showToast('Demo data reset to default');
  };

  const value = {
    student,
    updateStudent,
    savedIds,
    toggleSaved,
    isSaved,
    tasks,
    addTask,
    toggleTask,
    colleges,
    exams,
    scholarships,
    careerAnswers,
    setCareerAnswers,
    clearCareerAnswers,
    resetDemoData,
    toastMessage,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Convenient custom hook for consuming AppContext
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
