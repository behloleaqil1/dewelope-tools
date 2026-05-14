'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * UnixEpochConverter - Convert Unix timestamp to/from human-readable date
 */
export default function UnixEpochConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [timestamp, setTimestamp] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [result, setResult] = useState<{ date: string; timestamp: number; iso: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function fromTimestamp() {
    setError(undefined);
    setResult(null);
    const ts = parseInt(timestamp);
    if (isNaN(ts)) { setError('Please enter a valid Unix timestamp'); return; }
    const ms = ts.toString().length > 10 ? ts : ts * 1000;
    const date = new Date(ms);
    if (isNaN(date.getTime())) { setError('Invalid timestamp'); return; }
    setResult({
      date: date.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' }),
      timestamp: Math.floor(ms / 1000),
      iso: date.toISOString(),
    });
  }

  function fromDate() {
    setError(undefined);
    setResult(null);
    if (!dateInput) { setError('Please select a date'); return; }
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) { setError('Invalid date'); return; }
    setResult({
      date: date.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' }),
      timestamp: Math.floor(date.getTime() / 1000),
      iso: date.toISOString(),
    });
  }

  function useNow() {
    const now = new Date();
    setResult({
      date: now.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'long' }),
      timestamp: Math.floor(now.getTime() / 1000),
      iso: now.toISOString(),
    });
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-ts`} className="block text-sm font-medium text-gray-700 mb-1">Unix Timestamp</label>
        <div className="flex gap-2">
          <input id={`${toolId}-ts`} type="number" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} placeholder="e.g., 1700000000" aria-label={`Unix timestamp input for ${toolName}`} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={fromTimestamp} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Convert</button>
        </div>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Or select a date</label>
        <div className="flex gap-2">
          <input id={`${toolId}-date`} type="datetime-local" value={dateInput} onChange={(e) => setDateInput(e.target.value)} aria-label={`Date input for ${toolName}`} className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={fromDate} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Convert</button>
        </div>
        <button onClick={useNow} className="mt-3 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm">Use Current Time</button>
      </InputArea>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-lg font-semibold text-gray-800">Unix Timestamp: {result.timestamp}</div>
            <div className="text-md text-gray-700">{result.date}</div>
            <div className="text-sm text-gray-600 font-mono">ISO 8601: {result.iso}</div>
            <CopyToClipboard text={String(result.timestamp)} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
