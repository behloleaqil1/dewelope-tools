/**
 * Date and Time Tools Engine
 *
 * Pure functions for date/time manipulation and conversion.
 * All functions handle edge cases gracefully.
 */

// ─── Timezone Converter ──────────────────────────────────────────────────────

/**
 * Converts a time string from one timezone to another using Intl.DateTimeFormat.
 * The input time is interpreted as a date-time in the source timezone,
 * and the output is the equivalent time in the target timezone.
 *
 * @param time - Time string in "YYYY-MM-DD HH:mm:ss" format
 * @param sourceTimezone - IANA timezone identifier (e.g., "America/New_York")
 * @param targetTimezone - IANA timezone identifier (e.g., "Europe/London")
 * @returns Converted time string in "YYYY-MM-DD HH:mm:ss" format
 */
export function convertTimezone(
  time: string,
  sourceTimezone: string,
  targetTimezone: string
): string {
  // Parse the input time components
  const match = time.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error('Invalid time format. Expected "YYYY-MM-DD HH:mm:ss"');
  }

  const [, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr] = match;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const second = parseInt(secondStr, 10);

  // Create a date object interpreting the time as being in the source timezone.
  // We use a binary search approach to find the UTC time that, when formatted
  // in the source timezone, gives us the input time.
  const utcDate = findUtcForLocalTime(year, month, day, hour, minute, second, sourceTimezone);

  // Format the UTC date in the target timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: targetTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(utcDate);
  const getPart = (type: string) => parts.find(p => p.type === type)?.value ?? '00';

  const targetYear = getPart('year');
  const targetMonth = getPart('month');
  const targetDay = getPart('day');
  let targetHour = getPart('hour');
  const targetMinute = getPart('minute');
  const targetSecond = getPart('second');

  // Handle midnight being formatted as "24" in some locales
  if (targetHour === '24') {
    targetHour = '00';
  }

  return `${targetYear}-${targetMonth}-${targetDay} ${targetHour}:${targetMinute}:${targetSecond}`;
}

/**
 * Finds the UTC Date that corresponds to a given local time in a specific timezone.
 * Uses Intl.DateTimeFormat to resolve the local time to UTC.
 */
function findUtcForLocalTime(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timezone: string
): Date {
  // Start with a rough estimate: create a UTC date with the same components
  // then adjust based on the offset
  const estimate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  // Get the offset of the source timezone at this estimated time
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Iteratively adjust to find the correct UTC time
  // Usually converges in 1-2 iterations
  let current = estimate;
  for (let i = 0; i < 3; i++) {
    const parts = formatter.formatToParts(current);
    const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value ?? '0', 10);

    const localYear = getPart('year');
    const localMonth = getPart('month');
    const localDay = getPart('day');
    let localHour = getPart('hour');
    const localMinute = getPart('minute');
    const localSecond = getPart('second');

    // Handle hour "24" as "0" of next day
    if (localHour === 24) {
      localHour = 0;
    }

    // Calculate the difference between desired local time and actual local time
    const desiredMs = Date.UTC(year, month - 1, day, hour, minute, second);
    const actualLocalMs = Date.UTC(localYear, localMonth - 1, localDay, localHour, localMinute, localSecond);

    const diffMs = desiredMs - actualLocalMs;

    if (diffMs === 0) {
      break;
    }

    current = new Date(current.getTime() + diffMs);
  }

  return current;
}

// ─── Unix Timestamp Converter ────────────────────────────────────────────────

/**
 * Converts a Unix timestamp (seconds since epoch) to a date-time string in UTC.
 *
 * @param timestamp - Unix timestamp as integer seconds since 1970-01-01 00:00:00 UTC
 * @returns Date-time string in "YYYY-MM-DD HH:mm:ss" format (UTC)
 */
