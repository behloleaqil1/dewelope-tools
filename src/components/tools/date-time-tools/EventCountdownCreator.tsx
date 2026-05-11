'use client';

import { useState, useEffect, useRef } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

interface CountdownEvent {
  name: string;
  date: string;
  time: string;
}

interface CountdownResult {
  name: string;
  targetDate: Date;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  isPast: boolean;
}

/**
 * EventCountdownCreator - Create custom countdowns to any named event with multiple units.
 * Supports multiple simultaneous countdowns with live updating.
 */
export default function EventCountdownCreator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [events, setEvents] = useState<CountdownEvent[]>([{ name: '', date: '', time: '00:00' }]);
  const [countdowns, setCountdowns] = useState<CountdownResult[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addEvent = () => {
    setEvents([...events, { name: '', date: '', time: '00:00' }]);
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const updateEvent = (index: number, field: keyof CountdownEvent, value: string) => {
    const updated = [...events];
    updated[index] = { ...updated[index], [field]: value };
    setEvents(updated);
  };

  const calculateCountdowns = () => {
    const now = new Date();
    const results: CountdownResult[] = events
      .filter((e) => e.name.trim() && e.date)
      .map((e) => {
        const targetDate = new Date(`${e.date}T${e.time || '00:00'}:00`);
        const diff = targetDate.getTime() - now.getTime();
        const isPast = diff < 0;
        const absDiff = Math.abs(diff);

        const totalSeconds = Math.floor(absDiff / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        const days = totalDays;
        const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

        return { name: e.name, targetDate, days, hours, minutes, seconds, totalDays, totalHours, totalMinutes, totalSeconds, isPast };
      });
    setCountdowns(results);
  };

  useEffect(() => {
    calculateCountdowns();
    intervalRef.current = setInterval(calculateCountdowns, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events]);

  const copyText = countdowns
    .map((c) => `${c.name}: ${c.isPast ? 'PAST - ' : ''}${c.days}d ${c.hours}h ${c.minutes}m ${c.seconds}s (${c.totalDays} total days)`)
    .join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          {events.map((event, i) => (
            <div key={i} className="flex flex-wrap items-end gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1 min-w-[150px]">
                <label htmlFor={`${toolId}-name-${i}`} className="block text-xs font-medium text-gray-700 mb-1">Event Name</label>
                <input
                  id={`${toolId}-name-${i}`}
                  type="text"
                  value={event.name}
                  onChange={(e) => updateEvent(i, 'name', e.target.value)}
                  placeholder="e.g. Birthday, Wedding"
                  aria-label={`Event name ${i + 1} for ${toolName}`}
                  className="input-field text-sm"
                />
              </div>
              <div className="min-w-[140px]">
                <label htmlFor={`${toolId}-date-${i}`} className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                <input
                  id={`${toolId}-date-${i}`}
                  type="date"
                  value={event.date}
                  onChange={(e) => updateEvent(i, 'date', e.target.value)}
                  aria-label={`Event date ${i + 1}`}
                  className="input-field text-sm"
                />
              </div>
              <div className="min-w-[100px]">
                <label htmlFor={`${toolId}-time-${i}`} className="block text-xs font-medium text-gray-700 mb-1">Time</label>
                <input
                  id={`${toolId}-time-${i}`}
                  type="time"
                  value={event.time}
                  onChange={(e) => updateEvent(i, 'time', e.target.value)}
                  aria-label={`Event time ${i + 1}`}
                  className="input-field text-sm"
                />
              </div>
              {events.length > 1 && (
                <button
                  onClick={() => removeEvent(i)}
                  className="px-2 py-1 text-red-500 hover:text-red-700 text-sm"
                  aria-label={`Remove event ${i + 1}`}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button onClick={addEvent} className="text-sm text-blue-600 hover:text-blue-800 font-medium" aria-label="Add another event">
            + Add Event
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={countdowns.length > 0}>
        {countdowns.length > 0 && (
          <div className="space-y-3">
            {countdowns.map((c, i) => (
              <div key={i} className={`p-4 rounded-lg border ${c.isPast ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">{c.name}</span>
                  <span className="text-xs text-gray-500">
                    {c.targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                {c.isPast && <div className="text-xs text-red-600 mb-2 font-medium">Event has passed</div>}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className={`text-xl font-bold ${c.isPast ? 'text-red-500' : 'text-blue-600'}`}>{c.days}</div>
                    <div className="text-xs text-gray-500">days</div>
                  </div>
                  <div>
                    <div className={`text-xl font-bold ${c.isPast ? 'text-red-500' : 'text-blue-600'}`}>{c.hours}</div>
                    <div className="text-xs text-gray-500">hours</div>
                  </div>
                  <div>
                    <div className={`text-xl font-bold ${c.isPast ? 'text-red-500' : 'text-blue-600'}`}>{c.minutes}</div>
                    <div className="text-xs text-gray-500">min</div>
                  </div>
                  <div>
                    <div className={`text-xl font-bold ${c.isPast ? 'text-red-500' : 'text-blue-600'}`}>{c.seconds}</div>
                    <div className="text-xs text-gray-500">sec</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Total: {c.totalDays.toLocaleString()} days | {c.totalHours.toLocaleString()} hours | {c.totalMinutes.toLocaleString()} minutes
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
