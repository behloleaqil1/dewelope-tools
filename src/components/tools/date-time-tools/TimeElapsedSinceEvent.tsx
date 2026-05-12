'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface ElapsedResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

const PRESET_EVENTS: { label: string; date: string }[] = [
  { label: 'Moon Landing (Jul 20, 1969)', date: '1969-07-20' },
  { label: 'Fall of Berlin Wall (Nov 9, 1989)', date: '1989-11-09' },
  { label: 'World Wide Web (Aug 6, 1991)', date: '1991-08-06' },
  { label: 'Y2K (Jan 1, 2000)', date: '2000-01-01' },
  { label: 'iPhone Launch (Jun 29, 2007)', date: '2007-06-29' },
  { label: 'Bitcoin Genesis Block (Jan 3, 2009)', date: '2009-01-03' },
  { label: 'COVID-19 Pandemic Declared (Mar 11, 2020)', date: '2020-03-11' },
];

/**
 * TimeElapsedSinceEvent - Calculate time elapsed since a historical event.
 * Shows years, months, days, and total time in various units.
 */
export default function TimeElapsedSinceEvent({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [eventDate, setEventDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [result, setResult] = useState<ElapsedResult | null>(null);
  const [error, setError] = useState('');

  function handlePreset(date: string, label: string) {
    setEventDate(date);
    setEventName(label);
    setResult(null);
    setError('');
  }

  function handleCalculate() {
    if (!eventDate) {
      setError('Please enter or select an event date');
      setResult(null);
      return;
    }

    const event = new Date(eventDate + 'T00:00:00');
    const now = new Date();

    if (isNaN(event.getTime())) {
      setError('Invalid date format');
      setResult(null);
      return;
    }

    if (event > now) {
      setError('Event date must be in the past');
      setResult(null);
      return;
    }

    setError('');

    // Calculate difference
    const diffMs = now.getTime() - event.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Calculate years, months, days
    let years = now.getFullYear() - event.getFullYear();
    let months = now.getMonth() - event.getMonth();
    let days = now.getDate() - event.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    setResult({ years, months, days, totalDays, totalHours, totalMinutes, totalSeconds });
  }

  const copyText = result
    ? `Time since ${eventName || eventDate}:\n${result.years} years, ${result.months} months, ${result.days} days\nTotal: ${result.totalDays.toLocaleString()} days | ${result.totalHours.toLocaleString()} hours | ${result.totalMinutes.toLocaleString()} minutes | ${result.totalSeconds.toLocaleString()} seconds`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preset Historical Events
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_EVENTS.map((evt) => (
            <button
              key={evt.date}
              onClick={() => handlePreset(evt.date, evt.label)}
              className={`text-xs px-2 py-1 rounded border ${eventDate === evt.date ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
              aria-label={`Select ${evt.label}`}
            >
              {evt.label}
            </button>
          ))}
        </div>
      </InputArea>

      <InputArea error={error}>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Event Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={eventDate}
          onChange={(e) => { setEventDate(e.target.value); setEventName(''); }}
          aria-label={`Event date for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <InputArea>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">
          Event Name (optional)
        </label>
        <input
          id={`${toolId}-name`}
          type="text"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="e.g. My Birthday"
          aria-label={`Event name for ${toolName}`}
          className="input-field"
        />
      </InputArea>

      <button onClick={handleCalculate} aria-label="Calculate time elapsed" className="btn-primary">
        Calculate Elapsed Time
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            {eventName && (
              <div className="text-sm font-medium text-gray-600 text-center">
                Time since: <span className="text-blue-600">{eventName}</span>
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-gray-800">
                {result.years} years, {result.months} months, {result.days} days
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800">{result.totalDays.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Days</div>
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
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
