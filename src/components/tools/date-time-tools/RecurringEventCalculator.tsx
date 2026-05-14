'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RecurringEventCalculator - Calculate next N occurrences of a recurring event
 */
export default function RecurringEventCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [startDate, setStartDate] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'>('weekly');
  const [count, setCount] = useState('10');
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult([]);

    if (!startDate) { setError('Please select a start date'); return; }
    const n = parseInt(count);
    if (isNaN(n) || n < 1 || n > 100) { setError('Count must be between 1 and 100'); return; }

    const dates: string[] = [];
    const start = new Date(startDate);

    for (let i = 0; i < n; i++) {
      const d = new Date(start);
      switch (frequency) {
        case 'daily': d.setDate(d.getDate() + i); break;
        case 'weekly': d.setDate(d.getDate() + i * 7); break;
        case 'biweekly': d.setDate(d.getDate() + i * 14); break;
        case 'monthly': d.setMonth(d.getMonth() + i); break;
        case 'yearly': d.setFullYear(d.getFullYear() + i); break;
      }
      dates.push(d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }));
    }

    setResult(dates);
  }

  const copyText = result.join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input id={`${toolId}-start`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label={`Start date for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Frequency</label>
        <select id={`${toolId}-freq`} value={frequency} onChange={(e) => setFrequency(e.target.value as typeof frequency)} aria-label={`Frequency for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Number of Occurrences</label>
        <input id={`${toolId}-count`} type="number" min="1" max="100" value={count} onChange={(e) => setCount(e.target.value)} aria-label={`Number of occurrences for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Generate Dates</button>

      <OutputArea hasContent={result.length > 0}>
        {result.length > 0 && (
          <div className="space-y-3">
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-800 max-h-64 overflow-y-auto">
              {result.map((date, i) => (<li key={i}>{date}</li>))}
            </ol>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
