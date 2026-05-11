'use client';

import { useState, useEffect } from 'react';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

function getEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

function getNthDayOfMonth(year: number, month: number, dayOfWeek: number, n: number): Date {
  const first = new Date(year, month, 1);
  let day = 1 + ((dayOfWeek - first.getDay() + 7) % 7);
  day += (n - 1) * 7;
  return new Date(year, month, day);
}

function getHolidays(year: number) {
  return [
    { name: "New Year's Day", date: new Date(year, 0, 1) },
    { name: "Valentine's Day", date: new Date(year, 1, 14) },
    { name: "St. Patrick's Day", date: new Date(year, 2, 17) },
    { name: 'Easter Sunday', date: getEaster(year) },
    { name: "Mother's Day", date: getNthDayOfMonth(year, 4, 0, 2) },
    { name: "Father's Day", date: getNthDayOfMonth(year, 5, 0, 3) },
    { name: 'Independence Day (US)', date: new Date(year, 6, 4) },
    { name: 'Halloween', date: new Date(year, 9, 31) },
    { name: 'Thanksgiving (US)', date: getNthDayOfMonth(year, 10, 4, 4) },
    { name: 'Christmas Eve', date: new Date(year, 11, 24) },
    { name: 'Christmas Day', date: new Date(year, 11, 25) },
    { name: "New Year's Eve", date: new Date(year, 11, 31) },
  ];
}

/**
 * HolidayCountdown - Countdown to major holidays (Christmas, New Year, etc.)
 * Shows days, hours, minutes, seconds remaining for each upcoming holiday.
 */
export default function HolidayCountdown({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [countdowns, setCountdowns] = useState<{ name: string; date: Date; days: number; hours: number; minutes: number; seconds: number; isPast: boolean }[]>([]);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const year = now.getFullYear();

      const allHolidays = [...getHolidays(year), ...getHolidays(year + 1)];

      const upcoming = allHolidays
        .map((h) => {
          const diff = h.date.getTime() - now.getTime();
          const isPast = diff < 0;
          const absDiff = Math.abs(diff);
          const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);
          return { ...h, days, hours, minutes, seconds, isPast };
        })
        .filter((h) => !h.isPast)
        .sort((a, b) => (a.days * 86400 + a.hours * 3600 + a.minutes * 60 + a.seconds) - (b.days * 86400 + b.hours * 3600 + b.minutes * 60 + b.seconds))
        .slice(0, 8);

      setCountdowns(upcoming);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyText = countdowns
    .map((h) => `${h.name}: ${h.days}d ${h.hours}h ${h.minutes}m ${h.seconds}s`)
    .join('\n');

  return (
    <div className="space-y-4" data-tool-id={toolId} aria-label={toolName}>
      <p className="text-sm text-gray-600">Live countdown to upcoming major holidays. Updates every second.</p>

      <OutputArea hasContent={countdowns.length > 0}>
        {countdowns.length > 0 && (
          <div className="space-y-3">
            {countdowns.map((h, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800">{h.name}</span>
                  <span className="text-xs text-gray-500">
                    {h.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-xl font-bold text-blue-600">{h.days}</div>
                    <div className="text-xs text-gray-500">days</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">{h.hours}</div>
                    <div className="text-xs text-gray-500">hours</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">{h.minutes}</div>
                    <div className="text-xs text-gray-500">min</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">{h.seconds}</div>
                    <div className="text-xs text-gray-500">sec</div>
                  </div>
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
