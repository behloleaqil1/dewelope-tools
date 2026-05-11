'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimeBetweenDates - Calculate exact time between two dates in all units.
 * Shows years, months, weeks, days, hours, minutes, and seconds.
 */
export default function TimeBetweenDates({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    years: number; months: number; weeks: number; days: number;
    hours: number; minutes: number; seconds: number;
    totalDays: number; totalHours: number; totalMinutes: number; totalSeconds: number;
    readable: string;
  } | null>(null);

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    if (!startDate) newErrors.startDate = 'Please select a start date';
    if (!endDate) newErrors.endDate = 'Please select an end date';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setResult(null);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) { setErrors({ startDate: 'Invalid start date' }); setResult(null); return; }
    if (isNaN(end.getTime())) { setErrors({ endDate: 'Invalid end date' }); setResult(null); return; }

    setErrors({});

    // Ensure start is before end
    const [earlier, later] = start <= end ? [start, end] : [end, start];

    const diffMs = later.getTime() - earlier.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);

    // Calculate years and months difference
    let years = later.getFullYear() - earlier.getFullYear();
    let months = later.getMonth() - earlier.getMonth();
    let days = later.getDate() - earlier.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Build readable string
    const parts: string[] = [];
    if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    const readable = parts.length > 0 ? parts.join(', ') : '0 days';

    setResult({
      years, months, weeks, days,
      hours: totalHours % 24,
      minutes: totalMinutes % 60,
      seconds: totalSeconds % 60,
      totalDays, totalHours, totalMinutes, totalSeconds,
      readable,
    });
  };

  const copyText = result
    ? `Time Between Dates: ${result.readable}\n\nTotal Days: ${result.totalDays.toLocaleString()}\nTotal Hours: ${result.totalHours.toLocaleString()}\nTotal Minutes: ${result.totalMinutes.toLocaleString()}\nTotal Seconds: ${result.totalSeconds.toLocaleString()}\nWeeks: ${result.weeks.toLocaleString()}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.startDate}>
          <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            id={`${toolId}-start`}
            type="datetime-local"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: '' })); }}
            aria-label={`Start date for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea error={errors.endDate}>
          <label htmlFor={`${toolId}-end`} className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            id={`${toolId}-end`}
            type="datetime-local"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: '' })); }}
            aria-label="End date"
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate time between dates" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-xl font-bold text-blue-600">{result.readable}</div>
              <div className="text-xs text-gray-500 mt-1">Difference</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.totalDays.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Days</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.weeks.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Weeks</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.totalHours.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Hours</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.totalMinutes.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Minutes</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.totalSeconds.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Seconds</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.months}</div>
                <div className="text-xs text-gray-500">Months (partial)</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
