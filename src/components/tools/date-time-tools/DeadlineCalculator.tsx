'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DeadlineCalculator - Calculate deadline from start date + duration
 */
export default function DeadlineCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');
  const [unit, setUnit] = useState<'days' | 'weeks' | 'months' | 'hours'>('days');
  const [skipWeekends, setSkipWeekends] = useState(false);
  const [result, setResult] = useState<{ deadline: string; daysFromNow: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    if (!startDate) { setError('Please select a start date'); return; }
    const dur = parseFloat(duration);
    if (isNaN(dur) || dur <= 0) { setError('Duration must be a positive number'); return; }

    const start = new Date(startDate);
    let deadline: Date;

    if (unit === 'months') {
      deadline = new Date(start);
      deadline.setMonth(deadline.getMonth() + Math.floor(dur));
    } else if (unit === 'weeks') {
      if (skipWeekends) {
        deadline = addBusinessDays(start, Math.floor(dur * 5));
      } else {
        deadline = new Date(start.getTime() + dur * 7 * 24 * 60 * 60 * 1000);
      }
    } else if (unit === 'hours') {
      deadline = new Date(start.getTime() + dur * 60 * 60 * 1000);
    } else {
      if (skipWeekends) {
        deadline = addBusinessDays(start, Math.floor(dur));
      } else {
        deadline = new Date(start.getTime() + dur * 24 * 60 * 60 * 1000);
      }
    }

    const now = new Date();
    const daysFromNow = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    setResult({ deadline: deadline.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), daysFromNow });
  }

  function addBusinessDays(start: Date, days: number): Date {
    const result = new Date(start);
    let added = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      if (result.getDay() !== 0 && result.getDay() !== 6) added++;
    }
    return result;
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input id={`${toolId}-start`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label={`Start date for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="flex gap-3 mt-3">
          <div className="flex-1"><label htmlFor={`${toolId}-dur`} className="block text-sm font-medium text-gray-700 mb-1">Duration</label><input id={`${toolId}-dur`} type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Enter duration" aria-label={`Duration for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div className="flex-1"><label htmlFor={`${toolId}-unit`} className="block text-sm font-medium text-gray-700 mb-1">Unit</label><select id={`${toolId}-unit`} value={unit} onChange={(e) => setUnit(e.target.value as typeof unit)} aria-label={`Duration unit for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="days">Days</option><option value="weeks">Weeks</option><option value="months">Months</option><option value="hours">Hours</option></select></div>
        </div>
        <label className="flex items-center gap-2 mt-3 text-sm text-gray-700">
          <input type="checkbox" checked={skipWeekends} onChange={(e) => setSkipWeekends(e.target.checked)} aria-label={`Skip weekends for ${toolName}`} className="rounded" />
          Skip weekends (business days only)
        </label>
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate Deadline</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Deadline: {result.deadline}</div>
            <div className="text-md text-gray-700">{result.daysFromNow > 0 ? `${result.daysFromNow} days from now` : result.daysFromNow === 0 ? 'Today' : `${Math.abs(result.daysFromNow)} days ago`}</div>
            <CopyToClipboard text={result.deadline} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
