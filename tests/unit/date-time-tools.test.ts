import { describe, it, expect } from 'vitest';
import {
  convertTimezone,
  timestampToDatetime,
  datetimeToTimestamp,
  calculateDateDifference,
  calculateCountdown,
  formatElapsedTime,
} from '@/lib/date-time-tools';

describe('timestampToDatetime', () => {
  it('converts Unix epoch (0) to 1970-01-01 00:00:00', () => {
    expect(timestampToDatetime(0)).toBe('1970-01-01 00:00:00');
  });

  it('converts a known timestamp correctly', () => {
    // 2023-01-15 12:30:45 UTC = 1673785845
    expect(timestampToDatetime(1673785845)).toBe('2023-01-15 12:30:45');
  });

  it('converts timestamp 1000000000 correctly', () => {
    // 2001-09-09 01:46:40 UTC
    expect(timestampToDatetime(1000000000)).toBe('2001-09-09 01:46:40');
  });

  it('handles end of day correctly', () => {
    // 2020-12-31 23:59:59 UTC = 1609459199
    expect(timestampToDatetime(1609459199)).toBe('2020-12-31 23:59:59');
  });
});

describe('datetimeToTimestamp', () => {
  it('converts 1970-01-01 00:00:00 to 0', () => {
    expect(datetimeToTimestamp('1970-01-01 00:00:00')).toBe(0);
  });

  it('converts a known datetime correctly', () => {
    expect(datetimeToTimestamp('2023-01-15 12:30:45')).toBe(1673785845);
  });

  it('converts 2001-09-09 01:46:40 to 1000000000', () => {
    expect(datetimeToTimestamp('2001-09-09 01:46:40')).toBe(1000000000);
  });

  it('throws on invalid format', () => {
    expect(() => datetimeToTimestamp('not a date')).toThrow();
    expect(() => datetimeToTimestamp('2023/01/15 12:30:45')).toThrow();
  });

  it('round-trips with timestampToDatetime', () => {
    const timestamp = 1700000000;
    const datetime = timestampToDatetime(timestamp);
    expect(datetimeToTimestamp(datetime)).toBe(timestamp);
  });
});

describe('convertTimezone', () => {
  it('converts time from UTC to America/New_York', () => {
    // UTC to EST is -5 hours (standard time)
    const result = convertTimezone('2023-01-15 17:00:00', 'UTC', 'America/New_York');
    expect(result).toBe('2023-01-15 12:00:00');
  });

  it('converts time from America/New_York to UTC', () => {
    const result = convertTimezone('2023-01-15 12:00:00', 'America/New_York', 'UTC');
    expect(result).toBe('2023-01-15 17:00:00');
  });

  it('returns same time when source and target are the same', () => {
    const result = convertTimezone('2023-06-15 10:30:00', 'Europe/London', 'Europe/London');
    expect(result).toBe('2023-06-15 10:30:00');
  });

  it('throws on invalid time format', () => {
    expect(() => convertTimezone('invalid', 'UTC', 'UTC')).toThrow();
  });
});

describe('calculateDateDifference', () => {
  it('calculates difference of exactly 1 year', () => {
    const start = new Date(2022, 0, 1, 0, 0, 0); // Jan 1, 2022
    const end = new Date(2023, 0, 1, 0, 0, 0);   // Jan 1, 2023
    const result = calculateDateDifference(start, end);
    expect(result.years).toBe(1);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  it('calculates difference of same date as zero', () => {
    const date = new Date(2023, 5, 15, 10, 30, 0);
    const result = calculateDateDifference(date, date);
    expect(result.totalSeconds).toBe(0);
    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it('handles swapped dates (end before start)', () => {
    const start = new Date(2023, 5, 15);
    const end = new Date(2022, 5, 15);
    const result = calculateDateDifference(start, end);
    expect(result.years).toBe(1);
    expect(result.totalSeconds).toBeGreaterThan(0);
  });

  it('calculates hours, minutes, seconds correctly', () => {
    const start = new Date(2023, 0, 1, 10, 0, 0);
    const end = new Date(2023, 0, 1, 13, 30, 45);
    const result = calculateDateDifference(start, end);
    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(3);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(45);
  });

  it('totalSeconds is consistent with the date range', () => {
    const start = new Date(2023, 0, 1, 0, 0, 0);
    const end = new Date(2023, 0, 2, 0, 0, 0); // exactly 1 day
    const result = calculateDateDifference(start, end);
    expect(result.totalSeconds).toBe(86400);
  });
});

describe('calculateCountdown', () => {
  it('returns full time when nothing has elapsed', () => {
    const result = calculateCountdown(3661000, 0); // 1h 1m 1s
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(1);
    expect(result.seconds).toBe(1);
    expect(result.isComplete).toBe(false);
  });

  it('returns zero and isComplete when elapsed exceeds target', () => {
    const result = calculateCountdown(5000, 10000);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.isComplete).toBe(true);
    expect(result.totalRemainingMs).toBe(0);
  });

  it('returns zero and isComplete when elapsed equals target', () => {
    const result = calculateCountdown(5000, 5000);
    expect(result.isComplete).toBe(true);
    expect(result.totalRemainingMs).toBe(0);
  });

  it('calculates remaining time correctly', () => {
    // 10 minutes target, 3 minutes elapsed = 7 minutes remaining
    const result = calculateCountdown(600000, 180000);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(7);
    expect(result.seconds).toBe(0);
    expect(result.isComplete).toBe(false);
  });
});

describe('formatElapsedTime', () => {
  it('formats zero milliseconds', () => {
    const result = formatElapsedTime(0);
    expect(result.hours).toBe('00');
    expect(result.minutes).toBe('00');
    expect(result.seconds).toBe('00');
    expect(result.milliseconds).toBe('000');
  });

  it('formats 1 hour, 2 minutes, 3 seconds, 456ms', () => {
    const ms = 1 * 3600000 + 2 * 60000 + 3 * 1000 + 456;
    const result = formatElapsedTime(ms);
    expect(result.hours).toBe('01');
    expect(result.minutes).toBe('02');
    expect(result.seconds).toBe('03');
    expect(result.milliseconds).toBe('456');
  });

  it('handles large values (100+ hours)', () => {
    const ms = 100 * 3600000 + 59 * 60000 + 59 * 1000 + 999;
    const result = formatElapsedTime(ms);
    expect(result.hours).toBe('100');
    expect(result.minutes).toBe('59');
    expect(result.seconds).toBe('59');
    expect(result.milliseconds).toBe('999');
  });

  it('handles negative input as zero', () => {
    const result = formatElapsedTime(-5000);
    expect(result.hours).toBe('00');
    expect(result.minutes).toBe('00');
    expect(result.seconds).toBe('00');
    expect(result.milliseconds).toBe('000');
  });

  it('pads single-digit values correctly', () => {
    const result = formatElapsedTime(5005); // 5 seconds, 5 ms
    expect(result.hours).toBe('00');
    expect(result.minutes).toBe('00');
    expect(result.seconds).toBe('05');
    expect(result.milliseconds).toBe('005');
  });
});
