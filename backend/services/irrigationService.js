export class IrrigationInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'IrrigationInputError';
  }
}

const normalizeToken = (value) => String(value).trim().toLowerCase().replace(/[\s_-]+/g, '');
const AREA_TO_ACRES = {
  acre: 1,
  acres: 1,
  hectare: 2.47105,
  hectares: 2.47105,
  ha: 2.47105,
  sqft: 1 / 43560,
  squarefoot: 1 / 43560,
  squarefeet: 1 / 43560,
};

const getCalendarDateInTimeZone = (date, timeZone) => {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
    throw new IrrigationInputError('Schedule date must be valid.');
  }

  let parts;
  try {
    parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);
  } catch {
    throw new IrrigationInputError('A valid IANA time zone is required.');
  }

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const year = Number(values.year);
  const month = Number(values.month);
  const day = Number(values.day);
  const calendarDate = new Date(0);
  calendarDate.setUTCFullYear(year, month - 1, day);
  calendarDate.setUTCHours(0, 0, 0, 0);

  if (!Number.isFinite(calendarDate.getTime())) {
    throw new IrrigationInputError('Schedule date must be valid.');
  }
  return calendarDate;
};

const formatCalendarDate = (date) => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateIrrigation = (data, now = new Date(), timeZone = 'UTC') => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new IrrigationInputError('Form data must be an object.');
  }
  const startCalendarDate = getCalendarDateInTimeZone(now, timeZone);
  const areaValue = data.area;
  if ((typeof areaValue !== 'number' && typeof areaValue !== 'string') ||
      (typeof areaValue === 'string' && !areaValue.trim())) {
    throw new IrrigationInputError('Farm area must be a positive number.');
  }
  const area = Number(areaValue);
  if (!Number.isFinite(area) || area <= 0) {
    throw new IrrigationInputError('Farm area must be a positive number.');
  }

  const unit = normalizeToken(data.unit ?? 'acres');
  const conversion = Object.hasOwn(AREA_TO_ACRES, unit) ? AREA_TO_ACRES[unit] : undefined;
  if (conversion === undefined) {
    throw new IrrigationInputError('Unsupported farm-area unit. Use acres, hectares, or square feet.');
  }
  const areaInAcres = area * conversion;
  if (!Number.isFinite(areaInAcres)) {
    throw new IrrigationInputError('Farm area is outside the supported range.');
  }
  const cropName = String(data.cropName ?? 'default').trim() || 'default';
  const season = normalizeToken(data.season ?? 'rabi');
  const soilType = normalizeToken(data.soilType ?? 'loamy');
  const seasonalMultipliers = { kharif: 0.8, rabi: 1.1, zaid: 1.5 };
  if (!Object.hasOwn(seasonalMultipliers, season)) {
    throw new IrrigationInputError('Unsupported season. Use Kharif, Rabi, or Zaid.');
  }
  if (!['sandy', 'clay', 'loamy', 'silt'].includes(soilType)) {
    throw new IrrigationInputError('Unsupported soil type. Use Sandy, Clay, Loamy, or Silt.');
  }

  const baseWaterPerAcre = 5000;
  const cropKey = cropName.toLowerCase();
  const cropFactor = cropKey.includes('wheat') ? 1.2 : cropKey.includes('rice') ? 1.8 : 1.0;
  const seasonalMultiplier = seasonalMultipliers[season];
  const soilAdjustment = soilType === 'sandy' ? 1.4 : soilType === 'clay' ? 0.7 : 1.0;
  const totalWater = areaInAcres * baseWaterPerAcre * cropFactor * seasonalMultiplier * soilAdjustment;
  if (!Number.isFinite(totalWater)) {
    throw new IrrigationInputError('Calculated water requirement is outside the supported range.');
  }
  const frequency = soilType === 'sandy' ? 'Daily' : 'Twice a week';
  const schedule = Array.from({ length: 4 }, (_, index) => {
    const date = new Date(startCalendarDate);
    date.setUTCDate(date.getUTCDate() + index * 7);
    return {
      week: index + 1,
      date: formatCalendarDate(date),
      waterQuantityLiters: Math.round(totalWater / 4),
      frequency,
      instructions: `Water in the early ${index % 2 === 0 ? 'morning' : 'evening'} for best results.`,
    };
  });
  return {
    summary: {
      cropName,
      totalMonthlyWater: Math.round(totalWater),
      averageFrequency: frequency,
      metrics: {
        cropFactor,
        seasonalMultiplier,
        soilAdjustment,
        areaInAcres: areaInAcres.toFixed(2),
      },
    },
    schedule,
  };
};
