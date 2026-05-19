'use client';

import { useState, useEffect } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * WorldClockDisplay - Display current time in multiple cities simultaneously.
 */
export default function WorldClockDisplay({ toolId, toolName }: { toolId: string; toolName: string }) {
  const availableCities = [
    { name: 'New York', tz: 'America/New_York' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Paris', tz: 'Europe/Paris' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'Sydney', tz: 'Australia/Sydney' },
    { name: 'Dubai', tz: 'Asia/Dubai' },
    { name: 'Singapore', tz: 'Asia/Singapore' },
    { name: 'Los Angeles', tz: 'America/Los_Angeles' },
    { name: 'Chicago', tz: 'America/Chicago' },
    { name: 'Mumbai', tz: 'Asia/Kolkata' },
    { name: 'Hong Kong', tz: 'Asia/Hong_Kong' },
    { name: 'Berlin', tz: 'Europe/Berlin' },
  ];

  const [selectedCities, setSelectedCities] = useState<string[]>(['America/New_York', 'Europe/London', 'Asia/Tokyo']);
  const [times, setTimes] = useState<{ name: string; tz: string; time: string; date: string; offset: string }[]>([]);
  const [addCity, setAddCity] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const updated = selectedCities.map((tz) => {
        const city = availableCities.find((c) => c.tz === tz);
        const time = now.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const date = now.toLocaleDateString('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' });
        const offset = now.toLocaleString('en-US', { timeZone: tz, timeZoneName: 'short' }).split(' ').pop() || '';
        return { name: city?.name || tz, tz, time, date, offset };
      });
      setTimes(updated);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [selectedCities]);

  const handleAdd = () => {
    if (addCity && !selectedCities.includes(addCity) && selectedCities.length < 12) {
      setSelectedCities([...selectedCities, addCity]);
      setAddCity('');
    }
  };

  const handleRemove = (tz: string) => {
    setSelectedCities(selectedCities.filter((c) => c !== tz));
  };

  const copyText = times.map((t) => `${t.name}: ${t.time} (${t.date}, ${t.offset})`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error="">
        <div className="flex gap-2">
          <div className="flex-1">
            <label htmlFor={`${toolId}-add`} className="block text-sm font-medium text-gray-700 mb-1">Add City</label>
            <select id={`${toolId}-add`} value={addCity} onChange={(e) => setAddCity(e.target.value)} aria-label={`Add city for ${toolName}`} className="input-field">
              <option value="">Select a city...</option>
              {availableCities.filter((c) => !selectedCities.includes(c.tz)).map((c) => (
                <option key={c.tz} value={c.tz}>{c.name}</option>
              ))}
            </select>
          </div>
          <button onClick={handleAdd} className="btn-primary self-end" aria-label="Add city to display" disabled={!addCity}>Add</button>
        </div>
      </InputArea>

      <OutputArea hasContent={times.length > 0}>
        <div className="space-y-2">
          {times.map((t) => (
            <div key={t.tz} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div>
                <div className="text-sm font-medium text-gray-800">{t.name}</div>
                <div className="text-xs text-gray-500">{t.date} • {t.offset}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-mono font-bold text-blue-600">{t.time}</span>
                <button onClick={() => handleRemove(t.tz)} className="text-red-400 hover:text-red-600 text-sm" aria-label={`Remove ${t.name}`}>✕</button>
              </div>
            </div>
          ))}
          {times.length > 0 && <CopyToClipboard text={copyText} />}
        </div>
      </OutputArea>
    </div>
  );
}
