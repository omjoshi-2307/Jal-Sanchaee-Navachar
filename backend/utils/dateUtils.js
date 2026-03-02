// backend/utils/dateUtils.js

export function getDayOfYear(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function minutesToTimeString(minutesFromStart) {
  const baseHour = 6; // irrigation starts at 6 AM
  const totalMinutes = baseHour * 60 + minutesFromStart;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}
