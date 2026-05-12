'use client';

import { useState, useEffect } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimeZoneMapViewer - Display current time across world regions.
 */
export default function TimeZoneMapViewer({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [times, setTimes] = useState<{ region: string; timezone: string; time: string; offset: string }[]>([]);

  const regions = [
    { region: 'New York (EST/EDT)', timezone: 'America/New_York' },
    { region: 'Los Angeles (PST/PDT)', timezone: 'America/Los_Angeles' },
    { region: 'London (GMT/BST)', timezone: 'Europe/London' },
    { region: 'Paris (CET/CEST)', timezone: 'Europe/Paris' },
    { region: 'Dubai (GST)', timezone: 'Asia/Dubai' },
    { region: 'Mumbai (IST)', timezone: 'Asia/Kolkata' },
    { region: 'Singapore (SGT)', timezone: 'Asia/Singapore' },
    { region: 'Tokyo (JST)', timezone: 'Asia/Tokyo' },
    { region: 'Sydney (AEST/AEDT)', timezone: 'Australia/Sydney' },
    { region: 'Auckland (NZST/NZDT)', timezone: 'Pacific/Auckland' },
    { region: 'São Paulo (BRT)', timezone: 'America/Sao_Paulo' },
    { region: 'Cairo (EET)', timezone: 'Africa/Cairo' },
  ];

  const updateTimes = () => {
    const now = new Date();
    const updated = regions.map(({ region, timezone }) => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        weekday: 'short',
      });
      const offsetFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        timeZoneName: 'shortOffset',
      });
      const parts = offsetFormatter.formatToParts(now);
      const offsetPart = parts.find((p) => p.type === 'timeZoneName');
      return {
        region,
        timezone,
        time: formatter.format(now),
        offset: offsetPart?.value || '',
      };
    });
    setTimes(updated);
  };

  useEffect(() => {
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getHourColor = (timezone: string): string => {
    const now = new Date();
    const hour = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: 'numeric', hour12: false }).format(now));
    if (hour >= 6 && hour < 12) return 'bg-yellow-50 border-yellow-200';
    if (hour >= 12 && hour < 18) return 'bg-blue-50 border-blue-200';
    if (hour >= 18 && hour < 21) return 'bg-orange-50 border-orange-200';
    return 'bg-gray-100 border-gray-300';
  };

  const copyText = times.map((t) => `${t.region}: ${t.time} (${t.offset})`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId} aria-label={toolName}>
      <OutputArea hasContent={times.length > 0}>
        {times.length > 0 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Current Time Across World Regions</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {times.map((t, i) => (
                <div key={i} className={`p-3 rounded-lg border ${getHourColor(t.timezone)}`}>
                  <div className="text-xs text-gray-500 font-medium">{t.region}</div>
                  <div className="text-lg font-bold text-gray-800 font-mono">{t.time}</div>
                  <div className="text-xs text-gray-500">{t.offset}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-50 border border-yellow-200 inline-block" /> Morning</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-50 border border-blue-200 inline-block" /> Afternoon</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-50 border border-orange-200 inline-block" /> Evening</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 border border-gray-300 inline-block" /> Night</span>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
