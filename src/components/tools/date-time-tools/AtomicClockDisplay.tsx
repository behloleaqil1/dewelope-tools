'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AtomicClockDisplay - Display time with millisecond precision (simulated atomic clock).
 * Shows current time updating every 10ms with various format options.
 */
export default function AtomicClockDisplay({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [running, setRunning] = useState(false);
  const [display, setDisplay] = useState('');
  const [timezone, setTimezone] = useState('local');
  const [format, setFormat] = useState<'24h' | '12h'>('24h');
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (date: Date): string => {
    let hours: number;
    let suffix = '';

    if (timezone === 'utc') {
      hours = date.getUTCHours();
      const mins = date.getUTCMinutes().toString().padStart(2, '0');
      const secs = date.getUTCSeconds().toString().padStart(2, '0');
      const ms = date.getUTCMilliseconds().toString().padStart(3, '0');

      if (format === '12h') {
        suffix = hours >= 12 ? ' PM' : ' AM';
        hours = hours % 12 || 12;
      }

      const h = hours.toString().padStart(2, '0');
      return `${h}:${mins}:${secs}.${ms}${suffix} UTC`;
    } else {
      hours = date.getHours();
      const mins = date.getMinutes().toString().padStart(2, '0');
      const secs = date.getSeconds().toString().padStart(2, '0');
      const ms = date.getMilliseconds().toString().padStart(3, '0');

      if (format === '12h') {
        suffix = hours >= 12 ? ' PM' : ' AM';
        hours = hours % 12 || 12;
      }

      const h = hours.toString().padStart(2, '0');
      const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return `${h}:${mins}:${secs}.${ms}${suffix} (${tzName})`;
    }
  };

  const buildDisplay = (date: Date): string => {
    const timeStr = formatTime(date);
    const isoStr = date.toISOString();
    const unix = Math.floor(date.getTime() / 1000);
    const unixMs = date.getTime();
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);

    return [
      `⏱  ${timeStr}`,
      ``,
      `ISO 8601:    ${isoStr}`,
      `Unix (s):    ${unix}`,
      `Unix (ms):   ${unixMs}`,
      `Date:        ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      `Day of Year: ${dayOfYear}`,
    ].join('\n');
  };

  const start = () => {
    if (running) return;
    setRunning(true);
    const id = setInterval(() => {
      setDisplay(buildDisplay(new Date()));
    }, 10);
    setIntervalId(id);
    setDisplay(buildDisplay(new Date()));
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setRunning(false);
  };

  const snapshot = () => {
    setDisplay(buildDisplay(new Date()));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-tz`} className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select id={`${toolId}-tz`} value={timezone} onChange={(e) => setTimezone(e.target.value)} aria-label={`Timezone for ${toolName}`} className="input-field">
              <option value="local">Local Time</option>
              <option value="utc">UTC</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-format`} className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select id={`${toolId}-format`} value={format} onChange={(e) => setFormat(e.target.value as '24h' | '12h')} aria-label="Time format" className="input-field">
              <option value="24h">24-hour</option>
              <option value="12h">12-hour</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {!running ? (
            <button onClick={start} className="btn-primary">Start Clock</button>
          ) : (
            <button onClick={stop} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">Stop</button>
          )}
          <button onClick={snapshot} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">Snapshot</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!display}>
        {display && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Atomic Clock Display</label>
            <pre className="whitespace-pre-wrap text-lg font-mono text-gray-800 bg-gray-900 text-green-400 p-6 rounded-lg">{display}</pre>
            <CopyToClipboard text={display} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
