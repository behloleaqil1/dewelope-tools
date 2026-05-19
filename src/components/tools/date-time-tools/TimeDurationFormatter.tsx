'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimeDurationFormatter - Format time durations between seconds, HH:MM:SS, ISO 8601.
 */
export default function TimeDurationFormatter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [input, setInput] = useState('');
  const [inputFormat, setInputFormat] = useState<'seconds' | 'milliseconds' | 'hhmmss' | 'minutes'>('seconds');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ seconds: number; formats: { label: string; value: string }[] } | null>(null);

  const convert = () => {
    setError('');
    setResult(null);
    if (!input.trim()) { setError('Please enter a duration value.'); return; }

    let totalSeconds = 0;

    switch (inputFormat) {
      case 'seconds': {
        const num = parseFloat(input);
        if (isNaN(num) || num < 0) { setError('Enter a valid non-negative number.'); return; }
        totalSeconds = num;
        break;
      }
      case 'milliseconds': {
        const num = parseFloat(input);
        if (isNaN(num) || num < 0) { setError('Enter a valid non-negative number.'); return; }
        totalSeconds = num / 1000;
        break;
      }
      case 'minutes': {
        const num = parseFloat(input);
        if (isNaN(num) || num < 0) { setError('Enter a valid non-negative number.'); return; }
        totalSeconds = num * 60;
        break;
      }
      case 'hhmmss': {
        const parts = input.split(':').map(Number);
        if (parts.some(isNaN) || parts.length < 2 || parts.length > 3) { setError('Enter time as HH:MM:SS or MM:SS.'); return; }
        if (parts.length === 3) totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        else totalSeconds = parts[0] * 60 + parts[1];
        break;
      }
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = totalSeconds * 1000;

    const hhmmss = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(Math.floor(seconds)).padStart(2, '0')}`;

    // ISO 8601 duration
    let iso = 'PT';
    if (hours > 0) iso += `${hours}H`;
    if (minutes > 0) iso += `${minutes}M`;
    if (seconds > 0 || (hours === 0 && minutes === 0)) iso += `${seconds % 1 === 0 ? Math.floor(seconds) : seconds.toFixed(3)}S`;

    // Human readable
    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (seconds > 0 || parts.length === 0) parts.push(`${Math.floor(seconds)} second${Math.floor(seconds) !== 1 ? 's' : ''}`);
    const humanReadable = parts.join(', ');

    setResult({
      seconds: totalSeconds,
      formats: [
        { label: 'Seconds', value: totalSeconds.toFixed(3) },
        { label: 'Milliseconds', value: ms.toFixed(0) },
        { label: 'Minutes', value: (totalSeconds / 60).toFixed(4) },
        { label: 'HH:MM:SS', value: hhmmss },
        { label: 'ISO 8601', value: iso },
        { label: 'Human Readable', value: humanReadable },
      ],
    });
  };

  const copyText = result ? result.formats.map((f) => `${f.label}: ${f.value}`).join('\n') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">Duration Value</label>
            <input id={`${toolId}-input`} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 3661" aria-label={`Duration value for ${toolName}`} className="input-field font-mono" />
          </div>
          <div>
            <label htmlFor={`${toolId}-format`} className="block text-sm font-medium text-gray-700 mb-1">Input Format</label>
            <select id={`${toolId}-format`} value={inputFormat} onChange={(e) => setInputFormat(e.target.value as typeof inputFormat)} aria-label="Input format" className="input-field">
              <option value="seconds">Seconds</option>
              <option value="milliseconds">Milliseconds</option>
              <option value="minutes">Minutes</option>
              <option value="hhmmss">HH:MM:SS</option>
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Format duration">Format</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-2">
            {result.formats.map((f, i) => (
              <div key={i} className="flex justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-600">{f.label}</span>
                <span className="text-sm font-mono font-bold text-blue-600">{f.value}</span>
              </div>
            ))}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
