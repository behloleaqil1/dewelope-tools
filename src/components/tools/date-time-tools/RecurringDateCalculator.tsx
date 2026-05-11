'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RecurringDateCalculator - Calculate next occurrences of recurring events (weekly, monthly, yearly).
 */
export default function RecurringDateCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [startDate, setStartDate] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'>('weekly');
  const [count, setCount] = useState('10');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [occurrences, setOccurrences] = useState<string[]>([]);

  const calculate = () => {
    const newErrors: Record<string, string> = {};
    if (!startDate) newErrors.startDate = 'Please select a start date';
    const numCount = parseInt(count);
    if (isNaN(numCount) || numCount < 1 || numCount > 100) newErrors.count = 'Enter a number between 1 and 100';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setOccurrences([]);
      return;
    }

    setErrors({});
    const dates: string[] = [];
    const start = new Date(startDate + 'T00:00:00');

    for (let i = 0; i < numCount; i++) {
      const date = new Date(start);

      switch (frequency) {
        case 'daily':
          date.setDate(date.getDate() + i);
          break;
        case 'weekly':
          date.setDate(date.getDate() + i * 7);
          break;
        case 'biweekly':
          date.setDate(date.getDate() + i * 14);
          break;
        case 'monthly':
          date.setMonth(date.getMonth() + i);
          break;
        case 'yearly':
          date.setFullYear(date.getFullYear() + i);
          break;
      }

      dates.push(date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }));
    }

    setOccurrences(dates);
  };

  const copyText = occurrences.map((d, i) => `${i + 1}. ${d}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={errors.startDate}>
          <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            id={`${toolId}-start`}
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: '' })); }}
            aria-label={`Start date for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-freq`} className="block text-sm font-medium text-gray-700 mb-1">
            Frequency
          </label>
          <select
            id={`${toolId}-freq`}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as typeof frequency)}
            aria-label="Recurrence frequency"
            className="input-field"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly (every 2 weeks)</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </InputArea>

        <InputArea error={errors.count}>
          <label htmlFor={`${toolId}-count`} className="block text-sm font-medium text-gray-700 mb-1">
            Number of Occurrences
          </label>
          <input
            id={`${toolId}-count`}
            type="text"
            inputMode="numeric"
            value={count}
            onChange={(e) => { setCount(e.target.value); if (errors.count) setErrors((prev) => ({ ...prev, count: '' })); }}
            placeholder="e.g. 10"
            aria-label="Number of occurrences"
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={calculate} aria-label="Calculate recurring dates" className="btn-primary">
        Calculate Dates
      </button>

      <OutputArea hasContent={occurrences.length > 0}>
        {occurrences.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Next {occurrences.length} Occurrences ({frequency})
            </label>
            <div className="max-h-80 overflow-auto bg-gray-50 rounded-lg border border-gray-200">
              <ol className="divide-y divide-gray-200">
                {occurrences.map((date, i) => (
                  <li key={i} className="px-4 py-2 text-sm text-gray-700 flex items-center gap-3">
                    <span className="text-xs font-mono text-gray-400 w-6">{i + 1}.</span>
                    <span>{date}</span>
                  </li>
                ))}
              </ol>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
