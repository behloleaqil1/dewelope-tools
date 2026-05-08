'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { calculateDateDifference, DateDifference } from '@/lib/date-time-tools';

/**
 * DateDifferenceCalculator - Calculates the difference between two dates,
 * broken down into years, months, days, hours, minutes, and seconds.
 * Requirements: 8.1, 8.5
 */
export default function DateDifferenceCalculator({ toolId, toolName }: ToolEngineProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [result, setResult] = useState<DateDifference | null>(null);
  const [error, setError] = useState<string | undefined>();

  const handleCalculate = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      setResult(null);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) {
      setError('Invalid start date');
      setResult(null);
      return;
    }

    if (isNaN(end.getTime())) {
      setError('Invalid end date');
      setResult(null);
      return;
    }

    try {
      const diff = calculateDateDifference(start, end);
      setResult(diff);
      setError(undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation failed');
      setResult(null);
    }
  };

  const formatResult = (diff: DateDifference): string => {
    const parts: string[] = [];
    if (diff.years > 0) parts.push(`${diff.years} year${diff.years !== 1 ? 's' : ''}`);
    if (diff.months > 0) parts.push(`${diff.months} month${diff.months !== 1 ? 's' : ''}`);
    if (diff.days > 0) parts.push(`${diff.days} day${diff.days !== 1 ? 's' : ''}`);
    if (diff.hours > 0) parts.push(`${diff.hours} hour${diff.hours !== 1 ? 's' : ''}`);
    if (diff.minutes > 0) parts.push(`${diff.minutes} minute${diff.minutes !== 1 ? 's' : ''}`);
    if (diff.seconds > 0) parts.push(`${diff.seconds} second${diff.seconds !== 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(', ') : '0 seconds';
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputArea>
            <label htmlFor={`${toolId}-start-date`} className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id={`${toolId}-start-date`}
              type="datetime-local"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (error) setError(undefined);
              }}
              aria-label={`Start date for ${toolName}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            />
          </InputArea>

          <InputArea>
            <label htmlFor={`${toolId}-end-date`} className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id={`${toolId}-end-date`}
              type="datetime-local"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                if (error) setError(undefined);
              }}
              aria-label={`End date for ${toolName}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            />
          </InputArea>
        </div>

        <InputArea error={error}>
          <button
            onClick={handleCalculate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
          >
            Calculate Difference
          </button>
        </InputArea>
      </div>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-4">
            <div className="text-lg font-semibold text-gray-800">
              {formatResult(result)}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.years}</div>
                <div className="text-xs text-gray-500 uppercase">Years</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.months}</div>
                <div className="text-xs text-gray-500 uppercase">Months</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.days}</div>
                <div className="text-xs text-gray-500 uppercase">Days</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.hours}</div>
                <div className="text-xs text-gray-500 uppercase">Hours</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.minutes}</div>
                <div className="text-xs text-gray-500 uppercase">Minutes</div>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.seconds}</div>
                <div className="text-xs text-gray-500 uppercase">Seconds</div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Total: {result.totalSeconds.toLocaleString()} seconds
            </div>

            <CopyToClipboard text={formatResult(result)} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
