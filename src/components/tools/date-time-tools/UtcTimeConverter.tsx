'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * UtcTimeConverter - Convert local time to UTC and UTC to local time.
 */
export default function UtcTimeConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'toUtc' | 'fromUtc'>('toUtc');
  const [time, setTime] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ utc: string; local: string; offset: string; dst: boolean } | null>(null);

  const timezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
    'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata', 'Asia/Dubai',
    'Australia/Sydney', 'Pacific/Auckland', 'America/Sao_Paulo', 'Africa/Cairo',
  ];

  const convert = () => {
    setError('');
    setResult(null);
    if (!time) { setError('Please enter a time.'); return; }

    try {
      const dateTimeStr = `${date}T${time}:00`;

      if (mode === 'toUtc') {
        const localDate = new Date(dateTimeStr);
        const formatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'short' });
        const parts = formatter.formatToParts(localDate);
        const tzAbbr = parts.find((p) => p.type === 'timeZoneName')?.value || '';

        const utcStr = localDate.toLocaleString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const utcDate = localDate.toLocaleDateString('en-US', { timeZone: 'UTC' });
        const localStr = localDate.toLocaleString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

        const offsetMs = localDate.getTimezoneOffset();
        const offsetHours = -offsetMs / 60;
        const offsetStr = `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`;
        const isDst = tzAbbr.includes('DT') || tzAbbr.includes('ST') === false;

        setResult({ utc: `${utcDate} ${utcStr} UTC`, local: `${date} ${localStr} ${tzAbbr}`, offset: offsetStr, dst: isDst });
      } else {
        const utcDate = new Date(dateTimeStr + 'Z');
        const localStr = utcDate.toLocaleString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        const localDateStr = utcDate.toLocaleDateString('en-US', { timeZone: timezone });
        const formatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'short' });
        const parts = formatter.formatToParts(utcDate);
        const tzAbbr = parts.find((p) => p.type === 'timeZoneName')?.value || '';

        setResult({ utc: `${date} ${time}:00 UTC`, local: `${localDateStr} ${localStr} ${tzAbbr}`, offset: tzAbbr, dst: tzAbbr.includes('DT') });
      }
    } catch {
      setError('Invalid date/time input.');
    }
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="flex gap-2 mb-2">
        <button onClick={() => { setMode('toUtc'); setResult(null); }} className={`px-4 py-2 rounded text-sm font-medium ${mode === 'toUtc' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`} aria-label="Local to UTC mode">Local → UTC</button>
        <button onClick={() => { setMode('fromUtc'); setResult(null); }} className={`px-4 py-2 rounded text-sm font-medium ${mode === 'fromUtc' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`} aria-label="UTC to local mode">UTC → Local</button>
      </div>

      <InputArea error={error}>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={`Date for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input id={`${toolId}-time`} type="time" value={time} onChange={(e) => setTime(e.target.value)} aria-label={`Time for ${toolName}`} className="input-field" />
          </div>
          <div>
            <label htmlFor={`${toolId}-tz`} className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select id={`${toolId}-tz`} value={timezone} onChange={(e) => setTimezone(e.target.value)} aria-label="Timezone" className="input-field">
              {timezones.map((tz) => <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} className="btn-primary" aria-label="Convert time">Convert</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-2">
            <div className="flex justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">UTC Time</span>
              <span className="text-sm font-mono font-bold text-blue-600">{result.utc}</span>
            </div>
            <div className="flex justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">Local Time</span>
              <span className="text-sm font-mono font-bold text-blue-600">{result.local}</span>
            </div>
            <div className="flex justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">Offset</span>
              <span className="text-sm font-mono font-bold text-gray-800">{result.offset}</span>
            </div>
            <div className="flex justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">DST Active</span>
              <span className={`text-sm font-bold ${result.dst ? 'text-green-600' : 'text-gray-600'}`}>{result.dst ? 'Yes' : 'No'}</span>
            </div>
            <CopyToClipboard text={`UTC: ${result.utc}\nLocal: ${result.local}\nOffset: ${result.offset}\nDST: ${result.dst ? 'Yes' : 'No'}`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