export function timestampToDatetime(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  const year = date.getUTCFullYear().toString().padStart(4, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Converts a date-time string in "YYYY-MM-DD HH:mm:ss" format (UTC) to a Unix timestamp.
 *
 * @param datetime - Date-time string in "YYYY-MM-DD HH:mm:ss" format
 * @returns Unix timestamp as integer seconds since 1970-01-01 00:00:00 UTC
 */
export function datetimeToTimestamp(datetime: string): number {
  const match = datetime.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error('Invalid datetime format. Expected "YYYY-MM-DD HH:mm:ss"');
  }

  const [, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr] = match;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // JS months are 0-indexed
  const day = parseInt(dayStr, 10);
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const second = parseInt(secondStr, 10);

  const date = new Date(Date.UTC(year, month, day, hour, minute, second));
  return Math.floor(date.getTime() / 1000);
}

// ─── Date Difference Calculator ──────────────────────────────────────────────

export interface DateDifference {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

/**
 * Calculates the difference between two dates, broken down into all time units.
 * The result represents the time elapsed from startDate to endDate.
 * If startDate is after endDate, the dates are swapped internally.
 *
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns Object with years, months, days, hours, minutes, seconds, and totalSeconds
 */
export function calculateDateDifference(startDate: Date, endDate: Date): DateDifference {
  // Ensure start is before end
  let start = new Date(startDate);
  let end = new Date(endDate);

  if (start > end) {
    [start, end] = [end, start];
  }

  const totalSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);

  // Calculate years
  let years = end.getFullYear() - start.getFullYear();
  let tempDate = new Date(start);
  tempDate.setFullYear(tempDate.getFullYear() + years);
  if (tempDate > end) {
    years--;
    tempDate = new Date(start);
    tempDate.setFullYear(tempDate.getFullYear() + years);
  }

  // Calculate months
  let months = end.getMonth() - tempDate.getMonth();
  if (months < 0) {
    months += 12;
  }
  const tempDate2 = new Date(tempDate);
  tempDate2.setMonth(tempDate2.getMonth() + months);
  if (tempDate2 > end) {
    months--;
    if (months < 0) {
      months += 12;
    }
    tempDate2.setMonth(tempDate.getMonth() + months);
  }

  // Recalculate tempDate after years and months
  const afterYearsMonths = new Date(start);
  afterYearsMonths.setFullYear(afterYearsMonths.getFullYear() + years);
  afterYearsMonths.setMonth(afterYearsMonths.getMonth() + months);

  // If adding months overshoots, adjust
  if (afterYearsMonths > end) {
    months--;
    if (months < 0) {
      months += 12;
      years--;
    }
    afterYearsMonths.setTime(start.getTime());
    afterYearsMonths.setFullYear(afterYearsMonths.getFullYear() + years);
    afterYearsMonths.setMonth(afterYearsMonths.getMonth() + months);
  }

  // Calculate remaining difference in milliseconds
  const remainingMs = end.getTime() - afterYearsMonths.getTime();
  const remainingSeconds = Math.floor(remainingMs / 1000);

  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
  };
}

// ─── Countdown Timer Logic ───────────────────────────────────────────────────

export interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
  totalRemainingMs: number;
}

/**
 * Calculates the remaining countdown time given a target duration and elapsed time.
 *
 * @param targetDurationMs - Total target duration in milliseconds
 * @param elapsedMs - Time already elapsed in milliseconds
 * @returns CountdownState with remaining hours, minutes, seconds, and completion status
 */
export function calculateCountdown(targetDurationMs: number, elapsedMs: number): CountdownState {
  const remainingMs = Math.max(0, targetDurationMs - elapsedMs);
  const isComplete = remainingMs <= 0;

  const totalRemainingSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalRemainingSeconds / 3600);
  const minutes = Math.floor((totalRemainingSeconds % 3600) / 60);
  const seconds = totalRemainingSeconds % 60;

  return {
    hours,
    minutes,
    seconds,
    isComplete,
    totalRemainingMs: remainingMs,
  };
}

// ─── Stopwatch / Elapsed Time ────────────────────────────────────────────────

export interface ElapsedTime {
  hours: string;
  minutes: string;
  seconds: string;
  milliseconds: string;
}

/**
 * Formats elapsed milliseconds into a display-friendly object with
 * zero-padded hours, minutes, seconds, and milliseconds.
 *
 * @param milliseconds - Total elapsed time in milliseconds
 * @returns Object with zero-padded string values for hours, minutes, seconds, and milliseconds
 */
export function formatElapsedTime(milliseconds: number): ElapsedTime {
  const totalMs = Math.max(0, Math.floor(milliseconds));

  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const ms = totalMs % 1000;

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
    milliseconds: ms.toString().padStart(3, '0'),
  };
}
