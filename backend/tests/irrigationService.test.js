import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateIrrigation, IrrigationInputError } from '../services/irrigationService.js';
const fixedDate = new Date('2026-11-20T12:00:00.000Z');

test('converts acres, hectares, and square feet to acres', () => {
  const cases = [
    { area: 1, unit: 'acres', expected: '1.00' },
    { area: 1, unit: 'hectares', expected: '2.47' },
    { area: 43560, unit: 'sqft', expected: '1.00' },
  ];
  for (const item of cases) {
    const result = calculateIrrigation({ area: item.area, unit: item.unit, season: 'Rabi', soilType: 'Loamy' }, fixedDate);
    assert.equal(result.summary.metrics.areaInAcres, item.expected);
  }
});
test('honors capitalized Kharif and Sandy form values', () => {
  const result = calculateIrrigation({ area: 1, unit: 'acres', cropName: 'Wheat', season: 'Kharif', soilType: 'Sandy' }, fixedDate);
  assert.equal(result.summary.metrics.seasonalMultiplier, 0.8);
  assert.equal(result.summary.metrics.soilAdjustment, 1.4);
  assert.equal(result.summary.totalMonthlyWater, 6720);
  assert.equal(result.summary.averageFrequency, 'Daily');
});
test('honors Zaid and Clay multipliers', () => {
  const result = calculateIrrigation({ area: 2, unit: 'acres', cropName: 'Rice', season: 'Zaid', soilType: 'Clay' }, fixedDate);
  assert.equal(result.summary.metrics.seasonalMultiplier, 1.5);
  assert.equal(result.summary.metrics.soilAdjustment, 0.7);
  assert.equal(result.summary.totalMonthlyWater, 18900);
});
test('returns four weekly schedule entries', () => {
  const result = calculateIrrigation({ area: 1, unit: 'acres', cropName: 'Corn', season: 'Rabi', soilType: 'Silt' }, fixedDate);
  assert.deepEqual(result.schedule.map(item => item.date), ['2026-11-20', '2026-11-27', '2026-12-04', '2026-12-11']);
  assert.equal(result.schedule.length, 4);
});
test('keeps weekly schedule dates on the local calendar near UTC midnight', () => {
  const previousTimeZone = process.env.TZ;
  process.env.TZ = 'Asia/Kolkata';
  try {
    const justAfterLocalMidnight = new Date('2026-11-23T18:45:00.000Z');
    const result = calculateIrrigation({ area: 1, unit: 'acres' }, justAfterLocalMidnight);
    assert.deepEqual(result.schedule.map(item => item.date), ['2026-11-24', '2026-12-01', '2026-12-08', '2026-12-15']);
  } finally {
    if (previousTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimeZone;
  }
});

test('rejects non-positive and non-numeric areas or unsupported selections', () => {
  const invalid = [
    { area: 0, unit: 'acres' }, { area: -2, unit: 'acres' }, { area: 'bad', unit: 'acres' },
    { area: true, unit: 'acres' }, { area: 1, unit: 'bigha' },
    { area: 1, unit: 'acres', season: 'monsoon' }, { area: 1, unit: 'acres', soilType: 'rock' },
  ];
  for (const input of invalid) assert.throws(() => calculateIrrigation(input, fixedDate), IrrigationInputError);
});

test('rejects inherited unit and season keys', () => {
  for (const unit of ['constructor', 'toString', 'valueOf']) {
    assert.throws(() => calculateIrrigation({ area: 1, unit }, fixedDate), IrrigationInputError, unit);
  }
  for (const season of ['constructor', 'toString', 'valueOf']) {
    assert.throws(() => calculateIrrigation({ area: 1, unit: 'acres', season }, fixedDate), IrrigationInputError, season);
  }
});
test('rejects overflow in converted area and water totals', () => {
  assert.throws(() => calculateIrrigation({ area: 1e308, unit: 'hectares' }, fixedDate), IrrigationInputError);
  assert.throws(() => calculateIrrigation({ area: 1e308, unit: 'acres' }, fixedDate), IrrigationInputError);
});
