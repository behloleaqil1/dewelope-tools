'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DayOfYearCalculator - Calculates what day number of the year a given date is (1-365/366).
 * Also shows days remaining in the year and whether it's a leap year.
 */
export default function DayOfYearCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    dayOfYear: number;
    daysRemaining: number;
    totalDays: number;
    isLeapYear: boolean;
    percentage: number;
  } | null>(null);

  const calculate = () => {
    setError('');
    if (!dateInput) {
      setError('Please select a date');
      setResult(null);
      return;
    }

    const date = new Date(dateInput + 'T00:00:00');
    if (isNaN(date.getTime())) {
      setError('Invalid date');
      setResult(null);
      return;
    }

    const year = date.getFullYear();
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    const totalDays = isLeapYear ? 366 : 365;

    const startOfYear = new Date(year, 0, 1);
    const diff = date.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
    const daysRemaining = totalDays - dayOfYear;
    const percentage = Math.round((dayOfYear / totalDays) * 1000) / 10;

    setResult({ dayOfYear, daysRemaining, totalDays, isLeapYear, percentage });
  };

  const copyText = result
    ? `Date: ${dateInput}\nDay of Year: ${result.dayOfYear} of ${result.totalDays}\nDays Remaining: ${result.daysRemaining}\nYear Progress: ${result.percentage}%\nLeap Year: ${result.isLeapYear ? 'Yes' : 'No'}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Select Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={dateInput}
          onChange={(e) => { setDateInput(e.target.value); if (error) setError(''); }}
          aria-label={`Date input for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={calculate} aria-label="Calculate day of year" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600">{result.dayOfYear}</div>
              <div className="text-sm text-gray-500 mt-1">Day of Year (out of {result.totalDays})</div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${result.percentage}%` }}
                aria-label={`Year progress: ${result.percentage}%`}
              />
            </div>
            <div className="text-center text-sm text-gray-600">{result.percentage}% of the year complete</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-bold text-gray-700">{result.daysRemaining}</div>
                <div className="text-xs text-gray-500">Days Remaining</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-bold text-gray-700">{result.totalDays}</div>
                <div className="text-xs text-gray-500">Total Days</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="font-bold text-gray-700">{result.isLeapYear ? 'Yes' : 'No'}</div>
                <div className="text-xs text-gray-500">Leap Year</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
