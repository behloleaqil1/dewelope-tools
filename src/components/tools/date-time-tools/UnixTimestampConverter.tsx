'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { timestampToDatetime, datetimeToTimestamp } from '@/lib/date-time-tools';
import { validateNumeric } from '@/lib/validation';

/**
 * UnixTimestampConverter - Bidirectional conversion between Unix timestamps
 * and human-readable date-time strings in "YYYY-MM-DD HH:mm:ss" format (UTC).
 * Requirements: 8.1, 8.3, 8.4
 */
export default function UnixTimestampConverter({ toolId, toolName }: ToolEngineProps) {
  const [timestampInput, setTimestampInput] = useState('');
  const [datetimeInput, setDatetimeInput] = useState('');
  const [timestampResult, setTimestampResult] = useState('');
  const [datetimeResult, setDatetimeResult] = useState('');
  const [timestampError, setTimestampError] = useState<string | undefined>();
  const [datetimeError, setDatetimeError] = useState<string | undefined>();

  const handleTimestampToDatetime = () => {
    if (!timestampInput.trim()) {
      setTimestampError('Please enter a Unix timestamp');
      setDatetimeResult('');
      return;
    }

    const validation = validateNumeric(timestampInput, 'timestamp');
    if (!validation.valid) {
      setTimestampError('Please enter a valid numeric timestamp');
      setDatetimeResult('');
      return;
    }

    const numValue = Number(timestampInput.trim());
    if (!Number.isInteger(numValue) || numValue < 0) {
      setTimestampError('Timestamp must be a non-negative integer');
      setDatetimeResult('');
      return;
    }

    try {
      const result = timestampToDatetime(numValue);
      setDatetimeResult(result);
      setTimestampError(undefined);
    } catch (e) {
      setTimestampError(e instanceof Error ? e.message : 'Conversion failed');
      setDatetimeResult('');
    }
  };

  const handleDatetimeToTimestamp = () => {
    if (!datetimeInput.trim()) {
      setDatetimeError('Please enter a date-time value');
      setTimestampResult('');
      return;
    }

    const match = datetimeInput.trim().match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/);
    if (!match) {
      setDatetimeError('Invalid format. Expected "YYYY-MM-DD HH:mm:ss"');
      setTimestampResult('');
      return;
    }

    try {
      const result = datetimeToTimestamp(datetimeInput.trim());
      setTimestampResult(String(result));
      setDatetimeError(undefined);
    } catch (e) {
      setDatetimeError(e instanceof Error ? e.message : 'Conversion failed');
      setTimestampResult('');
    }
  };

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      {/* Timestamp → Datetime */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Timestamp → Date-Time
        </h3>
        <InputArea error={timestampError}>
          <label htmlFor={`${toolId}-timestamp-input`} className="block text-sm font-medium text-gray-700 mb-1">
            Unix Timestamp (seconds)
          </label>
          <input
            id={`${toolId}-timestamp-input`}
            type="text"
            inputMode="numeric"
            value={timestampInput}
            onChange={(e) => {
              setTimestampInput(e.target.value);
              if (timestampError) setTimestampError(undefined);
            }}
            placeholder="e.g. 1700000000"
            aria-label={`Unix timestamp input for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>
        <button
          onClick={handleTimestampToDatetime}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
        >
          Convert to Date-Time
        </button>
        <OutputArea hasContent={!!datetimeResult}>
          {datetimeResult && (
            <div className="space-y-2">
              <div className="text-lg font-semibold text-gray-800">{datetimeResult}</div>
              <div className="text-xs text-gray-500">UTC</div>
              <CopyToClipboard text={datetimeResult} />
            </div>
          )}
        </OutputArea>
      </div>

      {/* Datetime → Timestamp */}
      <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Date-Time → Timestamp
        </h3>
        <InputArea error={datetimeError}>
          <label htmlFor={`${toolId}-datetime-input`} className="block text-sm font-medium text-gray-700 mb-1">
            Date-Time (UTC)
          </label>
          <input
            id={`${toolId}-datetime-input`}
            type="text"
            value={datetimeInput}
            onChange={(e) => {
              setDatetimeInput(e.target.value);
              if (datetimeError) setDatetimeError(undefined);
            }}
            placeholder="2024-01-15 14:30:00"
            aria-label={`Date-time input for ${toolName}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
          />
        </InputArea>
        <button
          onClick={handleDatetimeToTimestamp}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] min-w-[44px]"
        >
          Convert to Timestamp
        </button>
        <OutputArea hasContent={!!timestampResult}>
          {timestampResult && (
            <div className="space-y-2">
              <div className="text-lg font-semibold text-gray-800">{timestampResult}</div>
              <div className="text-xs text-gray-500">seconds since epoch</div>
              <CopyToClipboard text={timestampResult} />
            </div>
          )}
        </OutputArea>
      </div>
    </div>
  );
}
