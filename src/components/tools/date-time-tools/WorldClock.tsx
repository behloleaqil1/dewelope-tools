'use client';

import { useState, useEffect } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WorldClock - Show current time in multiple world cities simultaneously.
 */
const CITIES = [
  { name: 'New York', timezone: 'America/New_York' },
  { name: 'London', timezone: 'Europe/London' },
  { name: 'Paris', timezone: 'Europe/Paris' },
  { name: 'Dubai', timezone: 'Asia/Dubai' },
  { name: 'Mumbai', timezone: 'Asia/Kolkata' },
  { name: 'Singapore', timezone: 'Asia/Singapore' },
  { name: 'Tokyo', timezone: 'Asia/Tokyo' },
  { name: 'Sydney', timezone: 'Australia/Sydney' },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles' },
  { name: 'Chicago', timezone: 'America/Chicago' },
  { name: 'São Paulo', timezone: 'America/Sao_Paulo' },
  { name: 'Berlin', timezone: 'Europe/Berlin' },
  { name: 'Moscow', timezone: 'Europe/Moscow' },
  { name: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { name: 'Seoul', timezone: 'Asia/Seoul' },
  { name: 'Auckland', timezone: 'Pacific/Auckland' },
];

export default function WorldClock({ toolId, toolName: _toolName }: { toolId: string; toolName: string }) {
  const [times, setTimes] = useState<{ name: string; time: string; date: string; offset: string }[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([
    'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney', 'Europe/Paris', 'Asia/Singapore',
  ]);

  function updateTimes() {
    const now = new Date();
    const cityTimes = CITIES
      .filter((city) => selectedCities.includes(city.timezone))
      .map((city) => {
        const time = now.toLocaleTimeString('en-US', { timeZone: city.timezone, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const date = now.toLocaleDateString('en-US', { timeZone: city.timezone, weekday: 'short', month: 'short', day: 'numeric' });
        const offset = new Intl.DateTimeFormat('en-US', { timeZone: city.timezone, timeZoneName: 'shortOffset' })
          .formatToParts(now)
          .find((p) => p.type === 'timeZoneName')?.value || '';
        return { name: city.name, time, date, offset };
      });
    setTimes(cityTimes);
  }

  useEffect(() => {
    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCities]);

  function toggleCity(timezone: string) {
    setSelectedCities((prev) =>
      prev.includes(timezone) ? prev.filter((t) => t !== timezone) : [...prev, timezone]
    );
  }

  const copyText = times.map((t) => `${t.name}: ${t.time} (${t.date}) ${t.offset}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Cities</label>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <button
              key={city.timezone}
              onClick={() => toggleCity(city.timezone)}
              aria-label={`Toggle ${city.name}`}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                selectedCities.includes(city.timezone)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      <OutputArea hasContent={times.length > 0}>
        {times.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {times.map((city) => (
                <div key={city.name} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <div className="text-sm font-medium text-gray-600">{city.name}</div>
                  <div className="text-2xl font-bold text-gray-800 font-mono mt-1">{city.time}</div>
                  <div className="text-xs text-gray-500 mt-1">{city.date} • {city.offset}</div>
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
