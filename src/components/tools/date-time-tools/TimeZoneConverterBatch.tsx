'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

const TIMEZONES = [
  { label: 'UTC', offset: 0 },
  { label: 'EST (UTC-5)', offset: -5 },
  { label: 'CST (UTC-6)', offset: -6 },
  { label: 'MST (UTC-7)', offset: -7 },
  { label: 'PST (UTC-8)', offset: -8 },
  { label: 'GMT (UTC+0)', offset: 0 },
  { label: 'CET (UTC+1)', offset: 1 },
  { label: 'EET (UTC+2)', offset: 2 },
  { label: 'IST (UTC+5:30)', offset: 5.5 },
  { label: 'CST China (UTC+8)', offset: 8 },
  { label: 'JST (UTC+9)', offset: 9 },
  { label: 'AEST (UTC+10)', offset: 10 },
  { label: 'NZST (UTC+12)', offset: 12 },
  { label: 'HST (UTC-10)', offset: -10 },
  { label: 'AKST (UTC-9)', offset: -9 },
  { label: 'AST (UTC-4)', offset: -4 },
];

interface ConvertedTime {
  timezone: string;
  time: string;
  date: string;
  dayDiff: string;
}

/**
 * TimeZoneConverterBatch - Convert a time to multiple timezones at once.
 * Shows the equivalent time in all major timezones simultaneously.
 */
export default function TimeZoneConverterBatch({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [time, setTime] = useState('12:00');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sourceOffset, setSourceOffset] = useState('0');
  const [results, setResults] = useState<ConvertedTime[]>([]);
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    if (!time || !date) { setError('Please enter both time and date'); return; }

    const [hours, minutes] = time.split(':').map(Number);
    const srcOffset = parseFloat(sourceOffset);
    const totalMinutesUTC = hours * 60 + minutes - srcOffset * 60;

    const converted: ConvertedTime[] = TIMEZONES.map(tz => {
      const targetMinutes = totalMinutesUTC + tz.offset * 60;
      let dayDiff = '';
      let adjustedMinutes = targetMinutes;

      if (adjustedMinutes >= 1440) {
        adjustedMinutes -= 1440;
        dayDiff = '(+1 day)';
      } else if (adjustedMinutes < 0) {
        adjustedMinutes += 1440;
        dayDiff = '(-1 day)';
      }

      const h = Math.floor(adjustedMinutes / 60);
      const m = Math.round(adjustedMinutes % 60);
      const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

      return { timezone: tz.label, time: timeStr, date, dayDiff };
    });

    setResults(converted);
  };

  const copyText = results.map(r => `${r.timezone}: ${r.time} ${r.dayDiff}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-time`} className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input id={`${toolId}-time`} type="time" value={time} onChange={(e) => setTime(e.target.value)} aria-label={`Time input for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input id={`${toolId}-date`} type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label={`Date input for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-source`} className="block text-sm font-medium text-gray-700 mb-1">Source Timezone</label>
              <select id={`${toolId}-source`} value={sourceOffset} onChange={(e) => setSourceOffset(e.target.value)} aria-label="Source timezone" className="input-field">
                {TIMEZONES.map(tz => <option key={tz.label} value={tz.offset}>{tz.label}</option>)}
              </select>
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={convert} aria-label="Convert to all timezones" className="btn-primary">Convert to All Timezones</button>

      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Converted Times</h3>
              <CopyToClipboard text={copyText} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {results.map((r, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">{r.timezone}</span>
                  <span className="text-sm font-mono text-gray-800">
                    {r.time} <span className="text-xs text-orange-500">{r.dayDiff}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
