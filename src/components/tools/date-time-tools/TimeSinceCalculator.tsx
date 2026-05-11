'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimeSinceCalculator - Calculate how long ago an event happened.
 * Shows elapsed time in years, months, days, hours, minutes, and seconds.
 */
export default function TimeSinceCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalDays: number;
    totalHours: number;
    summary: string;
  } | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    if (!dateInput) {
      setError('Please select a date');
      return;
    }

    const dateStr = timeInput ? `${dateInput}T${timeInput}` : `${dateInput}T00:00:00`;
    const eventDate = new Date(dateStr);
    const now = new Date();

    if (isNaN(eventDate.getTime())) {
      setError('Invalid date/time');
      return;
    }

    if (eventDate > now) {
      setError('Date must be in the past');
      return;
    }

    const diffMs = now.getTime() - eventDate.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Calculate years, months, days difference
    let years = now.getFullYear() - eventDate.getFullYear();
    let months = now.getMonth() - eventDate.getMonth();
    let days = now.getDate() - eventDate.getDate();
    let hours = now.getHours() - eventDate.getHours();
    let minutes = now.getMinutes() - eventDate.getMinutes();
    let seconds = now.getSeconds() - eventDate.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) { months += 12; years--; }

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);

    const summary = parts.length > 0 ? parts.join(', ') + ' ago' : 'Just now';

    setResult({ years, months, days, hours, minutes, seconds, totalDays, totalHours, summary });
  };

  const copyText = result
    ? `Time since: ${result.summary}\nTotal days: ${result.totalDays.toLocaleString()}\nTotal hours: ${result.totalHours.toLocaleString()}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
              Event Date
            </label>
            <input
              id={`${toolId}-date`}
              type="date"
              value={dateInput}
              onChange={(e) => {
                setDateInput(e.target.value);
                if (error) setError('');
              }}
              aria-label={`Event date for ${toolName}`}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">
              Event Time (optional)
            </label>
            <input
              id={`${toolId}-time`}
              type="time"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              aria-label={`Event time for ${toolName}`}
              className="input-field"
            />
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate time since" className="btn-primary">
        Calculate Time Since
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-lg font-bold text-blue-600">{result.summary}</div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Years', value: result.years },
                { label: 'Months', value: result.months },
                { label: 'Days', value: result.days },
                { label: 'Hours', value: result.hours },
                { label: 'Minutes', value: result.minutes },
                { label: 'Seconds', value: result.seconds },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                  <div className="text-xl font-bold text-gray-800">{item.value}</div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.totalDays.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Days</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.totalHours.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Hours</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
