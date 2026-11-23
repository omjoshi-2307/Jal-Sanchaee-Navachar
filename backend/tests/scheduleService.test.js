import assert from 'node:assert/strict';
import test from 'node:test';

import { generateDailySchedule, ScheduleInputError } from '../services/scheduleService.js';

test('returns an empty schedule for an empty farmer list', () => {
  assert.deepEqual(generateDailySchedule([]), []);
});

test('allocates whole minutes without under-scheduling small positive requests', () => {
  const schedule = generateDailySchedule([
    { id: 'farmer-1', name: 'Farmer One', litres_day: 1000 },
    { id: 'farmer-2', name: 'Farmer Two', litres_day: 500.1 },
    { id: 'farmer-3', name: 'Farmer Three', litres_day: 1 }
  ]);

  assert.deepEqual(
    schedule.map(({ startTime, endTime }) => ({ startTime, endTime })),
    [
      { startTime: '06:00', endTime: '07:00' },
      { startTime: '07:00', endTime: '07:31' },
      { startTime: '07:31', endTime: '07:32' }
    ]
  );
});

test('allows a farmer to use the complete 12-hour irrigation window', () => {
  const schedule = generateDailySchedule([
    { id: 'farmer-1', name: 'Farmer One', litres_day: 12000 }
  ]);

  assert.equal(schedule.length, 1);
  assert.equal(schedule[0].startTime, '06:00');
  assert.equal(schedule[0].endTime, '18:00');
});

test('keeps FIFO order and stops when the next farmer cannot fit', () => {
  const schedule = generateDailySchedule([
    { id: 'farmer-1', name: 'Farmer One', litres_day: 11000 },
    { id: 'farmer-2', name: 'Farmer Two', litres_day: 1000 }
  ]);

  assert.deepEqual(schedule.map(({ farmerId }) => farmerId), ['farmer-1']);
  assert.equal(schedule[0].endTime, '17:00');
});

test('rejects malformed farmer lists and invalid daily water values', () => {
  assert.throws(() => generateDailySchedule(null), ScheduleInputError);
  assert.throws(() => generateDailySchedule([null]), ScheduleInputError);
  assert.throws(() => generateDailySchedule([{ litres_day: 10 }]), ScheduleInputError);

  for (const litres_day of [0, -1, NaN, Infinity, '100']) {
    assert.throws(
      () => generateDailySchedule([{ id: 'farmer-1', litres_day }]),
      ScheduleInputError
    );
  }
});
