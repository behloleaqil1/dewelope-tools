'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

export default function LiturgicalCalendarCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [output, setOutput] = useState('');

  const computeEaster = (year: number): Date => {
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
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  };

  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const calculate = () => {
    if (!dateInput) {
      setOutput('Please select a date.');
      return;
    }

    const date = new Date(dateInput + 'T00:00:00');
    const year = date.getFullYear();

    const easter = computeEaster(year);
    const ashWednesday = addDays(easter, -46);
    const palmSunday = addDays(easter, -7);
    const ascension = addDays(easter, 39);
    const pentecost = addDays(easter, 49);
    const trinitySunday = addDays(easter, 56);

    const adventStart = (() => {
      const christmas = new Date(year, 11, 25);
      const dayOfWeek = christmas.getDay();
      const daysToSunday = dayOfWeek === 0 ? 7 : dayOfWeek;
      return new Date(year, 11, 25 - daysToSunday - 21);
    })();

    const _prevAdventStart = (() => {
      const christmas = new Date(year - 1, 11, 25);
      const dayOfWeek = christmas.getDay();
      const daysToSunday = dayOfWeek === 0 ? 7 : dayOfWeek;
      return new Date(year - 1, 11, 25 - daysToSunday - 21);
    })();

    const christmas = new Date(year, 11, 25);
    const epiphany = new Date(year, 0, 6);
    const baptismOfLord = (() => {
      const jan6 = new Date(year, 0, 6);
      const day = jan6.getDay();
      return day === 0 ? new Date(year, 0, 7) : new Date(year, 0, 6 + (7 - day));
    })();

    let season = '';
    let liturgicalColor = '';

    if (date >= adventStart || date < new Date(year, 0, 1)) {
      season = 'Advent';
      liturgicalColor = 'Violet/Purple';
    } else if (date >= new Date(year, 11, 25) || (date.getMonth() === 0 && date.getDate() <= baptismOfLord.getDate() && date.getMonth() <= baptismOfLord.getMonth())) {
      season = 'Christmas';
      liturgicalColor = 'White/Gold';
    } else if (date >= ashWednesday && date < palmSunday) {
      season = 'Lent';
      liturgicalColor = 'Violet/Purple';
    } else if (date >= palmSunday && date < easter) {
      season = 'Holy Week';
      liturgicalColor = 'Red (Palm Sunday/Good Friday), Violet';
    } else if (date.getTime() === easter.getTime()) {
      season = 'Easter Sunday';
      liturgicalColor = 'White/Gold';
    } else if (date > easter && date <= pentecost) {
      season = 'Easter';
      liturgicalColor = 'White/Gold';
    } else if (date.getTime() === pentecost.getTime()) {
      season = 'Pentecost';
      liturgicalColor = 'Red';
    } else {
      season = 'Ordinary Time';
      liturgicalColor = 'Green';
    }

    const fmt = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

    const lines = [
      `=== Liturgical Calendar for ${fmt(date)} ===`,
      ``,
      `Season: ${season}`,
      `Liturgical Color: ${liturgicalColor}`,
      ``,
      `--- Key Dates (${year}) ---`,
      `Epiphany: ${fmt(epiphany)}`,
      `Baptism of the Lord: ${fmt(baptismOfLord)}`,
      `Ash Wednesday: ${fmt(ashWednesday)}`,
      `Palm Sunday: ${fmt(palmSunday)}`,
      `Easter Sunday: ${fmt(easter)}`,
      `Ascension: ${fmt(ascension)}`,
      `Pentecost: ${fmt(pentecost)}`,
      `Trinity Sunday: ${fmt(trinitySunday)}`,
      `First Sunday of Advent: ${fmt(adventStart)}`,
      `Christmas: ${fmt(christmas)}`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-input`} className="block text-sm font-medium text-gray-700 mb-1">
          Select a Date
        </label>
        <input
          id={`${toolId}-input`}
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="input-field mb-3"
          aria-label={`Date input for ${toolName}`}
        />

        <button onClick={calculate} className="btn-primary">Calculate Season</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Results</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
