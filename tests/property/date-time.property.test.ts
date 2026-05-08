import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  convertTimezone,
  timestampToDatetime,
  datetimeToTimestamp,
  calculateDateDifference,
} from '@/lib/date-time-tools';

/**
 * Property-based tests for date/time tools.
 *
 * Validates: Requirements 8.2, 8.3, 8.5
 */

/**
 * Common IANA timezone pairs that don't have DST ambiguity issues.
 * These are fixed-offset or non-DST timezones to ensure round-trip consistency.
 */
const STABLE_TIMEZONES = [
  'UTC',
  'Asia/Kolkata',        // UTC+5:30, no DST
  'Asia/Tokyo',          // UTC+9, no DST
  'Asia/Shanghai',       // UTC+8, no DST
  'Asia/Singapore',      // UTC+8, no DST
  'Asia/Dubai',          // UTC+4, no DST
  'Africa/Nairobi',      // UTC+3, no DST
  'Pacific/Guam',        // UTC+10, no DST
  'Asia/Kathmandu',      // UTC+5:45, no DST
];

/**
 * Helper: generates a valid datetime string in "YYYY-MM-DD HH:mm:ss" format
 * using date components that avoid DST transition edge cases.
 */
function validDatetimeArb() {
  return fc.record({
    year: fc.integer({ min: 1980, max: 2050 }),
    month: fc.integer({ min: 1, max: 12 }),
    day: fc.integer({ min: 1, max: 28 }), // Use 28 to avoid month-end issues
    hour: fc.integer({ min: 0, max: 23 }),
    minute: fc.integer({ min: 0, max: 59 }),
    second: fc.integer({ min: 0, max: 59 }),
  }).map(({ year, month, day, hour, minute, second }) => {
    const y = year.toString().padStart(4, '0');
    const mo = month.toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    const h = hour.toString().padStart(2, '0');
    const mi = minute.toString().padStart(2, '0');
    const s = second.toString().padStart(2, '0');
    return `${y}-${mo}-${d} ${h}:${mi}:${s}`;
  });
}

/**
 * Helper: generates a pair of distinct stable timezones.
 */
function timezonePairArb() {
  return fc.tuple(
    fc.integer({ min: 0, max: STABLE_TIMEZONES.length - 1 }),
    fc.integer({ min: 0, max: STABLE_TIMEZONES.length - 1 })
  ).filter(([a, b]) => a !== b)
   .map(([a, b]) => ({
     source: STABLE_TIMEZONES[a],
     target: STABLE_TIMEZONES[b],
   }));
}

/**
 * Helper: generates a valid Unix timestamp (non-negative integer).
 * Range: 0 to 4102444800 (roughly 1970-01-01 to 2100-01-01)
 */
function validTimestampArb() {
  return fc.integer({ min: 0, max: 4102444800 });
}

/**
 * Helper: generates two distinct Date objects for date difference testing.
 */
function datePairArb() {
  return fc.tuple(
    fc.integer({ min: 0, max: 4102444800000 }), // ms since epoch, up to ~2100
    fc.integer({ min: 0, max: 4102444800000 })
  ).filter(([a, b]) => a !== b)
   .map(([a, b]) => ({
     date1: new Date(a),
     date2: new Date(b),
   }));
}

