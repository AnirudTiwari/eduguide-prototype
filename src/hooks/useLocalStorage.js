import { useState, useEffect } from 'react';

/**
 * Custom hook to synchronize React state with browser localStorage.
 * Easy for beginners: works just like useState, but remembers data across page refreshes.
 *
 * @param {string} key - The localStorage key name
 * @param {any} initialValue - The fallback initial value if nothing is saved yet
 */
export function useLocalStorage(key, initialValue) {
  // Read existing value from localStorage on first render
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Whenever storedValue changes, update localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
