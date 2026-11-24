// backend/services/waterCalculationService.js

// Crop coefficient table
export const cropKcValues = {
  wheat: { initial: 0.7, mid: 1.15, late: 0.25 },
  rice: { initial: 1.05, mid: 1.2, late: 0.9 },
  maize: { initial: 0.6, mid: 1.2, late: 0.35 },
  vegetables: { initial: 0.8, mid: 1.05, late: 0.9 }
};

const isFiniteNonNegative = (value) =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

export function getKc(crop, stage = "mid") {
  if (typeof crop !== 'string' || !Object.hasOwn(cropKcValues, crop)) {
    throw new Error("Crop not supported");
  }

  const stages = cropKcValues[crop];
  if (typeof stage !== 'string' || !Object.hasOwn(stages, stage)) {
    return stages.mid;
  }
  return stages[stage];
}

// ETc = ET0 × Kc
export function calculateETc(et0_mm, crop, stage) {
  if (!isFiniteNonNegative(et0_mm)) {
    throw new RangeError('Reference evapotranspiration must be a finite non-negative number.');
  }

  const kc = getKc(crop, stage);
  const etc_mm = et0_mm * kc;
  if (!Number.isFinite(etc_mm)) {
    throw new RangeError('Crop evapotranspiration is outside the supported range.');
  }
  return { kc, etc_mm };
}

// Convert mm → litres
export function convertMmToLitres(etc_mm, area_ha) {
  if (!isFiniteNonNegative(etc_mm)) {
    throw new RangeError('Crop evapotranspiration must be a finite non-negative number.');
  }
  if (!isFiniteNonNegative(area_ha)) {
    throw new RangeError('Area must be a finite non-negative number.');
  }

  const litres = etc_mm * area_ha * 10000;
  if (!Number.isFinite(litres)) {
    throw new RangeError('Water volume is outside the supported range.');
  }
  return Math.round(litres);
}
