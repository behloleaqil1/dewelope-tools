'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WorkWeekCalculator - Calculate work weeks between two dates (excluding weekends and holidays).
 */
export default function WorkWeekCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [holidays, setHolidays] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult('');

    if (!startDate || !endDate) {
      setError('Please enter both start and end dates.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError('Please enter valid dates.');
      return;
    }

    if (end < start) {
      setError('End date must be after start date.');
      return;
    }

    // Parse holidays
    const holidayDates = holidays
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean)
      .map((h) => new Date(h))
      .filter((d) => !isNaN(d.getTime()));

    const isHoliday = (date: Date) => {
      return holidayDates.some(
        (h) => h.getFullYear() === date.getFullYear() &&
               h.getMonth() === date.getMonth() &&
               h.getDate() === date.getDate()
      );
    };

    let totalDays = 0;
    let workDays = 0;
    let weekendDays = 0;
    let holidayCount = 0;

    const current = new Date(start);
    while (current <= end) {
      totalDays++;
      const dayOfWeek = current.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++;
      } else if (isHoliday(current)) {
        holidayCount++;
      } else {
        workDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    const workWeeks = (workDays / 5).toFixed(2);
    const fullWorkWeeks = Math.floor(workDays / 5);
    const remainingDays = workDays % 5;

    const output = [
      `Date Range: ${start.toLocaleDateString()} to ${end.toLocaleDateString()}`,
      ``,
      `Total Calendar Days: ${totalDays}`,
      `Weekend Days: ${weekendDays}`,
      `Holidays (excluded): ${holidayCount}`,
      `Working Days: ${workDays}`,
      ``,
      `Work Weeks: ${workWeeks} (${fullWorkWeeks} full weeks${remainingDays > 0 ? ` + ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''})`,
      ``,
      `Working Hours (8h/day): ${workDays * 8} hours`,
    ].join('\n');

    setResult(output);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id={`${toolId}-start`}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              aria-label={`Start date for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-end`} className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id={`${toolId}-end`}
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              aria-label="End date"
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-3">
          <label htmlFor={`${toolId}-holidays`} className="block text-sm font-medium text-gray-700 mb-1">
            Holidays (one per line, YYYY-MM-DD format, optional)
          </label>
          <textarea
            id={`${toolId}-holidays`}
            value={holidays}
            onChange={(e) => setHolidays(e.target.value)}
            placeholder="2024-12-25&#10;2024-01-01&#10;2024-07-04"
            aria-label="Holiday dates"
            className="input-field h-24 resize-y font-mono text-sm"
          />
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate work weeks" className="btn-primary">
        Calculate Work Weeks
      </button>

      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Work Week Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{result}</pre>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
