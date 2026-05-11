'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BusinessDaysCalculator - Calculate business days between two dates (excluding weekends).
 */
export default function BusinessDaysCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    businessDays: number;
    totalDays: number;
    weekends: number;
    weeks: number;
  } | null>(null);

  const calculate = () => {
    setError('');
    setResult(null);

    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError('Invalid date(s)');
      return;
    }

    if (end < start) {
      setError('End date must be after start date');
      return;
    }

    let businessDays = 0;
    let weekendDays = 0;
    const current = new Date(start);

    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        businessDays++;
      } else {
        weekendDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    const totalDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const weeks = Math.floor(totalDays / 7);

    setResult({ businessDays, totalDays, weekends: weekendDays, weeks });
  };

  const copyText = result
    ? `Business Days: ${result.businessDays}\nTotal Days: ${result.totalDays}\nWeekend Days: ${result.weekends}\nFull Weeks: ${result.weeks}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input id={`${toolId}-start`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label={`Start date for ${toolName}`} className="input-field" />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-end`} className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input id={`${toolId}-end`} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} aria-label={`End date for ${toolName}`} className="input-field" />
        </InputArea>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button onClick={calculate} aria-label="Calculate business days" className="btn-primary">
        Calculate Business Days
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.businessDays}</div>
                <div className="text-xs text-gray-500 mt-1">Business Days</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-700">{result.totalDays}</div>
                <div className="text-xs text-gray-500 mt-1">Total Days</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-orange-600">{result.weekends}</div>
                <div className="text-xs text-gray-500 mt-1">Weekend Days</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{result.weeks}</div>
                <div className="text-xs text-gray-500 mt-1">Full Weeks</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
