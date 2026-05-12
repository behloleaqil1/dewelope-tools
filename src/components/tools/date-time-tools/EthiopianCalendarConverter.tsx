'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EthiopianCalendarConverter - Converts between Gregorian and Ethiopian calendar dates.
 * The Ethiopian calendar is ~7-8 years behind Gregorian and has 13 months.
 */
export default function EthiopianCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [direction, setDirection] = useState<'toEthiopian' | 'toGregorian'>('toEthiopian');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{
    year: number;
    month: number;
    day: number;
    monthName: string;
    isLeapYear: boolean;
  } | null>(null);

  const ethiopianMonths = [
    'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
    'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
  ];

  const gregorianMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Ethiopian leap year: every 4 years without exception
  const isEthiopianLeapYear = (y: number): boolean => (y + 1) % 4 === 0;

  // Gregorian leap year
  const isGregorianLeapYear = (y: number): boolean =>
    (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

  // Julian Day Number from Gregorian date
  const gregorianToJDN = (y: number, m: number, d: number): number => {
    const a = Math.floor((14 - m) / 12);
    const yAdj = y + 4800 - a;
    const mAdj = m + 12 * a - 3;
    return d + Math.floor((153 * mAdj + 2) / 5) + 365 * yAdj +
      Math.floor(yAdj / 4) - Math.floor(yAdj / 100) + Math.floor(yAdj / 400) - 32045;
  };

  // Julian Day Number from Ethiopian date
  const ethiopianToJDN = (y: number, m: number, d: number): number => {
    return Math.floor(1723856 + 365 * (y - 1) + Math.floor(y / 4) + 30 * (m - 1) + d - 1);
  };

  // JDN to Gregorian
  const jdnToGregorian = (jdn: number): { year: number; month: number; day: number } => {
    const a = jdn + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor(146097 * b / 4);
    const d2 = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor(1461 * d2 / 4);
    const m = Math.floor((5 * e + 2) / 153);
    const day2 = e - Math.floor((153 * m + 2) / 5) + 1;
    const month2 = m + 3 - 12 * Math.floor(m / 10);
    const year2 = 100 * b + d2 - 4800 + Math.floor(m / 10);
    return { year: year2, month: month2, day: day2 };
  };

  // JDN to Ethiopian
  const jdnToEthiopian = (jdn: number): { year: number; month: number; day: number } => {
    const r = Math.floor((jdn - 1723856) % 1461);
    const n = Math.floor(r % 365) + 365 * Math.floor(Math.floor(r / 365) / 4);
    const year2 = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
    const month2 = Math.floor(n / 30) + 1;
    const day2 = (n % 30) + 1;
    return { year: year2, month: month2, day: day2 };
  };

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (!year.trim() || isNaN(y) || y < 1) {
      setError('Please enter a valid year');
      setResult(null);
      return;
    }
    if (isNaN(m) || m < 1) {
      setError('Please select a valid month');
      setResult(null);
      return;
    }
    if (!day.trim() || isNaN(d) || d < 1) {
      setError('Please enter a valid day');
      setResult(null);
      return;
    }

    if (direction === 'toEthiopian') {
      if (m > 12) { setError('Gregorian month must be 1-12'); setResult(null); return; }
      const maxDay = [31, isGregorianLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
      if (d > maxDay) { setError(`Day must be 1-${maxDay} for ${gregorianMonths[m - 1]}`); setResult(null); return; }

      const jdn = gregorianToJDN(y, m, d);
      const eth = jdnToEthiopian(jdn);
      setError(undefined);
      setResult({
        year: eth.year,
        month: eth.month,
        day: eth.day,
        monthName: ethiopianMonths[eth.month - 1] || 'Pagume',
        isLeapYear: isEthiopianLeapYear(eth.year),
      });
    } else {
      if (m > 13) { setError('Ethiopian month must be 1-13'); setResult(null); return; }
      const maxDay = m <= 12 ? 30 : (isEthiopianLeapYear(y) ? 6 : 5);
      if (d > maxDay) { setError(`Day must be 1-${maxDay} for ${ethiopianMonths[m - 1]}`); setResult(null); return; }

      const jdn = ethiopianToJDN(y, m, d);
      const greg = jdnToGregorian(jdn);
      setError(undefined);
      setResult({
        year: greg.year,
        month: greg.month,
        day: greg.day,
        monthName: gregorianMonths[greg.month - 1],
        isLeapYear: isGregorianLeapYear(greg.year),
      });
    }
  };

  const copyText = result
    ? direction === 'toEthiopian'
      ? `Ethiopian Date: ${result.monthName} ${result.day}, ${result.year} (${result.month}/${result.day}/${result.year})\nLeap Year: ${result.isLeapYear ? 'Yes' : 'No'}`
      : `Gregorian Date: ${result.monthName} ${result.day}, ${result.year} (${result.month}/${result.day}/${result.year})\nLeap Year: ${result.isLeapYear ? 'Yes' : 'No'}`
    : '';

  const monthOptions = direction === 'toEthiopian'
    ? gregorianMonths.map((name, i) => ({ value: i + 1, label: name }))
    : ethiopianMonths.map((name, i) => ({ value: i + 1, label: name }));

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Direction</label>
        <select
          value={direction}
          onChange={(e) => { setDirection(e.target.value as 'toEthiopian' | 'toGregorian'); setResult(null); }}
          aria-label="Conversion direction"
          className="input-field"
        >
          <option value="toEthiopian">Gregorian → Ethiopian</option>
          <option value="toGregorian">Ethiopian → Gregorian</option>
        </select>
      </div>

      <InputArea error={error}>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              id={`${toolId}-year`}
              type="text"
              inputMode="numeric"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder={direction === 'toEthiopian' ? 'e.g. 2024' : 'e.g. 2016'}
              aria-label={`Year for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              id={`${toolId}-month`}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              aria-label="Month"
              className="input-field"
            >
              {monthOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <input
              id={`${toolId}-day`}
              type="text"
              inputMode="numeric"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="e.g. 15"
              aria-label="Day"
              className="input-field"
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
                {result.monthName} {result.day}, {result.year}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {direction === 'toEthiopian' ? 'Ethiopian Calendar' : 'Gregorian Calendar'}
              </div>
              <div className="text-sm text-gray-500">
                ({result.month}/{result.day}/{result.year})
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-sm font-medium text-gray-700">{result.monthName}</div>
                <div className="text-xs text-gray-500">Month Name</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className={`text-sm font-medium ${result.isLeapYear ? 'text-green-600' : 'text-gray-700'}`}>
                  {result.isLeapYear ? 'Yes' : 'No'}
                </div>
                <div className="text-xs text-gray-500">Leap Year</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
