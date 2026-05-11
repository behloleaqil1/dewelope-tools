'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimeZoneOffsetCalculator - Calculates time difference between any two timezones.
 */
export default function TimeZoneOffsetCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [tz1, setTz1] = useState('America/New_York');
  const [tz2, setTz2] = useState('Europe/London');
  const [error, setError] = useState<string | undefined>();
  const [result, setResult] = useState<{ offset: number; time1: string; time2: string; tz1Name: string; tz2Name: string } | null>(null);

  const TIMEZONES = [
    { value: 'Pacific/Honolulu', label: 'Honolulu (HST)' },
    { value: 'America/Anchorage', label: 'Anchorage (AKST)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
    { value: 'America/Denver', label: 'Denver (MST)' },
    { value: 'America/Chicago', label: 'Chicago (CST)' },
    { value: 'America/New_York', label: 'New York (EST)' },
    { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
    { value: 'Atlantic/Reykjavik', label: 'Reykjavik (GMT)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET)' },
    { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'Asia/Kolkata', label: 'Kolkata (IST)' },
    { value: 'Asia/Bangkok', label: 'Bangkok (ICT)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
    { value: 'Pacific/Auckland', label: 'Auckland (NZST)' },
    { value: 'UTC', label: 'UTC' },
  ];

  function calculate() {
    setError(undefined);
    setResult(null);

    try {
      const now = new Date();

      const fmt1 = new Intl.DateTimeFormat('en-US', {
        timeZone: tz1,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const fmt2 = new Intl.DateTimeFormat('en-US', {
        timeZone: tz2,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      const time1 = fmt1.format(now);
      const time2 = fmt2.format(now);

      // Calculate offset in hours
      const getOffset = (tz: string): number => {
        const str = now.toLocaleString('en-US', { timeZone: tz, timeZoneName: 'longOffset' });
        const match = str.match(/GMT([+-]\d{1,2}):?(\d{2})?/);
        if (!match) return 0;
        const hours = parseInt(match[1]);
        const minutes = parseInt(match[2] || '0');
        return hours + (hours >= 0 ? minutes / 60 : -minutes / 60);
      };

      const offset1 = getOffset(tz1);
      const offset2 = getOffset(tz2);
      const diff = offset2 - offset1;

      const tz1Label = TIMEZONES.find((t) => t.value === tz1)?.label || tz1;
      const tz2Label = TIMEZONES.find((t) => t.value === tz2)?.label || tz2;

      setResult({ offset: diff, time1, time2, tz1Name: tz1Label, tz2Name: tz2Label });
    } catch {
      setError('Error calculating timezone offset');
    }
  }

  const formatOffset = (hours: number): string => {
    const sign = hours >= 0 ? '+' : '-';
    const abs = Math.abs(hours);
    const h = Math.floor(abs);
    const m = Math.round((abs - h) * 60);
    return m > 0 ? `${sign}${h}h ${m}m` : `${sign}${h}h`;
  };

  const copyText = result
    ? `${result.tz1Name}: ${result.time1}\n${result.tz2Name}: ${result.time2}\nDifference: ${formatOffset(result.offset)}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Timezones for {toolName}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${toolId}-tz1`} className="block text-xs text-gray-500 mb-1">Timezone 1</label>
            <select
              id={`${toolId}-tz1`}
              value={tz1}
              onChange={(e) => setTz1(e.target.value)}
              aria-label="First timezone"
              className="input-field text-sm"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-tz2`} className="block text-xs text-gray-500 mb-1">Timezone 2</label>
            <select
              id={`${toolId}-tz2`}
              value={tz2}
              onChange={(e) => setTz2(e.target.value)}
              aria-label="Second timezone"
              className="input-field text-sm"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>
        </div>
      </InputArea>

      <button onClick={calculate} aria-label="Calculate timezone offset" className="btn-primary">
        Calculate Offset
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-2xl font-bold text-blue-600">{formatOffset(result.offset)}</div>
              <div className="text-xs text-gray-500 mt-1">Time Difference</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800 font-mono">{result.time1}</div>
                <div className="text-xs text-gray-500 mt-1">{result.tz1Name}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-gray-800 font-mono">{result.time2}</div>
                <div className="text-xs text-gray-500 mt-1">{result.tz2Name}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
              {result.tz2Name} is {result.offset >= 0 ? 'ahead of' : 'behind'} {result.tz1Name} by {formatOffset(Math.abs(result.offset)).replace('+', '')}
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
