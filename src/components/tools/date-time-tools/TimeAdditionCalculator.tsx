'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimeAdditionCalculator - Add multiple time durations together (HH:MM:SS format).
 * Supports various input formats and shows total in hours, minutes, and seconds.
 */
export default function TimeAdditionCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ totalSeconds: number; formatted: string; entries: number } | null>(null);

  const parseTime = (str: string): number | null => {
    const trimmed = str.trim();
    if (!trimmed) return null;

    // HH:MM:SS
    const hmsMatch = trimmed.match(/^(\d+):(\d{1,2}):(\d{1,2})$/);
    if (hmsMatch) {
      return parseInt(hmsMatch[1]) * 3600 + parseInt(hmsMatch[2]) * 60 + parseInt(hmsMatch[3]);
    }

    // MM:SS
    const msMatch = trimmed.match(/^(\d+):(\d{1,2})$/);
    if (msMatch) {
      return parseInt(msMatch[1]) * 60 + parseInt(msMatch[2]);
    }

    // Just seconds
    const secMatch = trimmed.match(/^(\d+)$/);
    if (secMatch) {
      return parseInt(secMatch[1]);
    }

    return null;
  };

  const formatDuration = (totalSeconds: number): string => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculate = () => {
    const newErrors: Record<string, string> = {};

    if (!input.trim()) {
      newErrors.input = 'Please enter time durations (one per line)';
      setErrors(newErrors);
      setResult(null);
      return;
    }

    const lines = input.split('\n').filter((l) => l.trim());
    let totalSeconds = 0;
    let validEntries = 0;

    for (let i = 0; i < lines.length; i++) {
      const seconds = parseTime(lines[i]);
      if (seconds === null) {
        newErrors.input = `Line ${i + 1}: Invalid time format "${lines[i].trim()}". Use HH:MM:SS, MM:SS, or seconds.`;
        setErrors(newErrors);
        setResult(null);
        return;
      }
      totalSeconds += seconds;
      validEntries++;
    }

    if (validEntries === 0) {
      newErrors.input = 'No valid time entries found';
      setErrors(newErrors);
      setResult(null);
      return;
    }

    setErrors({});
    setResult({
      totalSeconds,
      formatted: formatDuration(totalSeconds),
      entries: validEntries,
    });
  };

  const copyText = result
    ? `Total: ${result.formatted}\nTotal seconds: ${result.totalSeconds}\nTotal minutes: ${(result.totalSeconds / 60).toFixed(2)}\nTotal hours: ${(result.totalSeconds / 3600).toFixed(4)}\nEntries added: ${result.entries}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={errors.input}>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Enter time durations (one per line)
        </label>
        <textarea
          id={`${toolId}-input`}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (errors.input) setErrors({});
          }}
          placeholder={'1:30:00\n0:45:30\n2:15:00\n0:10:45'}
          aria-label={`Time durations input for ${toolName}`}
          className="input-field h-48 resize-y font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">Formats: HH:MM:SS, MM:SS, or seconds</p>
      </InputArea>

      <button onClick={calculate} aria-label="Add time durations" className="btn-primary">
        Add Times
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-blue-600 font-mono">{result.formatted}</div>
              <div className="text-xs text-gray-500 mt-1">Total Duration (HH:MM:SS)</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{(result.totalSeconds / 3600).toFixed(2)}</div>
                <div className="text-xs text-gray-500">Hours</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{(result.totalSeconds / 60).toFixed(1)}</div>
                <div className="text-xs text-gray-500">Minutes</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.totalSeconds}</div>
                <div className="text-xs text-gray-500">Seconds</div>
              </div>
            </div>
            <div className="text-sm text-gray-500 text-center">
              {result.entries} time {result.entries === 1 ? 'entry' : 'entries'} added together
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
