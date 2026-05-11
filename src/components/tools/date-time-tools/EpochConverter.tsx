'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EpochConverter - Convert between epoch/Unix timestamps and human-readable dates with millisecond support.
 */
export default function EpochConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [epochInput, setEpochInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [epochResult, setEpochResult] = useState<string | null>(null);
  const [dateResult, setDateResult] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  function epochToDate() {
    setError(undefined);
    setDateResult(null);

    if (!epochInput.trim()) {
      setError('Please enter an epoch timestamp');
      return;
    }

    const num = Number(epochInput.trim());
    if (isNaN(num)) {
      setError('Please enter a valid number');
      return;
    }

    // Auto-detect seconds vs milliseconds (if > 10 digits, treat as ms)
    const ms = epochInput.trim().length > 10 ? num : num * 1000;
    const date = new Date(ms);

    if (isNaN(date.getTime())) {
      setError('Invalid timestamp');
      return;
    }

    const utc = date.toUTCString();
    const iso = date.toISOString();
    const local = date.toLocaleString();

    setDateResult(`UTC: ${utc}\nISO: ${iso}\nLocal: ${local}\nSeconds: ${Math.floor(ms / 1000)}\nMilliseconds: ${ms}`);
  }

  function dateToEpoch() {
    setError(undefined);
    setEpochResult(null);

    if (!dateInput.trim()) {
      setError('Please enter a date');
      return;
    }

    const date = new Date(dateInput.trim());
    if (isNaN(date.getTime())) {
      setError('Invalid date format. Try YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss');
      return;
    }

    const seconds = Math.floor(date.getTime() / 1000);
    const milliseconds = date.getTime();

    setEpochResult(`Seconds: ${seconds}\nMilliseconds: ${milliseconds}\nDate: ${date.toUTCString()}`);
  }

  function getCurrentEpoch() {
    const now = Date.now();
    setEpochInput(Math.floor(now / 1000).toString());
    const date = new Date(now);
    setDateResult(`UTC: ${date.toUTCString()}\nISO: ${date.toISOString()}\nLocal: ${date.toLocaleString()}\nSeconds: ${Math.floor(now / 1000)}\nMilliseconds: ${now}`);
  }

  const copyText = dateResult || epochResult || '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-4">
          <div>
            <label htmlFor={`${toolId}-epoch`} className="block text-sm font-medium text-gray-700 mb-1">
              Epoch Timestamp → Date
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-epoch`}
                type="text"
                inputMode="numeric"
                value={epochInput}
                onChange={(e) => setEpochInput(e.target.value)}
                placeholder="e.g. 1700000000 or 1700000000000"
                aria-label={`Epoch timestamp for ${toolName}`}
                className="input-field flex-1"
              />
              <button onClick={epochToDate} className="btn-primary whitespace-nowrap">To Date</button>
            </div>
          </div>
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
              Date → Epoch Timestamp
            </label>
            <div className="flex gap-2">
              <input
                id={`${toolId}-date`}
                type="text"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                placeholder="e.g. 2024-01-15T12:00:00Z"
                aria-label="Date input"
                className="input-field flex-1"
              />
              <button onClick={dateToEpoch} className="btn-primary whitespace-nowrap">To Epoch</button>
            </div>
          </div>
          <button onClick={getCurrentEpoch} className="text-sm text-blue-600 hover:text-blue-800 underline" aria-label="Get current epoch time">
            Get current time
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={dateResult !== null || epochResult !== null}>
        {(dateResult || epochResult) && (
          <div className="space-y-3">
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {dateResult || epochResult}
            </pre>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
