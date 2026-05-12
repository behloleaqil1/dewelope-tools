'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IsoWeekCalculator - Calculates the ISO 8601 week number and ISO year for any date.
 * ISO weeks start on Monday and week 1 contains the first Thursday of the year.
 */
export default function IsoWeekCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [result, setResult] = useState<{ week: number; year: number; dayOfWeek: string; isoString: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  function getISOWeek(date: Date): { week: number; year: number } {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number (Monday=1, Sunday=7)
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return { week, year: d.getUTCFullYear() };
  }

  function calculate() {
    setError(undefined);
    setResult(null);

    if (!dateInput) {
      setError('Please select a date');
      return;
    }

    const date = new Date(dateInput + 'T00:00:00');
    if (isNaN(date.getTime())) {
      setError('Invalid date');
      return;
    }

    const { week, year } = getISOWeek(date);
    const dayNum = date.getDay();
    // Convert JS day (0=Sun) to ISO day (0=Mon...6=Sun)
    const isoDayIndex = dayNum === 0 ? 6 : dayNum - 1;
    const dayOfWeek = DAYS[isoDayIndex];
    const isoString = `${year}-W${week.toString().padStart(2, '0')}-${isoDayIndex + 1}`;

    setResult({ week, year, dayOfWeek, isoString });
  }

  function handleToday() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');
    setDateInput(`${yyyy}-${mm}-${dd}`);
  }

  const copyText = result
    ? `Date: ${dateInput}\nISO Week: ${result.week}\nISO Year: ${result.year}\nDay: ${result.dayOfWeek}\nISO Format: ${result.isoString}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <div className="flex gap-2">
          <input
            id={`${toolId}-date`}
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            aria-label={`Date input for ${toolName}`}
            className="input-field"
          />
          <button onClick={handleToday} aria-label="Set to today" className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200">
            Today
          </button>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate ISO week" className="btn-primary">
        Calculate ISO Week
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600 font-mono">W{result.week.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-500 mt-1">ISO Week Number</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600 font-mono">{result.year}</div>
                <div className="text-xs text-gray-500 mt-1">ISO Year</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-semibold text-gray-700">{result.dayOfWeek}</div>
                <div className="text-xs text-gray-500 mt-1">Day of Week</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-semibold text-gray-700 font-mono">{result.isoString}</div>
                <div className="text-xs text-gray-500 mt-1">ISO 8601 Format</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
