'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * TimezoneMeetingPlanner - Find overlapping work hours across timezones.
 */
export default function TimezoneMeetingPlanner({ toolId, toolName }: { toolId: string; toolName: string }) {
  const timezones = [
    { label: 'US Pacific (PT)', offset: -8 },
    { label: 'US Mountain (MT)', offset: -7 },
    { label: 'US Central (CT)', offset: -6 },
    { label: 'US Eastern (ET)', offset: -5 },
    { label: 'UTC / GMT', offset: 0 },
    { label: 'UK (GMT/BST)', offset: 0 },
    { label: 'Central Europe (CET)', offset: 1 },
    { label: 'Eastern Europe (EET)', offset: 2 },
    { label: 'India (IST)', offset: 5.5 },
    { label: 'China / Singapore (CST)', offset: 8 },
    { label: 'Japan / Korea (JST)', offset: 9 },
    { label: 'Australia Eastern (AEST)', offset: 10 },
    { label: 'New Zealand (NZST)', offset: 12 },
  ];

  const [selectedTimezones, setSelectedTimezones] = useState<number[]>([0, 4]);
  const [workStart, setWorkStart] = useState('9');
  const [workEnd, setWorkEnd] = useState('17');

  const addTimezone = (idx: number) => {
    if (!selectedTimezones.includes(idx)) {
      setSelectedTimezones([...selectedTimezones, idx]);
    }
  };

  const removeTimezone = (idx: number) => {
    setSelectedTimezones(selectedTimezones.filter(i => i !== idx));
  };

  const findOverlap = () => {
    if (selectedTimezones.length < 2) return null;

    const start = parseInt(workStart);
    const end = parseInt(workEnd);
    if (isNaN(start) || isNaN(end) || start >= end) return null;

    const overlapHours: number[] = [];

    for (let utcHour = 0; utcHour < 24; utcHour++) {
      let allAvailable = true;
      for (const tzIdx of selectedTimezones) {
        const tz = timezones[tzIdx];
        const localHour = ((utcHour + tz.offset) % 24 + 24) % 24;
        if (localHour < start || localHour >= end) {
          allAvailable = false;
          break;
        }
      }
      if (allAvailable) overlapHours.push(utcHour);
    }

    return overlapHours;
  };

  const overlap = findOverlap();

  const formatHour = (h: number): string => {
    const hour12 = h % 12 || 12;
    const ampm = h < 12 ? 'AM' : 'PM';
    return `${hour12}:00 ${ampm}`;
  };

  const getLocalTimes = (utcHour: number) => {
    return selectedTimezones.map(tzIdx => {
      const tz = timezones[tzIdx];
      const localHour = ((utcHour + tz.offset) % 24 + 24) % 24;
      return { label: tz.label, time: formatHour(localHour) };
    });
  };

  const copyText = overlap && overlap.length > 0
    ? `Overlapping Work Hours:\n${overlap.map(h => `UTC ${formatHour(h)} → ${getLocalTimes(h).map(t => `${t.label}: ${t.time}`).join(', ')}`).join('\n')}`
    : overlap && overlap.length === 0 ? 'No overlapping work hours found.' : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="space-y-4">
        <InputArea>
          <label htmlFor={`${toolId}-add-tz`} className="block text-sm font-medium text-gray-700 mb-1">
            Add Timezone
          </label>
          <select
            id={`${toolId}-add-tz`}
            onChange={(e) => { addTimezone(parseInt(e.target.value)); e.target.value = ''; }}
            defaultValue=""
            aria-label={`Add timezone for ${toolName}`}
            className="input-field"
          >
            <option value="" disabled>-- Select timezone to add --</option>
            {timezones.map((tz, idx) => (
              <option key={idx} value={idx} disabled={selectedTimezones.includes(idx)}>
                {tz.label} (UTC{tz.offset >= 0 ? '+' : ''}{tz.offset})
              </option>
            ))}
          </select>
        </InputArea>

        {selectedTimezones.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTimezones.map(idx => (
              <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700">
                {timezones[idx].label}
                <button onClick={() => removeTimezone(idx)} className="text-blue-400 hover:text-blue-600 ml-1" aria-label={`Remove ${timezones[idx].label}`}>×</button>
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <InputArea>
            <label htmlFor={`${toolId}-start`} className="block text-sm font-medium text-gray-700 mb-1">
              Work Start Hour
            </label>
            <select
              id={`${toolId}-start`}
              value={workStart}
              onChange={(e) => setWorkStart(e.target.value)}
              aria-label={`Work start hour for ${toolName}`}
              className="input-field"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{formatHour(i)}</option>
              ))}
            </select>
          </InputArea>

          <InputArea>
            <label htmlFor={`${toolId}-end`} className="block text-sm font-medium text-gray-700 mb-1">
              Work End Hour
            </label>
            <select
              id={`${toolId}-end`}
              value={workEnd}
              onChange={(e) => setWorkEnd(e.target.value)}
              aria-label={`Work end hour for ${toolName}`}
              className="input-field"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{formatHour(i)}</option>
              ))}
            </select>
          </InputArea>
        </div>
      </div>

      <OutputArea hasContent={overlap !== null}>
        {overlap !== null && (
          <div className="space-y-3">
            {overlap.length > 0 ? (
              <>
                <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{overlap.length} overlapping hour{overlap.length !== 1 ? 's' : ''} found</div>
                </div>
                <div className="space-y-2">
                  {overlap.map(utcHour => (
                    <div key={utcHour} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="text-sm font-medium text-gray-700 mb-1">UTC {formatHour(utcHour)}</div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                        {getLocalTimes(utcHour).map((t, i) => (
                          <span key={i}><span className="font-medium">{t.label}:</span> {t.time}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-lg font-bold text-red-600">No overlapping work hours</div>
                <div className="text-sm text-gray-600 mt-1">Try adjusting work hours or selecting different timezones.</div>
              </div>
            )}
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
