'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * IsoWeekDateConverter - Convert between ISO week dates (2024-W01-1) and calendar dates.
 * Supports both directions: calendar date to ISO week date and vice versa.
 */
export default function IsoWeekDateConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [mode, setMode] = useState<'toIso' | 'fromIso'>('toIso');
  const [calendarDate, setCalendarDate] = useState('');
  const [isoYear, setIsoYear] = useState('');
  const [isoWeek, setIsoWeek] = useState('');
  const [isoDay, setIsoDay] = useState('1');
  const [result, setResult] = useState<{ isoWeekDate: string; calendarDate: string; dayName: string } | null>(null);
  const [error, setError] = useState('');

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getISOWeekDate = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return { year: d.getUTCFullYear(), week: weekNo, day: dayNum };
  };

  const isoWeekToDate = (year: number, week: number, day: number): Date => {
    const jan4 = new Date(Date.UTC(year, 0, 4));
    const jan4Day = jan4.getUTCDay() || 7;
    const mondayWeek1 = new Date(jan4.getTime() - (jan4Day - 1) * 86400000);
    const targetDate = new Date(mondayWeek1.getTime() + ((week - 1) * 7 + (day - 1)) * 86400000);
    return targetDate;
  };

  const convert = () => {
    setError('');
    setResult(null);

    if (mode === 'toIso') {
      if (!calendarDate) { setError('Please select a date'); return; }
      const date = new Date(calendarDate + 'T00:00:00');
      if (isNaN(date.getTime())) { setError('Invalid date'); return; }
      const iso = getISOWeekDate(date);
      const weekStr = iso.week.toString().padStart(2, '0');
      setResult({
        isoWeekDate: `${iso.year}-W${weekStr}-${iso.day}`,
        calendarDate: calendarDate,
        dayName: dayNames[iso.day - 1],
      });
    } else {
      const y = parseInt(isoYear);
      const w = parseInt(isoWeek);
      const d = parseInt(isoDay);
      if (isNaN(y) || y < 1 || y > 9999) { setError('Invalid year'); return; }
      if (isNaN(w) || w < 1 || w > 53) { setError('Week must be 1-53'); return; }
      if (isNaN(d) || d < 1 || d > 7) { setError('Day must be 1-7'); return; }

      const date = isoWeekToDate(y, w, d);
      const dateStr = date.toISOString().split('T')[0];
      const weekStr = w.toString().padStart(2, '0');
      setResult({
        isoWeekDate: `${y}-W${weekStr}-${d}`,
        calendarDate: dateStr,
        dayName: dayNames[d - 1],
      });
    }
  };

  const copyText = result
    ? `ISO Week Date: ${result.isoWeekDate}\nCalendar Date: ${result.calendarDate}\nDay: ${result.dayName}`
    : '';

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="mb-3">
          <label htmlFor={`${toolId}-mode`} className="block text-sm font-medium text-gray-700 mb-1">
            Conversion Direction
          </label>
          <select id={`${toolId}-mode`} value={mode} onChange={(e) => { setMode(e.target.value as 'toIso' | 'fromIso'); setResult(null); setError(''); }} aria-label={`Conversion mode for ${toolName}`} className="input-field">
            <option value="toIso">Calendar Date → ISO Week Date</option>
            <option value="fromIso">ISO Week Date → Calendar Date</option>
          </select>
        </div>

        {mode === 'toIso' ? (
          <div>
            <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
              Calendar Date
            </label>
            <input
              id={`${toolId}-date`}
              type="date"
              value={calendarDate}
              onChange={(e) => setCalendarDate(e.target.value)}
              aria-label={`Calendar date for ${toolName}`}
              className="input-field"
            />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input id={`${toolId}-year`} type="text" inputMode="numeric" value={isoYear} onChange={(e) => setIsoYear(e.target.value)} placeholder="2024" aria-label={`ISO year for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-week`} className="block text-sm font-medium text-gray-700 mb-1">Week (1-53)</label>
              <input id={`${toolId}-week`} type="text" inputMode="numeric" value={isoWeek} onChange={(e) => setIsoWeek(e.target.value)} placeholder="1" aria-label={`ISO week for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day (1-7)</label>
              <select id={`${toolId}-day`} value={isoDay} onChange={(e) => setIsoDay(e.target.value)} aria-label={`ISO day for ${toolName}`} className="input-field">
                {dayNames.map((name, i) => <option key={i + 1} value={i + 1}>{i + 1} - {name}</option>)}
              </select>
            </div>
          </div>
        )}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </InputArea>

      <button onClick={convert} aria-label="Convert Date" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={result !== null}>
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600 font-mono">{result.isoWeekDate}</div>
                <div className="text-xs text-gray-500 mt-1">ISO Week Date</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600 font-mono">{result.calendarDate}</div>
                <div className="text-xs text-gray-500 mt-1">Calendar Date</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-bold text-blue-600">{result.dayName}</div>
                <div className="text-xs text-gray-500 mt-1">Day of Week</div>
              </div>
            </div>
            <CopyToClipboard text={copyText} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
