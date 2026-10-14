/**
 * Date calculation and formatting helpers for EduGuide demo.
 * Uses day offsets from today so the prototype always shows current dates.
 */

/**
 * Returns a real Date object calculated from today +/- offset in days.
 * @param {number} offsetDays
 * @returns {Date}
 */
export function getDateFromOffset(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + Number(offsetDays));
  return date;
}

/**
 * Formats a Date object into a readable string (e.g., "Oct 16, 2026").
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns human-friendly relative label like "Today", "Tomorrow", "In 5 days", or "Overdue by 2 days".
 * @param {number} offsetDays
 * @returns {string}
 */
export function getRelativeDeadlineLabel(offsetDays) {
  const days = Math.round(Number(offsetDays));

  if (days < -1) {
    return `Overdue by ${Math.abs(days)} days`;
  }
  if (days === -1) {
    return 'Overdue by 1 day';
  }
  if (days === 0) {
    return 'Today';
  }
  if (days === 1) {
    return 'Tomorrow';
  }
  return `In ${days} days`;
}

/**
 * Categorizes deadline urgency for styling:
 * - 'urgent' (<= 3 days or overdue): warm alert color
 * - 'warning' (<= 7 days): warm amber color
 * - 'normal' (> 7 days): standard neutral/info color
 * @param {number} offsetDays
 * @returns {'urgent' | 'warning' | 'normal'}
 */
export function getUrgencyLevel(offsetDays) {
  const days = Number(offsetDays);
  if (days <= 3) return 'urgent';
  if (days <= 7) return 'warning';
  return 'normal';
}
