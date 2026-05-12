'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * PersianCalendarConverter - Convert between Gregorian and Persian/Solar Hijri calendar.
 * Uses the Solar Hijri (Jalali) calendar algorithm for accurate date conversion.
 */

const PERSIAN_MONTHS = [
  'Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad', 'Shahrivar',
  'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand'
];

const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const gDaysInMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + gDaysInMonth[gm - 1];
  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    const jd = 1 + (days % 31);
    return [jy, jm, jd];
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    const jd = 1 + ((days - 186) % 30);
    return [jy, jm, jd];
  }
}

function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  const jy2 = jy + 979;
  const days = (jm <= 7 ? (jm - 1) * 31 : ((jm - 1) * 30) + 6) + (jd - 1);

  let jDays = 365 * jy2 + Math.floor(jy2 / 33) * 8 + Math.floor((jy2 % 33 + 3) / 4) + 78 + days;
  let gy2 = 400 * Math.floor(jDays / 146097);
  jDays %= 146097;
  if (jDays > 36524) {
    jDays--;
    gy2 += 100 * Math.floor(jDays / 36524);
    jDays %= 36524;
    if (jDays >= 365) jDays++;
  }
  gy2 += 4 * Math.floor(jDays / 1461);
  jDays %= 1461;
  if (jDays > 365) {
    gy2 += Math.floor((jDays - 1) / 365);
    jDays = (jDays - 1) % 365;
  }
  const gy = gy2;

  const gDaysInMonth2 = [0, 31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  for (let i = 1; i <= 12; i++) {
    if (jDays < gDaysInMonth2[i]) {
      return [gy, i, jDays + 1];
    }
    jDays -= gDaysInMonth2[i];
  }
  return [gy, 12, jDays + 1];
}

function isPersianLeapYear(jy: number): boolean {
  const breaks = [1, 5, 9, 13, 17, 22, 26, 30];
  const cycle = ((jy - 1) % 2820 + 2820) % 2820;
  const yearInCycle = cycle % 33;
  return breaks.includes(yearInCycle);
}

export default function PersianCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [direction, setDirection] = useState<'g2p' | 'p2g'>('g2p');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    year: number;
    month: number;
    monthName: string;
    day: number;
    isLeap: boolean;
    formatted: string;
  } | null>(null);

  const convert = () => {
    const newErrors: Record<string, string> = {};
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || y < 1 || y > 9999) newErrors.year = 'Enter a valid year (1-9999)';
    if (isNaN(m) || m < 1 || m > 12) newErrors.month = 'Enter a valid month (1-12)';
    if (isNaN(d) || d < 1 || d > 31) newErrors.day = 'Enter a valid day (1-31)';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});

    if (direction === 'g2p') {
      const [jy, jm, jd] = gregorianToJalali(y, m, d);
      setResult({
        year: jy,
        month: jm,
        monthName: PERSIAN_MONTHS[jm - 1],
        day: jd,
        isLeap: isPersianLeapYear(jy),
        formatted: `${jd} ${PERSIAN_MONTHS[jm - 1]} ${jy}`,
      });
    } else {
      const [gy, gm, gd] = jalaliToGregorian(y, m, d);
      setResult({
        year: gy,
        month: gm,
        monthName: GREGORIAN_MONTHS[gm - 1],
        day: gd,
        isLeap: (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0,
        formatted: `${gd} ${GREGORIAN_MONTHS[gm - 1]} ${gy}`,
      });
    }
  };

  const copyText = result
    ? `${direction === 'g2p' ? 'Gregorian → Persian' : 'Persian → Gregorian'}\nInput: ${day}/${month}/${year}\nResult: ${result.formatted}\nLeap Year: ${result.isLeap ? 'Yes' : 'No'}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Direction</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={direction === 'g2p'} onChange={() => setDirection('g2p')} className="text-blue-600" />
            <span className="text-sm">Gregorian → Persian (Jalali)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={direction === 'p2g'} onChange={() => setDirection('p2g')} className="text-blue-600" />
            <span className="text-sm">Persian (Jalali) → Gregorian</span>
          </label>
        </div>
      </InputArea>

      <div className="grid grid-cols-3 gap-3">
        <InputArea error={errors.year}>
          <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            id={`${toolId}-year`}
            type="number"
            value={year}
            onChange={(e) => { setYear(e.target.value); if (errors.year) setErrors((prev) => ({ ...prev, year: '' })); }}
            placeholder={direction === 'g2p' ? '2024' : '1403'}
            aria-label={`Year for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.month}>
          <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <select
            id={`${toolId}-month`}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            aria-label={`Month for ${toolName}`}
            className="input-field"
          >
            {(direction === 'g2p' ? GREGORIAN_MONTHS : PERSIAN_MONTHS).map((name, i) => (
              <option key={i} value={i + 1}>{i + 1} - {name}</option>
            ))}
          </select>
        </InputArea>

        <InputArea error={errors.day}>
          <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
          <input
            id={`${toolId}-day`}
            type="number"
            min="1"
            max="31"
            value={day}
            onChange={(e) => { setDay(e.target.value); if (errors.day) setErrors((prev) => ({ ...prev, day: '' })); }}
            placeholder="1"
            aria-label={`Day for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={convert} aria-label="Convert date" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{result.formatted}</div>
              <div className="text-sm text-gray-500 mt-1">
                {direction === 'g2p' ? 'Persian (Solar Hijri) Date' : 'Gregorian Date'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.year}</div>
                <div className="text-xs text-gray-500">Year</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.monthName}</div>
                <div className="text-xs text-gray-500">Month ({result.month})</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.day}</div>
                <div className="text-xs text-gray-500">Day</div>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm text-gray-600">
              <span className="font-medium">Leap Year:</span> {result.isLeap ? 'Yes' : 'No'}
            </div>

            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