describe('Feature: online-tools-hub, Property 20: Timezone Conversion Round-Trip', () => {
  it('for any valid time value and any pair of stable timezones, converting source→target→source SHALL produce the original time value', () => {
    /**
     * Validates: Requirements 8.2
     */
    fc.assert(
      fc.property(
        validDatetimeArb(),
        timezonePairArb(),
        (time, { source, target }) => {
          const converted = convertTimezone(time, source, target);
          const roundTrip = convertTimezone(converted, target, source);

          expect(roundTrip).toBe(time);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('converting a time to the same timezone SHALL return the original time', () => {
    /**
     * Validates: Requirements 8.2
     */
    fc.assert(
      fc.property(
        validDatetimeArb(),
        fc.integer({ min: 0, max: STABLE_TIMEZONES.length - 1 }).map(i => STABLE_TIMEZONES[i]),
        (time, timezone) => {
          const result = convertTimezone(time, timezone, timezone);
          expect(result).toBe(time);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: online-tools-hub, Property 21: Unix Timestamp Conversion Round-Trip', () => {
  it('for any valid Unix timestamp, converting to datetime and back SHALL yield the original timestamp', () => {
    /**
     * Validates: Requirements 8.3
     */
    fc.assert(
      fc.property(
        validTimestampArb(),
        (timestamp) => {
          const datetime = timestampToDatetime(timestamp);
          const roundTrip = datetimeToTimestamp(datetime);

          expect(roundTrip).toBe(timestamp);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for any valid datetime string, parsing to timestamp and formatting back SHALL yield the original string', () => {
    /**
     * Validates: Requirements 8.3
     */
    fc.assert(
      fc.property(
        validTimestampArb(),
        (timestamp) => {
          // Generate a valid datetime from a timestamp to ensure it's a valid datetime
          const datetime = timestampToDatetime(timestamp);
          const parsedTimestamp = datetimeToTimestamp(datetime);
          const roundTrip = timestampToDatetime(parsedTimestamp);

          expect(roundTrip).toBe(datetime);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('timestampToDatetime output SHALL always match "YYYY-MM-DD HH:mm:ss" format', () => {
    /**
     * Validates: Requirements 8.3
     */
    fc.assert(
      fc.property(
        validTimestampArb(),
        (timestamp) => {
          const datetime = timestampToDatetime(timestamp);
          const pattern = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/;
          expect(datetime).toMatch(pattern);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Feature: online-tools-hub, Property 22: Date Difference Calculation Correctness', () => {
  it('for any two valid dates, totalSeconds SHALL equal the absolute difference in seconds between the two dates', () => {
    /**
     * Validates: Requirements 8.5
     */
    fc.assert(
      fc.property(
        datePairArb(),
        ({ date1, date2 }) => {
          const diff = calculateDateDifference(date1, date2);

          const expectedTotalSeconds = Math.floor(
            Math.abs(date2.getTime() - date1.getTime()) / 1000
          );

          expect(diff.totalSeconds).toBe(expectedTotalSeconds);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for any two valid dates, adding totalSeconds to the earlier date SHALL produce the later date (within 1 second)', () => {
    /**
     * Validates: Requirements 8.5
     */
    fc.assert(
      fc.property(
        datePairArb(),
        ({ date1, date2 }) => {
          const diff = calculateDateDifference(date1, date2);

          const earlier = date1 <= date2 ? date1 : date2;
          const later = date1 <= date2 ? date2 : date1;

          // Adding totalSeconds to the earlier date should produce the later date
          const reconstructed = new Date(earlier.getTime() + diff.totalSeconds * 1000);

          // Allow 1 second tolerance due to floor operations
          const diffMs = Math.abs(reconstructed.getTime() - later.getTime());
          expect(diffMs).toBeLessThanOrEqual(1000);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('date difference SHALL always have non-negative component values', () => {
    /**
     * Validates: Requirements 8.5
     */
    fc.assert(
      fc.property(
        datePairArb(),
        ({ date1, date2 }) => {
          const diff = calculateDateDifference(date1, date2);

          expect(diff.years).toBeGreaterThanOrEqual(0);
          expect(diff.months).toBeGreaterThanOrEqual(0);
          expect(diff.days).toBeGreaterThanOrEqual(0);
          expect(diff.hours).toBeGreaterThanOrEqual(0);
          expect(diff.minutes).toBeGreaterThanOrEqual(0);
          expect(diff.seconds).toBeGreaterThanOrEqual(0);
          expect(diff.totalSeconds).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('date difference of a date with itself SHALL be zero for all components', () => {
    /**
     * Validates: Requirements 8.5
     */
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 4102444800000 }).map(ms => new Date(ms)),
        (date) => {
          const diff = calculateDateDifference(date, date);

          expect(diff.years).toBe(0);
          expect(diff.months).toBe(0);
          expect(diff.days).toBe(0);
          expect(diff.hours).toBe(0);
          expect(diff.minutes).toBe(0);
          expect(diff.seconds).toBe(0);
          expect(diff.totalSeconds).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
