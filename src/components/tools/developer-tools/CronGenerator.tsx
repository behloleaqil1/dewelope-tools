'use client';

import { useState } from 'react';
import { ToolEngineProps } from '@/types';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';
import { buildCronExpression } from '@/lib/developer-tools';

/**
 * CronGenerator - Build cron expressions from dropdowns with human-readable descriptions.
 */
export default function CronGenerator({ toolId }: ToolEngineProps) {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');

  const result = buildCronExpression({ minute, hour, dayOfMonth, month, dayOfWeek });

  const minuteOptions = ['*', '*/5', '*/10', '*/15', '*/30', '0', '15', '30', '45'];
  const hourOptions = ['*', '*/2', '*/4', '*/6', '*/12', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  const dayOfMonthOptions = ['*', '1', '2', '3', '4', '5', '10', '15', '20', '25', '28', '*/2', '*/5'];
  const monthOptions = ['*', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const dayOfWeekOptions = ['*', '0', '1', '2', '3', '4', '5', '6'];
  const dayNames = ['*', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div>
          <label htmlFor={`${toolId}-minute`} className="block text-sm font-medium text-gray-700 mb-1">
            Minute
          </label>
          <select
            id={`${toolId}-minute`}
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            aria-label="Cron minute value"
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
          >
            {minuteOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-hour`} className="block text-sm font-medium text-gray-700 mb-1">
            Hour
          </label>
          <select
            id={`${toolId}-hour`}
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            aria-label="Cron hour value"
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
          >
            {hourOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-dom`} className="block text-sm font-medium text-gray-700 mb-1">
            Day (Month)
          </label>
          <select
            id={`${toolId}-dom`}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            aria-label="Cron day of month value"
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
          >
            {dayOfMonthOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">
            Month
          </label>
          <select
            id={`${toolId}-month`}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            aria-label="Cron month value"
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
          >
            {monthOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${toolId}-dow`} className="block text-sm font-medium text-gray-700 mb-1">
            Day (Week)
          </label>
          <select
            id={`${toolId}-dow`}
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            aria-label="Cron day of week value"
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
          >
            {dayOfWeekOptions.map((opt, i) => <option key={opt} value={opt}>{dayNames[i]} ({opt})</option>)}
          </select>
        </div>
      </div>

      <OutputArea hasContent={true}>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Cron Expression</p>
            <code className="block text-lg font-mono text-gray-800 p-3 bg-gray-50 rounded-lg select-all">
              {result.expression}
            </code>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Description</p>
            <p className="text-sm text-gray-700">{result.description}</p>
          </div>
          <CopyToClipboard text={result.expression} />
        </div>
      </OutputArea>
    </div>
  );
}
