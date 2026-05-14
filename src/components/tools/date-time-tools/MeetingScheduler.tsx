'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MeetingScheduler - Find meeting times across multiple time zones
 */
export default function MeetingScheduler({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [zones, setZones] = useState('America/New_York,Europe/London,Asia/Tokyo');
  const [startHour, setStartHour] = useState('9');
  const [endHour, setEndHour] = useState('17');
  const [result, setResult] = useState<Array<{ utcHour: number; times: string[] }>>([]);
  const [error, setError] = useState<string | undefined>();

  function findSlots() {
    setError(undefined);
    setResult([]);

    const zoneList = zones.split(',').map(z => z.trim()).filter(Boolean);
    if (zoneList.length < 2) { setError('Enter at least 2 time zones separated by commas'); return; }

    const start = parseInt(startHour);
    const end = parseInt(endHour);
    if (isNaN(start) || isNaN(end) || start < 0 || end > 23 || start >= end) {
      setError('Enter valid business hours (start < end, 0-23)');
      return;
    }

    const slots: Array<{ utcHour: number; times: string[] }> = [];
    const now = new Date();

    for (let utcHour = 0; utcHour < 24; utcHour++) {
      const testDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), utcHour, 0, 0);
      let allInRange = true;
      const times: string[] = [];

      for (const zone of zoneList) {
        try {
          const formatter = new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', minute: '2-digit', hour12: true });
          const hourFormatter = new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: 'numeric', hour12: false });
          const localHour = parseInt(hourFormatter.format(testDate));
          times.push(`${zone.split('/').pop()}: ${formatter.format(testDate)}`);
          if (localHour < start || localHour >= end) allInRange = false;
        } catch {
          setError(`Invalid time zone: ${zone}`);
          return;
        }
      }

      if (allInRange) {
        slots.push({ utcHour, times });
      }
    }

    setResult(slots);
  }

  const copyText = result.length > 0
    ? result.map(s => `UTC ${s.utcHour}:00 → ${s.times.join(', ')}`).join('\n')
    : 'No overlapping business hours found';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-zones`} className="block text-sm font-medium text-gray-700 mb-1">Time Zones (comma-separated)</label>
        <input id={`${toolId}-zones`} type="text" value={zones} onChange={(e) => setZones(e.target.value)} placeholder="e.g., America/New_York,Europe/London" aria-label={`Time zones input for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Business Start Hour</label>
            <input id={`${toolId}-start`} type="number" min="0" max="23" value={startHour} onChange={(e) => setStartHour(e.target.value)} aria-label={`Start hour for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex-1">
            <label htmlFor={`${toolId}-end`} className="block text-sm font-medium text-gray-700 mb-1">Business End Hour</label>
            <input id={`${toolId}-end`} type="number" min="0" max="23" value={endHour} onChange={(e) => setEndHour(e.target.value)} aria-label={`End hour for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </InputArea>

      <button onClick={findSlots} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Find Meeting Times</button>

      <OutputArea hasContent={result.length > 0}>
        {result.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">{result.length} overlapping slot{result.length !== 1 ? 's' : ''} found:</div>
            {result.map((slot, i) => (
              <div key={i} className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="font-semibold text-green-700">UTC {slot.utcHour.toString().padStart(2, '0')}:00</div>
                <div className="text-sm text-gray-600 mt-1">{slot.times.join(' | ')}</div>
              </div>
            ))}
            <CopyToClipboard text={copyText} />
          </div>
        ) : null}
      </OutputArea>
    </div>
  );
}
