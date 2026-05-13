'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BerberCalendarConverter - Convert Gregorian dates to Berber/Amazigh calendar.
 * The Berber calendar (Yennayer) starts 950 years before the Gregorian calendar.
 */
export default function BerberCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const berberMonths = [
    { name: 'Yennayer', days: 31 },
    { name: 'Furar', days: 28 },
    { name: 'Meghres', days: 31 },
    { name: 'Yebrir', days: 30 },
    { name: 'Maggu', days: 31 },
    { name: 'Yunyu', days: 30 },
    { name: 'Yulyu', days: 31 },
    { name: 'Ghucht', days: 31 },
    { name: 'Chtember', days: 30 },
    { name: 'Tuber', days: 31 },
    { name: 'Wamber', days: 30 },
    { name: 'Dujember', days: 31 },
  ];

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    // The Berber calendar year starts on January 12 (Yennayer 1)
    // and is offset by 950 years from the Gregorian calendar
    const gregorianDate = new Date(y, m - 1, d);
    const yennayerStart = new Date(y, 0, 12); // January 12 of current year

    let berberYear: number;
    let berberMonth: number;
    let berberDay: number;

    if (gregorianDate >= yennayerStart) {
      // We are in the current Berber year
      berberYear = y + 950;
      const daysSinceYennayer = Math.floor((gregorianDate.getTime() - yennayerStart.getTime()) / (1000 * 60 * 60 * 24));
      let remaining = daysSinceYennayer;
      berberMonth = 0;
      for (let i = 0; i < berberMonths.length; i++) {
        const daysInMonth = i === 1 && isLeapYear(y) ? 29 : berberMonths[i].days;
        if (remaining < daysInMonth) {
          berberMonth = i;
          berberDay = remaining + 1;
          break;
        }
        remaining -= daysInMonth;
      }
      berberDay = berberDay! || remaining + 1;
    } else {
      // We are still in the previous Berber year
      berberYear = y + 950 - 1;
      const prevYennayer = new Date(y - 1, 0, 12);
      const daysSinceYennayer = Math.floor((gregorianDate.getTime() - prevYennayer.getTime()) / (1000 * 60 * 60 * 24));
      let remaining = daysSinceYennayer;
      berberMonth = 0;
      berberDay = 1;
      for (let i = 0; i < berberMonths.length; i++) {
        const daysInMonth = i === 1 && isLeapYear(y - 1) ? 29 : berberMonths[i].days;
        if (remaining < daysInMonth) {
          berberMonth = i;
          berberDay = remaining + 1;
          break;
        }
        remaining -= daysInMonth;
      }
    }

    const lines: string[] = [];
    lines.push('=== Berber (Amazigh) Calendar Conversion ===');
    lines.push('');
    lines.push('--- Gregorian Date ---');
    lines.push(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    lines.push('');
    lines.push('--- Berber/Amazigh Date ---');
    lines.push(`Day: ${berberDay!}`);
    lines.push(`Month: ${berberMonths[berberMonth!].name} (Month ${berberMonth! + 1})`);
    lines.push(`Year: ${berberYear}`);
    lines.push(`Full Date: ${berberDay!} ${berberMonths[berberMonth!].name} ${berberYear}`);
    lines.push('');
    lines.push('--- Calendar Information ---');
    lines.push(`Yennayer (New Year): January 12 (Gregorian)`);
    lines.push(`Year Offset: Gregorian + 950 years`);
    lines.push(`Calendar Type: Solar agricultural calendar`);
    lines.push(`Origin: North African Amazigh/Berber tradition`);
    lines.push('');
    lines.push('--- Berber Months ---');
    berberMonths.forEach((bm, i) => {
      const marker = i === berberMonth! ? ' ◄ current' : '';
      lines.push(`  ${(i + 1).toString().padStart(2, ' ')}. ${bm.name.padEnd(10)} (${bm.days} days)${marker}`);
    });

    setOutput(lines.join('\n'));
  };

  const isLeapYear = (y: number): boolean => {
    return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} className="input-field" aria-label={`Year for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} className="input-field" aria-label="Month" />
            </div>
            <div>
              <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} className="input-field" aria-label="Day" />
            </div>
          </div>
          <button onClick={convert} className="btn-primary w-full">Convert to Berber Calendar</button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Berber Calendar Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-3 rounded">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
