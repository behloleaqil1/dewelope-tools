'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * RelativeTimeCalculator - Convert a date/time to relative time string.
 * Auto-updates every second if the date is within the last hour.
 */
export default function RelativeTimeCalculator({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [parsedDate, setParsedDate] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const absDiff = Math.abs(diffMs);
    const isPast = diffMs > 0;

    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    let timeStr: string;

    if (seconds < 5) {
      return 'just now';
    } else if (seconds < 60) {
      timeStr = seconds === 1 ? '1 second' : `${seconds} seconds`;
    } else if (minutes < 60) {
      timeStr = minutes === 1 ? '1 minute' : `${minutes} minutes`;
    } else if (hours < 24) {
      timeStr = hours === 1 ? '1 hour' : `${hours} hours`;
    } else if (days < 7) {
      timeStr = days === 1 ? '1 day' : `${days} days`;
    } else if (weeks < 5) {
      timeStr = weeks === 1 ? '1 week' : `${weeks} weeks`;
    } else if (months < 12) {
      timeStr = months === 1 ? '1 month' : `${months} months`;
    } else {
      timeStr = years === 1 ? '1 year' : `${years} years`;
    }

    return isPast ? `${timeStr} ago` : `in ${timeStr}`;
  }

  function computeOutput(date: Date) {
    const relative = getRelativeTime(date);
    const absolute = date.toLocaleString();
    setOutput(`${relative}\n\nAbsolute: ${absolute}`);
  }

  function handleCalculate() {
    if (!input.trim()) {
      setError('Please enter a date or timestamp');
      setOutput('');
      setParsedDate(null);
      return;
    }

    let date: Date;
    const asNumber = Number(input.trim());

    if (!isNaN(asNumber) && /^\d+$/.test(input.trim())) {
      date = new Date(asNumber * 1000);
    } else {
      date = new Date(input.trim());
    }

    if (isNaN(date.getTime())) {
      setError('Invalid date. Use formats like "2024-01-15", "2024-01-15T10:30:00", or a Unix timestamp.');
      setOutput('');
      setParsedDate(null);
      return;
    }

    setError(undefined);
    setParsedDate(date);
    computeOutput(date);
  }

  // Auto-update every second if within the last hour
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (parsedDate) {
      const diffMs = Math.abs(new Date().getTime() - parsedDate.getTime());
      if (diffMs < 3600000) {
        intervalRef.current = setInterval(() => {
          computeOutput(parsedDate);
        }, 1000);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedDate]);

  return (
    <div className="space-y-4">
      <InputArea error={error}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Date, DateTime, or Unix Timestamp
        </label>
        <input
          id={`${toolId}-input`}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., 2024-01-15, 2024-01-15T10:30:00, or 1705312200"
          aria-label="Date or Unix timestamp input"
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
        />
      </InputArea>

      <button
        onClick={handleCalculate}
        aria-label="Calculate relative time"
        className="px-6 py-3 text-sm font-medium rounded-md min-h-[44px] bg-blue-600 text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Calculate
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{output}</pre>
            <CopyToClipboard text={output.split('\n')[0]} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
