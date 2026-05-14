'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * OrdinalDayCalculator - Calculate the day of the year (1-366)
 */
export default function OrdinalDayCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [result, setResult] = useState<{ ordinalDay: number; totalDays: number; remaining: number; isLeapYear: boolean; percentage: number } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    if (!dateInput) { setError('Please select a date'); return; }
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) { setError('Invalid date'); return; }

    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    const ordinalDay = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const totalDays = isLeapYear ? 366 : 365;
    const remaining = totalDays - ordinalDay;
    const percentage = (ordinalDay / totalDays) * 100;

    setResult({ ordinalDay, totalDays, remaining, isLeapYear, percentage });
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
            <div className="text-lg font-semibold text-gray-800">Day {result.ordinalDay} of {result.totalDays}</div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${result.percentage}%` }}></div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center"><div className="font-bold text-blue-600">{result.remaining}</div><div className="text-xs text-gray-500">Days Remaining</div></div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center"><div className="font-bold text-green-600">{result.percentage.toFixed(1)}%</div><div className="text-xs text-gray-500">Year Progress</div></div>
            </div>
            <div className="text-sm text-gray-600">{result.isLeapYear ? 'Leap year (366 days)' : 'Common year (365 days)'}</div>
            <CopyToClipboard text={`Day ${result.ordinalDay} of ${result.totalDays}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
