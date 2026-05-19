'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MeetingTimePlanner - Find overlapping business hours across timezones.
 */
export default function MeetingTimePlanner({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [selectedZones, setSelectedZones] = useState<string[]>(['America/New_York', 'Europe/London']);
  const [addZone, setAddZone] = useState('');
  const [startHour, setStartHour] = useState('9');
  const [endHour, setEndHour] = useState('17');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ slots: { utcHour: number; times: { tz: string; hour: number; inBusiness: boolean }[] }[] } | null>(null);

  const timezones = [
    'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin',
    'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Kolkata', 'Asia/Dubai',
    'Australia/Sydney', 'Pacific/Auckland',
  ];

  const getOffsetHours = (tz: string): number => {
    const now = new Date();
    const utcStr = now.toLocaleString('en-US', { timeZone: 'UTC', hour: 'numeric', hour12: false });
    const tzStr = now.toLocaleString('en-US', { timeZone: tz, hour: 'numeric', hour12: false });
    let diff = parseInt(tzStr) - parseInt(utcStr);
    if (diff > 12) diff -= 24;
    if (diff < -12) diff += 24;
    return diff;
  };

  const find = () => {
    setError('');
    setResult(null);
    if (selectedZones.length < 2) { setError('Add at least 2 timezones.'); return; }

    const start = parseInt(startHour);
    const end = parseInt(endHour);
    if (isNaN(start) || isNaN(end) || start >= end) { setError('Invalid business hours.'); return; }

    const slots: { utcHour: number; times: { tz: string; hour: number; inBusiness: boolean }[] }[] = [];

    for (let utcHour = 0; utcHour < 24; utcHour++) {
      const times = selectedZones.map((tz) => {
        const offset = getOffsetHours(tz);
        const localHour = (utcHour + offset + 24) % 24;
        return { tz, hour: localHour, inBusiness: localHour >= start && localHour < end };
      });
      const allInBusiness = times.every((t) => t.inBusiness);
      if (allInBusiness) {
        slots.push({ utcHour, times });
      }
    }

    setResult({ slots });
  };

  const handleAdd = () => {
    if (addZone && !selectedZones.includes(addZone)) {
      setSelectedZones([...selectedZones, addZone]);
      setAddZone('');
    }
  };

  const copyText = result ? (result.slots.length > 0
    ? `Overlapping hours (UTC): ${result.slots.map((s) => `${s.utcHour}:00`).join(', ')}\n\n` +
      result.slots.map((s) => `UTC ${s.utcHour}:00 → ${s.times.map((t) => `${t.tz.split('/')[1]}: ${t.hour}:00`).join(', ')}`).join('\n')
    : 'No overlapping business hours found.') : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor={`${toolId}-add`} className="block text-sm font-medium text-gray-700 mb-1">Add Timezone</label>
              <select id={`${toolId}-add`} value={addZone} onChange={(e) => setAddZone(e.target.value)} aria-label={`Add timezone for ${toolName}`} className="input-field">
                <option value="">Select...</option>
                {timezones.filter((tz) => !selectedZones.includes(tz)).map((tz) => (
                  <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <button onClick={handleAdd} className="btn-primary self-end" aria-label="Add timezone">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedZones.map((tz) => (
              <span key={tz} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                {tz.split('/')[1]?.replace(/_/g, ' ')}
                <button onClick={() => setSelectedZones(selectedZones.filter((z) => z !== tz))} className="text-blue-500 hover:text-blue-700" aria-label={`Remove ${tz}`}>×</button>
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Business Start</label>
              <input id={`${toolId}-start`} type="text" inputMode="numeric" value={startHour} onChange={(e) => setStartHour(e.target.value)} placeholder="9" aria-label={`Business start hour for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-end`} className="block text-sm font-medium text-gray-700 mb-1">Business End</label>
              <input id={`${toolId}-end`} type="text" inputMode="numeric" value={endHour} onChange={(e) => setEndHour(e.target.value)} placeholder="17" aria-label={`Business end hour for ${toolName}`} className="input-field" />
            </div>
          </div>
        </div>
      </InputArea>

      <button onClick={find} className="btn-primary" aria-label="Find overlapping hours">Find Overlap</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            {result.slots.length > 0 ? (
              <>
                <div className="text-sm font-medium text-green-700">Found {result.slots.length} overlapping hour(s)</div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {result.slots.map((slot) => (
                    <div key={slot.utcHour} className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="text-sm font-bold text-green-800">UTC {slot.utcHour}:00</div>
                      <div className="text-xs text-green-600 mt-1">
                        {slot.times.map((t) => `${t.tz.split('/')[1]?.replace(/_/g, ' ')}: ${t.hour}:00`).join(' • ')}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-sm text-red-600 p-3 bg-red-50 rounded-lg border border-red-200">No overlapping business hours found for these timezones.</div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
