// backend/services/scheduleService.js

import { minutesToTimeString } from '../utils/dateUtils.js';

const PUMP_RATE_LPH = 1000; // litres per hour
const IRRIGATION_WINDOW_MINUTES = 12 * 60; // 6AM–6PM

export function generateDailySchedule(farmers) {
  let currentMinute = 0;
  const schedule = [];

  for (const farmer of farmers) {
    const requiredMinutes =
      (farmer.litres_day / PUMP_RATE_LPH) * 60;

    if (currentMinute + requiredMinutes > IRRIGATION_WINDOW_MINUTES) {
      break; // No more time available
    }

    const start = minutesToTimeString(currentMinute);
    const end = minutesToTimeString(
      currentMinute + Math.round(requiredMinutes)
    );

    schedule.push({
      farmerId: farmer.id,
      name: farmer.name,
      litres: farmer.litres_day,
      startTime: start,
      endTime: end
    });

    currentMinute += Math.round(requiredMinutes);
  }

  return schedule;
}
