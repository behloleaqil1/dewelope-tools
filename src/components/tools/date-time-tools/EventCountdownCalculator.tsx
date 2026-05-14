'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * EventCountdownCalculator - Calculate days/hours/minutes until an event
 */
export default function EventCountdownCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [eventDate, setEventDate] = useState('');
  const [eventName, setEventName] = useState('');
  const [result, setResult] = useState<{ days: number; hours: number; minutes: number; seconds: number; weeks: number; isPast: boolean } | null>(null);
  const [error, setError] = useState<string | undefined>();

  function calculate() {
    setError(undefined);
    setResult(null);

    if (!eventDate) { setError('Please select an event date'); return; }
    const target = new Date(eventDate);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    const isPast = diff < 0;
    const absDiff = Math.abs(diff);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
    const weeks = Math.floor(days / 7);

    setResult({ days, hours, minutes, seconds, weeks, isPast });
  }

  const copyText = result ? `${eventName || 'Event'}: ${result.isPast ? 'was' : 'in'} ${result.days} days, ${result.hours} hours, ${result.minutes} minutes` : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea error={error}>
        <label htmlFor={`${toolId}-name`} className="block text-sm font-medium text-gray-700 mb-1">Event Name (optional)</label>
        <input id={`${toolId}-name`} type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="e.g., Birthday, Launch Day" aria-label={`Event name for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1 mt-3">Event Date & Time</label>
        <input id={`${toolId}-date`} type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} aria-label={`Event date for ${toolName}`} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </InputArea>

      <button onClick={calculate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Calculate Countdown</button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="text-center text-sm text-gray-600">{eventName || 'Event'} {result.isPast ? 'was' : 'is in'}:</div>
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center"><div className="text-xl font-bold text-blue-600">{result.days}</div><div className="text-xs text-gray-500">Days</div></div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center"><div className="text-xl font-bold text-green-600">{result.hours}</div><div className="text-xs text-gray-500">Hours</div></div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-center"><div className="text-xl font-bold text-purple-600">{result.minutes}</div><div className="text-xs text-gray-500">Minutes</div></div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-center"><div className="text-xl font-bold text-orange-600">{result.seconds}</div><div className="text-xs text-gray-500">Seconds</div></div>
            </div>
            <div className="text-sm text-gray-600 text-center">({result.weeks} weeks and {result.days % 7} days)</div>
            {result.isPast && <div className="text-sm text-yellow-600 text-center">This event has already passed</div>}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
