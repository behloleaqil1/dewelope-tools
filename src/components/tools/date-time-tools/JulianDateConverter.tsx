'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * JulianDateConverter - Converts between Julian Day Number and Gregorian calendar dates.
 */
export default function JulianDateConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'toJulian' | 'toGregorian'>('toJulian');
  const [dateInput, setDateInput] = useState('');
  const [julianInput, setJulianInput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ julian?: number; gregorian?: string; dayOfWeek?: string } | null>(null);

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  function gregorianToJulian(year: number, month: number, day: number): number {
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  }

  function julianToGregorian(jd: number): { year: number; month: number; day: number } {
    const a = jd + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor(146097 * b / 4);
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor(1461 * d / 4);
    const m = Math.floor((5 * e + 2) / 153);
    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = 100 * b + d - 4800 + Math.floor(m / 10);
    return { year, month, day };
  }

  function convert() {
    setError(undefined);
    setResult(null);

    if (mode === 'toJulian') {
      if (!dateInput.trim()) {
        setError('Please enter a date');
        return;
      }
      const parts = dateInput.split('-');
      if (parts.length !== 3) {
        setError('Please enter date in YYYY-MM-DD format');
        return;
      }
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]);
      const day = parseInt(parts[2]);
      if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
        setError('Invalid date values');
        return;
      }
      const jd = gregorianToJulian(year, month, day);
      const dow = DAYS[jd % 7];
      setResult({ julian: jd, dayOfWeek: dow });
    } else {
      const jd = parseFloat(julianInput);
      if (!julianInput.trim() || isNaN(jd) || jd < 0) {
        setError('Please enter a valid Julian Day Number');
        return;
      }
      const { year, month, day } = julianToGregorian(Math.floor(jd));
      const dow = DAYS[Math.floor(jd) % 7];
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setResult({ gregorian: dateStr, dayOfWeek: dow });
    }
  }

  const copyText = result
    ? mode === 'toJulian'
      ? `Date: ${dateInput}\nJulian Day Number: ${result.julian}\nDay of Week: ${result.dayOfWeek}`
      : `Julian Day Number: ${julianInput}\nGregorian Date: ${result.gregorian}\nDay of Week: ${result.dayOfWeek}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Conversion Mode for {toolName}
        </label>
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'toJulian'}
              onChange={() => setMode('toJulian')}
              className="text-blue-600"
            />
            Date → Julian Day
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="radio"
              name={`${toolId}-mode`}
              checked={mode === 'toGregorian'}
              onChange={() => setMode('toGregorian')}
              className="text-blue-600"
            />
            Julian Day → Date
          </label>
        </div>

        {mode === 'toJulian' ? (
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-xs text-gray-500 mb-1">Gregorian Date (YYYY-MM-DD)</label>
            <input
              id={`${toolId}-date`}
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              aria-label="Gregorian date input"
              className="input-field"
            />
          </div>
        ) : (
          <div>
            <label htmlFor={`${toolId}-julian`} className="block text-xs text-gray-500 mb-1">Julian Day Number</label>
            <input
              id={`${toolId}-julian`}
              type="text"
              inputMode="decimal"
              value={julianInput}
              onChange={(e) => setJulianInput(e.target.value)}
              placeholder="e.g. 2460000"
              aria-label="Julian Day Number input"
              className="input-field"
            />
          </div>
        )}
      </InputArea>

      <button onClick={convert} aria-label="Convert date" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.julian !== undefined && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-blue-600 font-mono">{result.julian}</div>
                  <div className="text-xs text-gray-500 mt-1">Julian Day Number</div>
                </div>
              )}
              {result.gregorian && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl font-bold text-blue-600 font-mono">{result.gregorian}</div>
                  <div className="text-xs text-gray-500 mt-1">Gregorian Date</div>
                </div>
              )}
              {result.dayOfWeek && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <div className="text-xl font-bold text-green-600">{result.dayOfWeek}</div>
                  <div className="text-xs text-gray-500 mt-1">Day of Week</div>
                </div>
              )}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
