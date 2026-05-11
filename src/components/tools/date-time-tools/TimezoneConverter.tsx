'use client';

import { useState, useMemo } from 'react';
import { ToolEngineProps } from '@/types';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { convertTimezone } from '@/lib/date-time-tools';

/**
 * Timezone data grouped by region with UTC offset display.
 */
interface TimezoneOption {
  id: string;
  label: string;
  region: string;
  offset: string;
}

function getTimezoneOffset(tz: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find((p) => p.type === 'timeZoneName');
    return offsetPart?.value || '';
  } catch {
    return '';
  }
}

function getTimezoneAbbr(tz: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'short',
    });
    const parts = formatter.formatToParts(now);
    const abbrPart = parts.find((p) => p.type === 'timeZoneName');
    return abbrPart?.value || '';
  } catch {
    return '';
  }
}

const TIMEZONE_LIST: { id: string; region: string }[] = [
  // Americas
  { id: 'America/New_York', region: 'Americas' },
  { id: 'America/Chicago', region: 'Americas' },
  { id: 'America/Denver', region: 'Americas' },
  { id: 'America/Los_Angeles', region: 'Americas' },
  { id: 'America/Anchorage', region: 'Americas' },
  { id: 'America/Toronto', region: 'Americas' },
  { id: 'America/Vancouver', region: 'Americas' },
  { id: 'America/Mexico_City', region: 'Americas' },
  { id: 'America/Sao_Paulo', region: 'Americas' },
  { id: 'America/Argentina/Buenos_Aires', region: 'Americas' },
  { id: 'America/Bogota', region: 'Americas' },
  { id: 'America/Lima', region: 'Americas' },
  { id: 'America/Santiago', region: 'Americas' },
  { id: 'America/Phoenix', region: 'Americas' },
  { id: 'America/Halifax', region: 'Americas' },
  // Europe
  { id: 'Europe/London', region: 'Europe' },
  { id: 'Europe/Paris', region: 'Europe' },
  { id: 'Europe/Berlin', region: 'Europe' },
  { id: 'Europe/Madrid', region: 'Europe' },
  { id: 'Europe/Rome', region: 'Europe' },
  { id: 'Europe/Amsterdam', region: 'Europe' },
  { id: 'Europe/Brussels', region: 'Europe' },
  { id: 'Europe/Zurich', region: 'Europe' },
  { id: 'Europe/Vienna', region: 'Europe' },
  { id: 'Europe/Stockholm', region: 'Europe' },
  { id: 'Europe/Oslo', region: 'Europe' },
  { id: 'Europe/Helsinki', region: 'Europe' },
  { id: 'Europe/Warsaw', region: 'Europe' },
  { id: 'Europe/Prague', region: 'Europe' },
  { id: 'Europe/Athens', region: 'Europe' },
  { id: 'Europe/Moscow', region: 'Europe' },
  { id: 'Europe/Istanbul', region: 'Europe' },
  { id: 'Europe/Lisbon', region: 'Europe' },
  { id: 'Europe/Dublin', region: 'Europe' },
  // Asia
  { id: 'Asia/Dubai', region: 'Asia' },
  { id: 'Asia/Riyadh', region: 'Asia' },
  { id: 'Asia/Tehran', region: 'Asia' },
  { id: 'Asia/Karachi', region: 'Asia' },
  { id: 'Asia/Kolkata', region: 'Asia' },
  { id: 'Asia/Dhaka', region: 'Asia' },
  { id: 'Asia/Bangkok', region: 'Asia' },
  { id: 'Asia/Jakarta', region: 'Asia' },
  { id: 'Asia/Singapore', region: 'Asia' },
  { id: 'Asia/Shanghai', region: 'Asia' },
  { id: 'Asia/Hong_Kong', region: 'Asia' },
  { id: 'Asia/Taipei', region: 'Asia' },
  { id: 'Asia/Tokyo', region: 'Asia' },
  { id: 'Asia/Seoul', region: 'Asia' },
  { id: 'Asia/Manila', region: 'Asia' },
  // Oceania
  { id: 'Australia/Sydney', region: 'Oceania' },
  { id: 'Australia/Melbourne', region: 'Oceania' },
  { id: 'Australia/Brisbane', region: 'Oceania' },
  { id: 'Australia/Perth', region: 'Oceania' },
  { id: 'Australia/Adelaide', region: 'Oceania' },
  { id: 'Pacific/Auckland', region: 'Oceania' },
  { id: 'Pacific/Fiji', region: 'Oceania' },
  // Africa
  { id: 'Africa/Cairo', region: 'Africa' },
  { id: 'Africa/Lagos', region: 'Africa' },
  { id: 'Africa/Johannesburg', region: 'Africa' },
  { id: 'Africa/Nairobi', region: 'Africa' },
  { id: 'Africa/Casablanca', region: 'Africa' },
  // Other
  { id: 'UTC', region: 'Other' },
  { id: 'Pacific/Honolulu', region: 'Other' },
];

/**
 * TimezoneConverter - Converts a time value from one timezone to another.
 * Features proper date/time pickers and grouped timezone selects with UTC offsets.
 */
