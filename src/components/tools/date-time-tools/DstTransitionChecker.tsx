'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface DstTransition {
  date: string;
  type: string;
  offsetBefore: string;
  offsetAfter: string;
}

/**
 * DstTransitionChecker - Check when DST transitions occur for any timezone/year.
 * Uses the Intl API to detect offset changes throughout the year.
 */
export default function DstTransitionChecker({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [transitions, setTransitions] = useState<DstTransition[]>([]);
  const [hasDst, setHasDst] = useState<boolean | null>(null);

  const commonTimezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Moscow',
    'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata', 'Asia/Dubai',
    'Australia/Sydney', 'Australia/Perth', 'Pacific/Auckland',
    'America/Sao_Paulo', 'Africa/Cairo', 'Africa/Johannesburg',
  ];

  function getUtcOffset(date: Date, tz: string): number {
    const utcStr = date.toLocaleString('en-US', { timeZone: 'UTC' });
    const tzStr = date.toLocaleString('en-US', { timeZone: tz });
    const utcDate = new Date(utcStr);
    const tzDate = new Date(tzStr);
    return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
  }

  function formatOffset(minutes: number): string {
    const sign = minutes >= 0 ? '+' : '-';
    const abs = Math.abs(minutes);
    const h = Math.floor(abs / 60);
    const m = abs % 60;
    return `UTC${sign}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  function findTransitions() {
    const newErrors: Record<string, string> = {};
    const y = parseInt(year);
    if (!year.trim() || isNaN(y) || y < 1970 || y > 2100) {
      newErrors.year = 'Enter a year between 1970 and 2100';
    }

    try {
      new Date().toLocaleString('en-US', { timeZone: timezone });
    } catch {
      newErrors.timezone = 'Invalid timezone identifier';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTransitions([]);
      setHasDst(null);
      return;
    }

    setErrors({});
    const found: DstTransition[] = [];

    // Check every hour of the year for offset changes
    const start = new Date(y, 0, 1);
    let prevOffset = getUtcOffset(start, timezone);

    for (let day = 1; day <= 366; day++) {
      const date = new Date(y, 0, 1 + day);
      if (date.getFullYear() !== y) break;

      const offset = getUtcOffset(date, timezone);
      if (offset !== prevOffset) {
        // Binary search for exact transition point
        let lo = new Date(y, 0, day);
        let hi = date;
        while (hi.getTime() - lo.getTime() > 60000) {
          const mid = new Date((lo.getTime() + hi.getTime()) / 2);
          if (getUtcOffset(mid, timezone) === prevOffset) {
            lo = mid;
          } else {
            hi = mid;
          }
        }

        const transitionType = offset > prevOffset ? 'Spring Forward (DST starts)' : 'Fall Back (DST ends)';
        found.push({
          date: hi.toLocaleString('en-US', { timeZone: timezone, dateStyle: 'full', timeStyle: 'short' }),
          type: transitionType,
          offsetBefore: formatOffset(prevOffset),
          offsetAfter: formatOffset(offset),
        });
        prevOffset = offset;
      } else {
        prevOffset = offset;
      }
    }

    setTransitions(found);
    setHasDst(found.length > 0);
  }

  const copyText = transitions.length > 0
    ? `DST Transitions for ${timezone} in ${year}:\n\n` + transitions.map(t =>
        `${t.type}\n  Date: ${t.date}\n  Offset: ${t.offsetBefore} → ${t.offsetAfter}`
      ).join('\n\n')
    : hasDst === false ? `No DST transitions for ${timezone} in ${year}` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputArea error={errors.year}>
          <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <input
            id={`${toolId}-year`}
            type="text"
            inputMode="numeric"
            value={year}
            onChange={(e) => { setYear(e.target.value); if (errors.year) setErrors(prev => ({ ...prev, year: '' })); }}
            placeholder="e.g. 2024"
            aria-label={`Year for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea error={errors.timezone}>
          <label htmlFor={`${toolId}-tz`} className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <select
            id={`${toolId}-tz`}
            value={timezone}
            onChange={(e) => { setTimezone(e.target.value); if (errors.timezone) setErrors(prev => ({ ...prev, timezone: '' })); }}
            aria-label={`Timezone for ${toolName}`}
            className="input-field"
          >
            {commonTimezones.map(tz => (
              <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </InputArea>
      </div>

      <button onClick={findTransitions} aria-label="Check DST transitions" className="btn-primary">
        Check DST Transitions
      </button>

      <OutputArea hasContent={hasDst !== null}>
        {hasDst === false && (
          <div className="text-center py-6">
            <div className="text-lg font-semibold text-gray-700">No DST Transitions</div>
            <p className="text-sm text-gray-500 mt-1">{timezone.replace(/_/g, ' ')} does not observe DST in {year}.</p>
          </div>
        )}
        {transitions.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">
              DST Transitions for {timezone.replace(/_/g, ' ')} in {year}
            </h3>
            {transitions.map((t, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className={`text-sm font-bold ${t.type.includes('Spring') ? 'text-orange-600' : 'text-blue-600'}`}>
                  {t.type}
                </div>
                <div className="text-sm text-gray-700 mt-1">{t.date}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {t.offsetBefore} → {t.offsetAfter}
                </div>
              </div>
            ))}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
