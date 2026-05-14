'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * Iso8601WeekCalculator - Calculate ISO 8601 week number from a date
 */
export default function Iso8601WeekCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [result, setResult] = useState<{ week: number; year: number; dayOfWeek: string; isoString: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function getISOWeek(date: Date): { week: number; year: number } {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return { week, year: d.getUTCFullYear() };
  }

  function calculate() {
    setError(undefined);
    setResult(null);

    if (!dateInput) { setError('Please select a date'); return; }
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) { setError('Invalid date'); return; }

    const { week, year } = getISOWeek(date);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[date.getDay()];
    const isoString = `${year}-W${week.toString().padStart(2, '0')}-${date.getDay() || 7}`;

    setResult({ week, year, dayOfWeek, isoString });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
        <input id={`${toolId}-date`} type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} aria-label={`Date input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">ISO Week: {result.week} of {result.year}</div>
            <div className="text-md text-gray-700">Day: {result.dayOfWeek}</div>
            <div className="text-sm text-gray-600 font-mono bg-white p-3 rounded border border-gray-200">ISO format: {result.isoString}</div>
            <CopyToClipboard text={result.isoString} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
