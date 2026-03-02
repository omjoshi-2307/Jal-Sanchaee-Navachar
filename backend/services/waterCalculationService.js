// backend/services/waterCalculationService.js

// Crop coefficient table
export const cropKcValues = {
  wheat: { initial: 0.7, mid: 1.15, late: 0.25 },
  rice: { initial: 1.05, mid: 1.2, late: 0.9 },
  maize: { initial: 0.6, mid: 1.2, late: 0.35 },
  vegetables: { initial: 0.8, mid: 1.05, late: 0.9 }
};

export function getKc(crop, stage = "mid") {
  if (!cropKcValues[crop]) {
    throw new Error("Crop not supported");
  }
  return cropKcValues[crop][stage] || cropKcValues[crop].mid;
}

// ETc = ET0 × Kc
export function calculateETc(et0_mm, crop, stage) {
  const kc = getKc(crop, stage);
  const etc_mm = et0_mm * kc;
  return { kc, etc_mm };
}

// Convert mm → litres
export function convertMmToLitres(etc_mm, area_ha) {
  const litres = etc_mm * area_ha * 10000;
  return Math.round(litres);
}
