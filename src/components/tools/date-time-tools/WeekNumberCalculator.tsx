'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WeekNumberCalculator - Find the ISO week number, day of year, and days remaining for any date.
 */
export default function WeekNumberCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const today = new Date().toISOString().split('T')[0];
  const [input, setInput] = useState(today);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();

  function getISOWeekNumber(date: Date): { week: number; year: number } {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return { week, year: d.getUTCFullYear() };
  }

  function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  function getDaysRemainingInYear(date: Date): number {
    const endOfYear = new Date(date.getFullYear(), 11, 31);
    const diff = endOfYear.getTime() - date.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  function handleCalculate() {
    if (!input) {
      setError('Please select a date');
      setOutput('');
      return;
    }

    const date = new Date(input + 'T00:00:00');
    if (isNaN(date.getTime())) {
      setError('Invalid date');
      setOutput('');
      return;
    }

    setError(undefined);
    const { week, year } = getISOWeekNumber(date);
    const dayOfYear = getDayOfYear(date);
    const daysRemaining = getDaysRemainingInYear(date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    setOutput(
      `ISO Week ${week} of ${year}\n\nDay of Year: ${dayOfYear}\nDays Remaining in Year: ${daysRemaining}\nDay: ${dayName}\nDate: ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
    );
  }

  return (
    <div className="space-y-4">
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <input
          id={`${toolId}-input`}
          type="date"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Date to find week number"
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
        />
      </InputArea>

      <button
        onClick={handleCalculate}
        aria-label="Calculate week number"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Get Week Number
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
