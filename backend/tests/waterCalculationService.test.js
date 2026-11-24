import assert from 'node:assert/strict';
import test from 'node:test';

import {
  calculateETc,
  convertMmToLitres,
  getKc,
} from '../services/waterCalculationService.js';

test('returns crop coefficients for supported crop stages', () => {
  assert.equal(getKc('wheat', 'initial'), 0.7);
  assert.equal(getKc('rice', 'late'), 0.9);
  assert.equal(getKc('maize'), 1.2);
});

test('rejects unsupported and inherited crop keys', () => {
  for (const crop of ['cotton', 'constructor', 'toString', '__proto__']) {
    assert.throws(() => getKc(crop), /Crop not supported/);
  }
});

test('falls back to the mid-stage coefficient for unknown or inherited stage keys', () => {
  for (const stage of ['unknown', 'constructor', 'toString', '__proto__']) {
    assert.equal(getKc('wheat', stage), 1.15);
  }
});

test('calculates finite crop evapotranspiration', () => {
  assert.deepEqual(calculateETc(5, 'wheat', 'initial'), { kc: 0.7, etc_mm: 3.5 });
  assert.deepEqual(calculateETc(0, 'rice'), { kc: 1.2, etc_mm: 0 });
});

test('rejects invalid reference evapotranspiration and overflow', () => {
  for (const value of [-1, NaN, Infinity, -Infinity, '5']) {
    assert.throws(() => calculateETc(value, 'wheat'), RangeError);
  }
  assert.throws(() => calculateETc(Number.MAX_VALUE, 'rice'), RangeError);
});

test('converts evapotranspiration depth and area into litres', () => {
  assert.equal(convertMmToLitres(1.5, 2), 30000);
  assert.equal(convertMmToLitres(0, 0), 0);
});

test('rejects invalid areas, depths, and water-volume overflow', () => {
  for (const value of [-1, NaN, Infinity, -Infinity, '2']) {
    assert.throws(() => convertMmToLitres(value, 1), RangeError);
    assert.throws(() => convertMmToLitres(1, value), RangeError);
  }
  assert.throws(() => convertMmToLitres(Number.MAX_VALUE, Number.MAX_VALUE), RangeError);
});
