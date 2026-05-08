'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { convertTimezone } from '@/lib/date-time-tools';

/**
 * Common IANA timezone identifiers for the dropdown selections.
 */
const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'America/Toronto',
  'America/Vancouver',
  'America/Mexico_City',
  'America/Sao_Paulo',
  'America/Argentina/Buenos_Aires',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Madrid',
  'Europe/Rome',
  'Europe/Amsterdam',
  'Europe/Moscow',
  'Europe/Istanbul',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Hong_Kong',
  'Australia/Sydney',
  'Australia/Melbourne',
  'Pacific/Auckland',
  'Pacific/Honolulu',
];

/**
 * TimezoneConverter - Converts a time value from one timezone to another.
 * Provides source/target timezone dropdowns, a datetime input, and displays the converted output.
 * Requirements: 8.1, 8.2
 */
export default function TimezoneConverter({ toolId, toolName }: ToolEngineProps) {
  const [timeInput, setTimeInput] = useState('');
  const [sourceTimezone, setSourceTimezone] = useState('UTC');
  const [targetTimezone, setTargetTimezone] = useState('America/New_York');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | undefined>();

  const handleConvert = () => {
    if (!timeInput.trim()) {
      setError('Please enter a time value');
      setResult('');
      return;
    }

    // Validate format: YYYY-MM-DD HH:mm:ss
    const match = timeInput.trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
    if (!match) {
      setError('Invalid format. Expected "YYYY-MM-DD HH:mm:ss"');
      setResult('');
      return;
    }

    try {
      const converted = convertTimezone(timeInput.trim(), sourceTimezone, targetTimezone);
      setResult(converted);
      setError(undefined);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setResult('');
    }
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-time-input`} className="block text-sm font-medium text-gray-700 mb-1">
            Date and Time
          </label>
          <input
            id={`${toolId}-time-input`}
            type="text"
            value={timeInput}
            onChange={(e) => {
              setTimeInput(e.target.value);
              if (error) setError(undefined);
            }}
            placeholder="2024-01-15 14:30:00"
            aria-label={`Date and time input for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-source-tz`} className="block text-sm font-medium text-gray-700 mb-1">
              Source Timezone
            </label>
            <select
              id={`${toolId}-source-tz`}
              value={sourceTimezone}
              onChange={(e) => setSourceTimezone(e.target.value)}
              aria-label={`Source timezone for ${toolName}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${toolId}-target-tz`} className="block text-sm font-medium text-gray-700 mb-1">
              Target Timezone
            </label>
            <select
              id={`${toolId}-target-tz`}
              value={targetTimezone}
              onChange={(e) => setTargetTimezone(e.target.value)}
              aria-label={`Target timezone for ${toolName}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleConvert}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
        >
          Convert
        </button>
      </div>

      <OutputArea hasContent={!!result}>
        {result && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Source:</span> {sourceTimezone.replace(/_/g, ' ')}
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {result}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Target:</span> {targetTimezone.replace(/_/g, ' ')}
            </div>
            <CopyToClipboard text={result} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
