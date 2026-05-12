'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IndianCalendarConverter - Convert between Gregorian and Indian National (Saka) calendar.
 * The Saka calendar starts on March 22 (or 21 in leap years) and has year 0 at 78 AD.
 */
export default function IndianCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [direction, setDirection] = useState<'toSaka' | 'toGregorian'>('toSaka');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('');
  const [result, setResult] = useState<{ year: number; month: string; day: number; monthNum: number } | null>(null);
  const [error, setError] = useState('');

  const sakaMonths = [
    { name: 'Chaitra', days: 30, leapDays: 31 },
    { name: 'Vaishakha', days: 31, leapDays: 31 },
    { name: 'Jyeshtha', days: 31, leapDays: 31 },
    { name: 'Ashadha', days: 31, leapDays: 31 },
    { name: 'Shravana', days: 31, leapDays: 31 },
    { name: 'Bhadrapada', days: 31, leapDays: 31 },
    { name: 'Ashvina', days: 30, leapDays: 30 },
    { name: 'Kartika', days: 30, leapDays: 30 },
    { name: 'Agrahayana', days: 30, leapDays: 30 },
    { name: 'Pausha', days: 30, leapDays: 30 },
    { name: 'Magha', days: 30, leapDays: 30 },
    { name: 'Phalguna', days: 30, leapDays: 30 },
  ];

  const gregorianMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const isLeapYear = (y: number): boolean => {
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  };

  const gregorianToSaka = (gYear: number, gMonth: number, gDay: number) => {
    const leap = isLeapYear(gYear);

    // Convert to day of year
    const daysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let dayOfYear = gDay;
    for (let i = 0; i < gMonth - 1; i++) {
      dayOfYear += daysInMonth[i];
    }

    // Chaitra 1 starts on March 22 (or 21 in leap year)
    const chaitraStartDOY = (leap ? 31 + 29 + 21 : 31 + 28 + 22);

    let sakaYear: number;
    let sakaDayOfYear: number;

    if (dayOfYear >= chaitraStartDOY) {
      sakaYear = gYear - 78;
      sakaDayOfYear = dayOfYear - chaitraStartDOY + 1;
    } else {
      sakaYear = gYear - 79;
      const prevLeap = isLeapYear(gYear - 1);
      const prevYearDays = prevLeap ? 366 : 365;
      const prevChaitraStart = prevLeap ? 31 + 29 + 21 : 31 + 28 + 22;
      sakaDayOfYear = (prevYearDays - prevChaitraStart + 1) + dayOfYear;
    }

    // Find Saka month and day
    let remaining = sakaDayOfYear;
    const sakaLeap = isLeapYear(gYear);
    for (let i = 0; i < 12; i++) {
      const mDays = i === 0 ? (sakaLeap ? sakaMonths[i].leapDays : sakaMonths[i].days) : sakaMonths[i].days;
      if (remaining <= mDays) {
        return { year: sakaYear, month: sakaMonths[i].name, day: remaining, monthNum: i + 1 };
      }
      remaining -= mDays;
    }

    return { year: sakaYear, month: sakaMonths[11].name, day: remaining, monthNum: 12 };
  };

  const sakaToGregorian = (sYear: number, sMonth: number, sDay: number) => {
    const gYear = sYear + 78;
    const leap = isLeapYear(gYear);
    const chaitraStart = leap ? 21 : 22; // March day

    // Calculate days from Chaitra 1
    let totalDays = sDay - 1;
    for (let i = 0; i < sMonth - 1; i++) {
      totalDays += i === 0 ? (leap ? sakaMonths[i].leapDays : sakaMonths[i].days) : sakaMonths[i].days;
    }

    // Add to March chaitraStart
    const daysInMonth = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let gMonth = 2; // March is index 2
    let gDay = chaitraStart + totalDays;

    while (gMonth < 12 && gDay > daysInMonth[gMonth]) {
      gDay -= daysInMonth[gMonth];
      gMonth++;
    }

    if (gDay > daysInMonth[gMonth]) {
      // Overflow to next year
      gDay -= daysInMonth[gMonth];
      gMonth = 0;
    }

    return { year: gYear, month: gregorianMonths[gMonth], day: gDay, monthNum: gMonth + 1 };
  };

  const convert = () => {
    setError('');
    setResult(null);

    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || y < 1) {
      setError('Enter a valid year');
      return;
    }
    if (isNaN(d) || d < 1 || d > 31) {
      setError('Enter a valid day (1-31)');
      return;
    }

    if (direction === 'toSaka') {
      if (m < 1 || m > 12) {
        setError('Enter a valid month (1-12)');
        return;
      }
      const res = gregorianToSaka(y, m, d);
      setResult(res);
    } else {
      if (m < 1 || m > 12) {
        setError('Enter a valid Saka month (1-12)');
        return;
      }
      const res = sakaToGregorian(y, m, d);
      setResult(res);
    }
  };

  const copyText = result
    ? `${result.month} ${result.day}, ${result.year}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="flex gap-4 mb-3">
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={direction === 'toSaka'} onChange={() => setDirection('toSaka')} className="mr-1" />
            Gregorian → Saka
          </label>
          <label className="inline-flex items-center text-sm">
            <input type="radio" checked={direction === 'toGregorian'} onChange={() => setDirection('toGregorian')} className="mr-1" />
            Saka → Gregorian
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              id={`${toolId}-year`}
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder={direction === 'toSaka' ? '2024' : '1946'}
              className="input-field"
              aria-label={`Year for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              id={`${toolId}-month`}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="input-field"
              aria-label={`Month for ${toolName}`}
            >
              {direction === 'toSaka'
                ? gregorianMonths.map((m, i) => <option key={i} value={i + 1}>{m}</option>)
                : sakaMonths.map((m, i) => <option key={i} value={i + 1}>{m.name}</option>)
              }
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <input
              id={`${toolId}-day`}
              type="number"
              min="1"
              max="31"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="15"
              className="input-field"
              aria-label={`Day for ${toolName}`}
            />
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert date" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {result.month} {result.day}, {result.year}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {direction === 'toSaka' ? 'Indian National (Saka) Calendar' : 'Gregorian Calendar'}
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
