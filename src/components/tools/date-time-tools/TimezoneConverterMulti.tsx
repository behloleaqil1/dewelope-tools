'use client';

import { useState, useEffect } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimezoneConverterMulti - Convert a single time to multiple timezones simultaneously.
 * Shows the same moment in time across many world timezones.
 */

const TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: 'US Eastern (New York)', value: 'America/New_York' },
  { label: 'US Central (Chicago)', value: 'America/Chicago' },
  { label: 'US Mountain (Denver)', value: 'America/Denver' },
  { label: 'US Pacific (Los Angeles)', value: 'America/Los_Angeles' },
  { label: 'UK (London)', value: 'Europe/London' },
  { label: 'Central Europe (Berlin)', value: 'Europe/Berlin' },
  { label: 'Eastern Europe (Bucharest)', value: 'Europe/Bucharest' },
  { label: 'India (Kolkata)', value: 'Asia/Kolkata' },
  { label: 'China (Shanghai)', value: 'Asia/Shanghai' },
  { label: 'Japan (Tokyo)', value: 'Asia/Tokyo' },
  { label: 'Korea (Seoul)', value: 'Asia/Seoul' },
  { label: 'Australia Eastern (Sydney)', value: 'Australia/Sydney' },
  { label: 'New Zealand (Auckland)', value: 'Pacific/Auckland' },
  { label: 'Brazil (São Paulo)', value: 'America/Sao_Paulo' },
  { label: 'Dubai (UAE)', value: 'Asia/Dubai' },
  { label: 'Singapore', value: 'Asia/Singapore' },
  { label: 'Hong Kong', value: 'Asia/Hong_Kong' },
  { label: 'Moscow', value: 'Europe/Moscow' },
  { label: 'Hawaii', value: 'Pacific/Honolulu' },
  { label: 'Alaska', value: 'America/Anchorage' },
  { label: 'Argentina (Buenos Aires)', value: 'America/Argentina/Buenos_Aires' },
  { label: 'Bangkok', value: 'Asia/Bangkok' },
  { label: 'Istanbul', value: 'Europe/Istanbul' },
];

export default function TimezoneConverterMulti({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [sourceTimezone, setSourceTimezone] = useState('UTC');
  const [dateTime, setDateTime] = useState('');
  const [selectedZones, setSelectedZones] = useState<string[]>([
    'America/New_York', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo', 'Australia/Sydney'
  ]);
  const [results, setResults] = useState<{ zone: string; label: string; time: string; date: string; offset: string }[]>([]);

  useEffect(() => {
    // Set default to current time
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    setDateTime(local.toISOString().slice(0, 16));
  }, []);

  const convert = () => {
    if (!dateTime) return;

    const sourceDate = new Date(dateTime);

    // We treat the input dateTime as if it's in the source timezone
    // Create a date object for conversion
    const tempDate = new Date(sourceDate);

    const converted = selectedZones.map((zone) => {
      const tz = TIMEZONES.find((t) => t.value === zone);
      const label = tz?.label || zone;

      try {
        const timeStr = tempDate.toLocaleString('en-US', {
          timeZone: zone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        const dateStr = tempDate.toLocaleString('en-US', {
          timeZone: zone,
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        const offsetStr = tempDate.toLocaleString('en-US', {
          timeZone: zone,
          timeZoneName: 'shortOffset',
        }).split(' ').pop() || '';

        return { zone, label, time: timeStr, date: dateStr, offset: offsetStr };
      } catch {
        return { zone, label, time: 'Invalid', date: '', offset: '' };
      }
    });

    setResults(converted);
  };

  const toggleZone = (zone: string) => {
    setSelectedZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  const copyText = results.length > 0
    ? results.map((r) => `${r.label}: ${r.time} ${r.date} (${r.offset})`).join('\n')
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea>
          <label htmlFor={`${toolId}-datetime`} className="block text-sm font-medium text-gray-700 mb-1">
            Date & Time
          </label>
          <input
            id={`${toolId}-datetime`}
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            aria-label={`Date and time for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-source`} className="block text-sm font-medium text-gray-700 mb-1">
            Source Timezone
          </label>
          <select
            id={`${toolId}-source`}
            value={sourceTimezone}
            onChange={(e) => setSourceTimezone(e.target.value)}
            aria-label={`Source timezone for ${toolName}`}
            className="input-field"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </InputArea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Target Timezones</label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50">
          {TIMEZONES.map((tz) => (
            <label key={tz.value} className="flex items-center gap-1 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={selectedZones.includes(tz.value)}
                onChange={() => toggleZone(tz.value)}
                className="rounded border-gray-300"
              />
              <span className="text-gray-700">{tz.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button onClick={convert} aria-label="Convert time" className="btn-primary">
        Convert to All Timezones
      </button>

      <OutputArea hasContent={results.length > 0}>
        {results.length > 0 && (
          <div className="space-y-2">
            <div className="divide-y divide-gray-100">
              {results.map((r) => (
                <div key={r.zone} className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{r.label}</div>
                    <div className="text-xs text-gray-500">{r.offset}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{r.time}</div>
                    <div className="text-xs text-gray-500">{r.date}</div>
                  </div>
                </div>
              ))}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
