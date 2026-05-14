'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * ShiftSchedulePlanner - Generate a rotating shift schedule
 */
export default function ShiftSchedulePlanner({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [startDate, setStartDate] = useState('');
  const [daysOn, setDaysOn] = useState('2');
  const [daysOff, setDaysOff] = useState('2');
  const [weeks, setWeeks] = useState('4');
  const [result, setResult] = useState<Array<{ date: string; status: 'on' | 'off' }>>([]);
  const [error, setError] = useState<string | undefined>();

  function generate() {
    setError(undefined);
    setResult([]);

    if (!startDate) { setError('Please select a start date'); return; }
    const on = parseInt(daysOn);
    const off = parseInt(daysOff);
    const numWeeks = parseInt(weeks);
    if (isNaN(on) || isNaN(off) || on < 1 || off < 1) { setError('Days on/off must be positive'); return; }
    if (isNaN(numWeeks) || numWeeks < 1 || numWeeks > 12) { setError('Weeks must be 1-12'); return; }

    const totalDays = numWeeks * 7;
    const cycleLength = on + off;
    const schedule: Array<{ date: string; status: 'on' | 'off' }> = [];
    const start = new Date(startDate);

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const posInCycle = i % cycleLength;
      const status: 'on' | 'off' = posInCycle < on ? 'on' : 'off';
      schedule.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        status,
      });
    }

    setResult(schedule);
  }

  const copyText = result.map(r => `${r.date}: ${r.status === 'on' ? 'WORK' : 'OFF'}`).join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input id={`${toolId}-start`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} aria-label={`Start date for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="flex gap-3 mt-3">
          <div className="flex-1"><label htmlFor={`${toolId}-on`} className="block text-sm font-medium text-gray-700 mb-1">Days On</label><input id={`${toolId}-on`} type="number" min="1" value={daysOn} onChange={(e) => setDaysOn(e.target.value)} aria-label={`Days on for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div className="flex-1"><label htmlFor={`${toolId}-off`} className="block text-sm font-medium text-gray-700 mb-1">Days Off</label><input id={`${toolId}-off`} type="number" min="1" value={daysOff} onChange={(e) => setDaysOff(e.target.value)} aria-label={`Days off for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div className="flex-1"><label htmlFor={`${toolId}-weeks`} className="block text-sm font-medium text-gray-700 mb-1">Weeks</label><input id={`${toolId}-weeks`} type="number" min="1" max="12" value={weeks} onChange={(e) => setWeeks(e.target.value)} aria-label={`Number of weeks for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        </div>
      </InputArea>

      <button onClick={generate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Generate Schedule</button>

      <OutputArea hasContent={result.length > 0}>
        {result.length > 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-7 gap-1 max-h-64 overflow-y-auto">
              {result.map((r, i) => (
                <div key={i} className={`p-2 rounded text-center text-xs ${r.status === 'on' ? 'bg-green-100 border border-green-300 text-green-700' : 'bg-gray-100 border border-gray-300 text-gray-500'}`}>
                  <div className="font-medium">{r.date.split(',')[0]}</div>
                  <div>{r.status === 'on' ? '✓' : '—'}</div>
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