export default function TimezoneConverter({ toolId, toolName }: ToolEngineProps) {
  const [date, setDate] = useState(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  });
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [sourceTimezone, setSourceTimezone] = useState('UTC');
  const [targetTimezone, setTargetTimezone] = useState('America/New_York');
  const [result, setResult] = useState('');
  const [resultDetails, setResultDetails] = useState<{ date: string; time: string; abbr: string; offset: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  // Build timezone options with offsets (memoized)
  const timezoneOptions = useMemo(() => {
    const options: TimezoneOption[] = TIMEZONE_LIST.map((tz) => {
      const city = tz.id.split('/').pop()?.replace(/_/g, ' ') || tz.id;
      const offset = getTimezoneOffset(tz.id);
      return {
        id: tz.id,
        label: `${city} (${offset})`,
        region: tz.region,
        offset,
      };
    });
    return options;
  }, []);

  // Group by region
  const groupedTimezones = useMemo(() => {
    const groups: Record<string, TimezoneOption[]> = {};
    for (const opt of timezoneOptions) {
      if (!groups[opt.region]) groups[opt.region] = [];
      groups[opt.region].push(opt);
    }
    return groups;
  }, [timezoneOptions]);

  const handleConvert = () => {
    if (!date || !time) {
      setError('Please select both date and time');
      setResult('');
      setResultDetails(null);
      return;
    }

    const timeInput = `${date} ${time}:00`;

    try {
      const converted = convertTimezone(timeInput, sourceTimezone, targetTimezone);
      setResult(converted);
      setError(undefined);

      // Parse result for detailed display
      const abbr = getTimezoneAbbr(targetTimezone);
      const offset = getTimezoneOffset(targetTimezone);
      const [resDate, resTime] = converted.split(' ');
      setResultDetails({ date: resDate, time: resTime, abbr, offset });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setResult('');
      setResultDetails(null);
    }
  };

  const handleUseNow = () => {
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
  };

  const handleSwapTimezones = () => {
    setSourceTimezone(targetTimezone);
    setTargetTimezone(sourceTimezone);
  };

  const sourceCity = sourceTimezone.split('/').pop()?.replace(/_/g, ' ') || sourceTimezone;
  const targetCity = targetTimezone.split('/').pop()?.replace(/_/g, ' ') || targetTimezone;

  return (
    <div className="space-y-6" data-tool-id={toolId}>
      <div className="space-y-4">
        {/* Date and Time Inputs */}
        <InputArea error={error}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date and Time
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${toolId}-date`} className="block text-xs text-gray-500 mb-1">Date</label>
              <input
                id={`${toolId}-date`}
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (error) setError(undefined);
                }}
                aria-label={`Date input for ${toolName}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
              />
            </div>
            <div>
              <label htmlFor={`${toolId}-time`} className="block text-xs text-gray-500 mb-1">Time</label>
              <input
                id={`${toolId}-time`}
                type="time"
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  if (error) setError(undefined);
                }}
                aria-label={`Time input for ${toolName}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
              />
            </div>
          </div>
          <button
            onClick={handleUseNow}
            type="button"
            className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
            aria-label="Use current date and time"
          >
            ⏱ Use current time
          </button>
        </InputArea>

        {/* Timezone Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${toolId}-source-tz`} className="block text-sm font-medium text-gray-700 mb-1">
              From Timezone
            </label>
            <select
              id={`${toolId}-source-tz`}
              value={sourceTimezone}
              onChange={(e) => setSourceTimezone(e.target.value)}
              aria-label={`Source timezone for ${toolName}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] text-sm"
            >
              {Object.entries(groupedTimezones).map(([region, tzs]) => (
                <optgroup key={region} label={`── ${region} ──`}>
                  {tzs.map((tz) => (
                    <option key={tz.id} value={tz.id}>
                      {tz.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="mt-1 text-xs text-gray-400">
              {getTimezoneAbbr(sourceTimezone)} • {getTimezoneOffset(sourceTimezone)}
            </div>
          </div>

          <div>
            <label htmlFor={`${toolId}-target-tz`} className="block text-sm font-medium text-gray-700 mb-1">
              To Timezone
            </label>
            <select
              id={`${toolId}-target-tz`}
              value={targetTimezone}
              onChange={(e) => setTargetTimezone(e.target.value)}
              aria-label={`Target timezone for ${toolName}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px] text-sm"
            >
              {Object.entries(groupedTimezones).map(([region, tzs]) => (
                <optgroup key={region} label={`── ${region} ──`}>
                  {tzs.map((tz) => (
                    <option key={tz.id} value={tz.id}>
                      {tz.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <div className="mt-1 text-xs text-gray-400">
              {getTimezoneAbbr(targetTimezone)} • {getTimezoneOffset(targetTimezone)}
            </div>
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwapTimezones}
            type="button"
            className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Swap source and target timezones"
          >
            ⇄ Swap Timezones
          </button>
        </div>

        <button
          onClick={handleConvert}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 min-h-[44px] font-medium"
          aria-label="Convert timezone"
        >
          Convert
        </button>
      </div>

      <OutputArea hasContent={!!result}>
        {result && resultDetails && (
          <div className="space-y-4">
            {/* Source display */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">From: {sourceCity}</div>
              <div className="text-lg font-mono text-gray-700">
                {date} {time}:00
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {getTimezoneAbbr(sourceTimezone)} ({getTimezoneOffset(sourceTimezone)})
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center text-gray-400 text-xl">↓</div>

            {/* Target display */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 uppercase tracking-wide mb-1">To: {targetCity}</div>
              <div className="text-2xl font-bold font-mono text-blue-800">
                {resultDetails.time}
              </div>
              <div className="text-sm text-blue-700 mt-1">
                {resultDetails.date}
              </div>
              <div className="text-xs text-blue-500 mt-1">
                {resultDetails.abbr} ({resultDetails.offset})
              </div>
            </div>

            <CopyToClipboard text={`${result} (${targetCity}, ${resultDetails.abbr})`} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
