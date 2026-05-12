'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimeUntilCalculator - Calculates time remaining until a specific date/time.
 */
export default function TimeUntilCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('00:00');
  const [result, setResult] = useState<{ days: number; hours: number; minutes: number; seconds: number; totalHours: number; totalMinutes: number; isPast: boolean } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    if (!targetDate) {
      setError('Please select a target date');
      return;
    }

    const target = new Date(`${targetDate}T${targetTime}:00`);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    const isPast = diffMs < 0;
    const absDiff = Math.abs(diffMs);

    const totalSeconds = Math.floor(absDiff / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    setResult({ days, hours, minutes, seconds, totalHours, totalMinutes, isPast });
  };

  const copyText = result
    ? `${result.isPast ? 'Time since' : 'Time until'}: ${result.days}d ${result.hours}h ${result.minutes}m ${result.seconds}s\nTotal hours: ${result.totalHours}\nTotal minutes: ${result.totalMinutes}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Target Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          aria-label={`Target date for ${toolName}`}
          className="input-field"
        />
        <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">
          Target Time
        </label>
        <input
          id={`${toolId}-time`}
          type="time"
          value={targetTime}
          onChange={(e) => setTargetTime(e.target.value)}
          aria-label="Target time"
          className="input-field"
        />
      </InputArea>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button onClick={calculate} aria-label="Calculate time until" className="btn-primary">
        Calculate
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-center text-sm text-gray-500 mb-2">
              {result.isPast ? '⏪ Time since target' : '⏩ Time until target'}
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.days}</div>
                <div className="text-xs text-gray-500">Days</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.hours}</div>
                <div className="text-xs text-gray-500">Hours</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.minutes}</div>
                <div className="text-xs text-gray-500">Minutes</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{result.seconds}</div>
                <div className="text-xs text-gray-500">Seconds</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p>Total hours: {result.totalHours.toLocaleString()}</p>
              <p>Total minutes: {result.totalMinutes.toLocaleString()}</p>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
