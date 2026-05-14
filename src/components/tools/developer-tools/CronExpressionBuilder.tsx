'use client';

import { useState } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * CronExpressionBuilder - Build cron expressions from schedule selections with human-readable output.
 */
export default function CronExpressionBuilder({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');

  const describeCron = (): string => {
    const parts: string[] = [];
    if (minute === '*' && hour === '*') parts.push('Every minute');
    else if (minute !== '*' && hour === '*') parts.push(`At minute ${minute} of every hour`);
    else if (minute === '0' && hour !== '*') parts.push(`At ${hour}:00`);
    else if (minute !== '*' && hour !== '*') parts.push(`At ${hour}:${minute.padStart(2, '0')}`);
    else parts.push(`At minute ${minute}`);

    if (dayOfMonth !== '*') parts.push(`on day ${dayOfMonth} of the month`);
    if (month !== '*') {
      const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      parts.push(`in ${months[parseInt(month)] || month}`);
    }
    if (dayOfWeek !== '*') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      parts.push(`on ${days[parseInt(dayOfWeek)] || dayOfWeek}`);
    }
    return parts.join(' ');
  };

  const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  const description = describeCron();

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-5 gap-2">
        <div>
          <label htmlFor={`${toolId}-min`} className="block text-xs font-medium text-gray-700 mb-1">Minute</label>
          <input id={`${toolId}-min`} type="text" value={minute} onChange={(e) => setMinute(e.target.value)} placeholder="*" aria-label={`Minute for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-hr`} className="block text-xs font-medium text-gray-700 mb-1">Hour</label>
          <input id={`${toolId}-hr`} type="text" value={hour} onChange={(e) => setHour(e.target.value)} placeholder="*" aria-label={`Hour for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-dom`} className="block text-xs font-medium text-gray-700 mb-1">Day (M)</label>
          <input id={`${toolId}-dom`} type="text" value={dayOfMonth} onChange={(e) => setDayOfMonth(e.target.value)} placeholder="*" aria-label={`Day of month for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-mon`} className="block text-xs font-medium text-gray-700 mb-1">Month</label>
          <input id={`${toolId}-mon`} type="text" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="*" aria-label={`Month for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label htmlFor={`${toolId}-dow`} className="block text-xs font-medium text-gray-700 mb-1">Day (W)</label>
          <input id={`${toolId}-dow`} type="text" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)} placeholder="*" aria-label={`Day of week for ${toolName}`} className="w-full p-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      <div className="text-xs text-gray-500">
        Values: * (any), number, range (1-5), list (1,3,5), step (*/5)
      </div>
      <OutputArea hasContent={true}>
        <div className="space-y-2">
          <div className="font-mono text-lg text-gray-800 bg-gray-50 p-3 rounded-lg text-center">{expression}</div>
          <p className="text-sm text-gray-600">{description}</p>
          <CopyToClipboard text={expression} />
        </div>
      </OutputArea>
    </div>
  );
}
