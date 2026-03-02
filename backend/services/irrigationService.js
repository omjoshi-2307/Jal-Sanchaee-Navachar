export const calculateIrrigation = (data) => {
  // Ensure area is a number
  const area = parseFloat(data.area) || 0;
  const unit = data.unit || 'acres';
  const cropName = data.cropName || 'default';
  const season = data.season || 'rabi';
  const soilType = data.soilType || 'loamy';

  // Normalize area to acres
  const areaInAcres = unit === 'sqft' ? area / 43560 : area;
  
  // Base logic
  const baseWaterPerAcre = 5000; // liters per week
  const cropFactor = cropName.toLowerCase().includes('wheat') ? 1.2 : 
                     cropName.toLowerCase().includes('rice') ? 1.8 : 1.0;
  const seasonalMultiplier = season === 'kharif' ? 0.8 : (season === 'zaid' ? 1.5 : 1.1);
  const soilAdjustment = soilType === 'sandy' ? 1.4 : (soilType === 'clay' ? 0.7 : 1.0);

  const totalWater = areaInAcres * baseWaterPerAcre * cropFactor * seasonalMultiplier * soilAdjustment;
  const frequency = soilType === 'sandy' ? 'Daily' : 'Twice a week';

  // Generate 4-week schedule
  const schedule = [];
  const now = new Date();
  for (let i = 0; i < 4; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + (i * 7));
    schedule.push({
      week: i + 1,
      date: date.toISOString().split('T')[0],
      waterQuantityLiters: Math.round(totalWater / 4),
      frequency,
      instructions: `Water in the early ${i % 2 === 0 ? 'morning' : 'evening'} for best results.`
    });
  }

  return {
    summary: {
      cropName,
      totalMonthlyWater: Math.round(totalWater),
      averageFrequency: frequency,
      metrics: {
        cropFactor,
        seasonalMultiplier,
        soilAdjustment,
        areaInAcres: areaInAcres.toFixed(2)
      }
    },
    schedule
  };
};
