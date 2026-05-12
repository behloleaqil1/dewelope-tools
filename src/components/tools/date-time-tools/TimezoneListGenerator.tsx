'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface TimezoneInfo {
  name: string;
  offset: string;
  currentTime: string;
}

/**
 * TimezoneListGenerator - Generates a list of all timezones with current times.
 * Shows timezone name, UTC offset, and current local time for each zone.
 */
export default function TimezoneListGenerator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [timezones, setTimezones] = useState<TimezoneInfo[]>([]);
  const [filter, setFilter] = useState('');

  const commonTimezones = [
    'Pacific/Midway', 'Pacific/Honolulu', 'America/Anchorage', 'America/Los_Angeles',
    'America/Denver', 'America/Chicago', 'America/New_York', 'America/Sao_Paulo',
    'Atlantic/South_Georgia', 'Atlantic/Azores', 'Europe/London', 'Europe/Paris',
    'Europe/Berlin', 'Europe/Helsinki', 'Europe/Moscow', 'Asia/Dubai',
    'Asia/Karachi', 'Asia/Kolkata', 'Asia/Dhaka', 'Asia/Bangkok',
    'Asia/Shanghai', 'Asia/Tokyo', 'Australia/Sydney', 'Pacific/Auckland',
    'Pacific/Fiji', 'America/Argentina/Buenos_Aires', 'America/Mexico_City',
    'Africa/Cairo', 'Africa/Nairobi', 'Africa/Lagos', 'Asia/Singapore',
    'Asia/Hong_Kong', 'Asia/Seoul', 'Europe/Istanbul', 'Europe/Warsaw',
    'Europe/Rome', 'Europe/Madrid', 'America/Toronto', 'America/Vancouver',
    'Australia/Perth', 'Australia/Melbourne', 'Asia/Jakarta', 'Asia/Manila',
    'America/Phoenix', 'America/Bogota', 'America/Lima', 'Europe/Amsterdam',
    'Europe/Stockholm', 'Europe/Oslo', 'Europe/Copenhagen', 'Asia/Taipei',
  ];

  const generate = () => {
    const now = new Date();
    const zones: TimezoneInfo[] = [];

    for (const tz of commonTimezones) {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        const currentTime = formatter.format(now);

        const offsetFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          timeZoneName: 'shortOffset',
        });
        const parts = offsetFormatter.formatToParts(now);
        const offsetPart = parts.find((p) => p.type === 'timeZoneName');
        const offset = offsetPart?.value || 'UTC';

        zones.push({ name: tz, offset, currentTime });
      } catch {
        // Skip invalid timezones
      }
    }

    // Sort by offset
    zones.sort((a, b) => {
      const getMinutes = (offset: string) => {
        const match = offset.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
        if (!match) return 0;
        const sign = match[1] === '+' ? 1 : -1;
        const hours = parseInt(match[2]) || 0;
        const mins = parseInt(match[3]) || 0;
        return sign * (hours * 60 + mins);
      };
      return getMinutes(a.offset) - getMinutes(b.offset);
    });

    setTimezones(zones);
  };

  const filtered = timezones.filter((tz) =>
    tz.name.toLowerCase().includes(filter.toLowerCase()) ||
    tz.offset.toLowerCase().includes(filter.toLowerCase())
  );

  const copyText = filtered.map((tz) => `${tz.name} (${tz.offset}) - ${tz.currentTime}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-3">
        <button onClick={generate} aria-label={`Generate timezone list for ${toolName}`} className="btn-primary">
          Generate Timezone List
        </button>

        {timezones.length > 0 && (
          <div>
            <label htmlFor={`${toolId}-filter`} className="block text-sm font-medium text-gray-700 mb-1">
              Filter Timezones
            </label>
            <input
              id={`${toolId}-filter`}
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search by name or offset..."
              aria-label="Filter timezones"
              className="input-field"
            />
          </div>
        )}
      </div>

      <OutputArea hasContent={timezones.length > 0}>
        {filtered.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Timezones ({filtered.length} of {timezones.length})
              </h3>
              <CopyToClipboard text={copyText} />
            </div>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {filtered.map((tz, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 text-sm">
                  <div className="flex-1">
                    <span className="font-medium text-gray-800">{tz.name}</span>
                    <span className="ml-2 text-gray-500">({tz.offset})</span>
                  </div>
                  <span className="font-mono text-blue-600 font-medium">{tz.currentTime}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </OutputArea>
    </div>
  );
}
