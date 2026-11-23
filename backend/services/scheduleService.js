export class ScheduleInputError extends TypeError {
  constructor(message) {
    super(message);
    this.name = 'ScheduleInputError';
  }
}

const PUMP_RATE_LPH = 1000; // litres per hour
const IRRIGATION_WINDOW_MINUTES = 12 * 60; // 6AM–6PM

function validateFarmers(farmers) {
  if (!Array.isArray(farmers)) {
    throw new ScheduleInputError('Farmers must be provided as an array.');
  }

  farmers.forEach((farmer, index) => {
    if (!farmer || typeof farmer !== 'object' || Array.isArray(farmer)) {
      throw new ScheduleInputError(`Farmer at index ${index} must be an object.`);
    }
    if (typeof farmer.id !== 'string' || !farmer.id.trim()) {
      throw new ScheduleInputError(`Farmer at index ${index} must have a non-empty id.`);
    }
    if (
      typeof farmer.litres_day !== 'number' ||
      !Number.isFinite(farmer.litres_day) ||
      farmer.litres_day <= 0
    ) {
      throw new ScheduleInputError(
        `Farmer '${farmer.id}' must have a finite litres_day value greater than zero.`
      );
    }
  });
}

export function generateDailySchedule(farmers) {
  validateFarmers(farmers);

  let currentMinute = 0;
  const schedule = [];

  for (const farmer of farmers) {
    // Allocate whole minutes without under-scheduling positive water requirements.
    const requiredMinutes = Math.max(
      1,
      Math.ceil((farmer.litres_day / PUMP_RATE_LPH) * 60)
    );

    if (currentMinute + requiredMinutes > IRRIGATION_WINDOW_MINUTES) {
      break; // Preserve FIFO order when the remaining window is insufficient.
    }

    const start = minutesToTimeString(currentMinute);
    const end = minutesToTimeString(currentMinute + requiredMinutes);

    schedule.push({
      farmerId: farmer.id,
      name: farmer.name,
      litres: farmer.litres_day,
      startTime: start,
      endTime: end
    });

    currentMinute += requiredMinutes;
  }

  return schedule;
}

function minutesToTimeString(minutesFromStart) {
  const baseHour = 6; // irrigation starts at 6 AM
  const totalMinutes = baseHour * 60 + minutesFromStart;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}
