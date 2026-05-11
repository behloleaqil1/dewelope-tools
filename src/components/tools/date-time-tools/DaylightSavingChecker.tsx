'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * DaylightSavingChecker - Checks if a date falls in daylight saving time for a timezone.
 * Uses the browser's Intl API to determine DST status.
 */
export default function DaylightSavingChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [result, setResult] = useState<{ isDST: boolean; offset: string; standardOffset: string; dstOffset: string; tzAbbr: string } | null>(null);
  const [error, setError] = useState('');

  const timezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'America/Anchorage', 'Pacific/Honolulu', 'America/Toronto', 'America/Vancouver',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid',
    'Europe/Rome', 'Europe/Amsterdam', 'Europe/Brussels', 'Europe/Stockholm',
    'Europe/Moscow', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata',
    'Asia/Dubai', 'Asia/Singapore', 'Australia/Sydney', 'Australia/Melbourne',
    'Pacific/Auckland', 'America/Sao_Paulo', 'America/Mexico_City', 'Africa/Cairo',
    'Africa/Johannesburg', 'Asia/Seoul',
  ].sort();

  const check = () => {
    if (!dateInput) {
      setError('Please select a date');
      setResult(null);
      return;
    }
    setError('');

    try {
      const date = new Date(dateInput + 'T12:00:00');
      if (isNaN(date.getTime())) {
        setError('Invalid date');
        setResult(null);
        return;
      }

      // Get offset for the given date
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'shortOffset',
      });
      const parts = formatter.formatToParts(date);
      const tzPart = parts.find((p) => p.type === 'timeZoneName');
      const offset = tzPart?.value || '';

      // Get offset for January (standard time) and July (potential DST)
      const jan = new Date(date.getFullYear(), 0, 15, 12, 0, 0);
      const jul = new Date(date.getFullYear(), 6, 15, 12, 0, 0);

      const janFormatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'shortOffset' });
      const julFormatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'shortOffset' });

      const janParts = janFormatter.formatToParts(jan);
      const julParts = julFormatter.formatToParts(jul);

      const janOffset = janParts.find((p) => p.type === 'timeZoneName')?.value || '';
      const julOffset = julParts.find((p) => p.type === 'timeZoneName')?.value || '';

      // DST is active if the current offset differs from the standard (winter) offset
      // In northern hemisphere, January is standard; in southern, July is standard
      const isDST = janOffset !== julOffset && offset !== janOffset && offset === julOffset;
      const isDSTSouthern = janOffset !== julOffset && offset === janOffset && offset !== julOffset;
      const hasDST = janOffset !== julOffset;

      // Get abbreviation
      const abbrFormatter = new Intl.DateTimeFormat('en-US', { timeZone: timezone, timeZoneName: 'short' });
      const abbrParts = abbrFormatter.formatToParts(date);
      const tzAbbr = abbrParts.find((p) => p.type === 'timeZoneName')?.value || '';

      setResult({
        isDST: isDST || isDSTSouthern,
        offset,
        standardOffset: janOffset,
        dstOffset: julOffset,
        tzAbbr,
      });

      if (!hasDST) {
        setResult({
          isDST: false,
          offset,
          standardOffset: janOffset,
          dstOffset: janOffset,
          tzAbbr: tzAbbr + ' (no DST observed)',
        });
      }
    } catch {
      setError('Error checking DST status');
      setResult(null);
    }
  };

  const copyText = result
    ? `Date: ${dateInput}\nTimezone: ${timezone}\nDST Active: ${result.isDST ? 'Yes' : 'No'}\nOffset: ${result.offset}\nAbbreviation: ${result.tzAbbr}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputArea error={error}>
          <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
            Select Date
          </label>
          <input
            id={`${toolId}-date`}
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            aria-label={`Date input for ${toolName}`}
            className="input-field"
          />
        </InputArea>

        <InputArea>
          <label htmlFor={`${toolId}-tz`} className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <select
            id={`${toolId}-tz`}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            aria-label={`Timezone for ${toolName}`}
            className="input-field"
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </InputArea>
      </div>

      <button onClick={check} aria-label="Check daylight saving time" className="btn-primary">
        Check DST Status
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className={`text-3xl font-bold ${result.isDST ? 'text-yellow-600' : 'text-blue-600'}`}>
                {result.isDST ? '☀️ DST Active' : '🕐 Standard Time'}
              </div>
              <div className="text-sm text-gray-500 mt-2">{result.tzAbbr}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.offset}</div>
                <div className="text-xs text-gray-500 mt-1">Current Offset</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-700">{result.standardOffset}</div>
                <div className="text-xs text-gray-500 mt-1">Standard Offset</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
