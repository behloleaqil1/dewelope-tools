'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * HebrewCalendarConverter - Convert between Gregorian and Hebrew calendar dates.
 * Uses astronomical calculations to convert dates to/from the Hebrew (Jewish) calendar.
 */
export default function HebrewCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const hebrewMonths = [
    'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar',
    'Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul',
  ];

  const hebrewMonthsLeap = [
    'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar I',
    'Adar II', 'Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul',
  ];

  const isHebrewLeapYear = (y: number): boolean => {
    return ((7 * y + 1) % 19) < 7;
  };

  const hebrewElapsedDays = (y: number): number => {
    const monthsElapsed = Math.floor((235 * y - 234) / 19);
    const partsElapsed = 12084 + 13753 * monthsElapsed;
    const hoursElapsed = Math.floor(partsElapsed / 25920);
    const day = 1 + 29 * monthsElapsed + hoursElapsed;
    const parts = partsElapsed % 25920;

    let altDay = day;
    if (parts >= 19440 || (day % 7 === 2 && parts >= 9924 && !isHebrewLeapYear(y)) ||
        (day % 7 === 1 && parts >= 16789 && isHebrewLeapYear(y - 1))) {
      altDay = day + 1;
    }

    if (altDay % 7 === 0 || altDay % 7 === 3 || altDay % 7 === 5) {
      altDay += 1;
    }

    return altDay;
  };

  const hebrewYearDays = (y: number): number => {
    return hebrewElapsedDays(y + 1) - hebrewElapsedDays(y);
  };

  const gregorianToJdn = (y: number, m: number, d: number): number => {
    const a = Math.floor((14 - m) / 12);
    const yAdj = y + 4800 - a;
    const mAdj = m + 12 * a - 3;
    return d + Math.floor((153 * mAdj + 2) / 5) + 365 * yAdj + Math.floor(yAdj / 4) - Math.floor(yAdj / 100) + Math.floor(yAdj / 400) - 32045;
  };

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    // Approximate Hebrew year
    const jdn = gregorianToJdn(y, m, d);
    const hebrewEpoch = 347995; // JDN of 1 Tishrei 1
    let hYear = Math.floor((jdn - hebrewEpoch) / 365.25) + 1;

    // Adjust
    while (hebrewElapsedDays(hYear) + hebrewEpoch > jdn) hYear--;
    while (hebrewElapsedDays(hYear + 1) + hebrewEpoch <= jdn) hYear++;

    const yearLength = hebrewYearDays(hYear);
    const startJdn = hebrewElapsedDays(hYear) + hebrewEpoch;
    const dayOfYear = jdn - startJdn;

    const leap = isHebrewLeapYear(hYear);
    const months = leap ? hebrewMonthsLeap : hebrewMonths;

    // Month lengths
    const monthLengths: number[] = [];
    if (leap) {
      monthLengths.push(30, yearLength === 385 ? 30 : 29, yearLength >= 384 ? 30 : 29, 29, 30, 30, 29, 30, 29, 30, 29, 30, 29);
    } else {
      monthLengths.push(30, yearLength === 355 ? 30 : 29, yearLength >= 354 ? 30 : 29, 29, 30, 29, 30, 29, 30, 29, 30, 29);
    }

    let hMonth = 0;
    let hDay = dayOfYear;
    for (let i = 0; i < monthLengths.length; i++) {
      if (hDay < monthLengths[i]) {
        hMonth = i;
        break;
      }
      hDay -= monthLengths[i];
    }
    hDay += 1;

    const result = [
      `Gregorian Date: ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      '',
      `Hebrew Date:`,
      `  Day: ${hDay}`,
      `  Month: ${months[hMonth]}`,
      `  Year: ${hYear}`,
      `  Full: ${hDay} ${months[hMonth]} ${hYear}`,
      '',
      `Year Info:`,
      `  Hebrew Year Length: ${yearLength} days`,
      `  Leap Year: ${leap ? 'Yes (13 months)' : 'No (12 months)'}`,
    ].join('\n');

    setOutput(result);
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <div className="grid grid-cols-3 gap-3">
        <InputArea>
          <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <input
            id={`${toolId}-year`}
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2024"
            aria-label={`Year for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <input
            id={`${toolId}-month`}
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="1"
            aria-label={`Month for ${toolName}`}
            className="input-field"
          />
        </InputArea>
        <InputArea>
          <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
          <input
            id={`${toolId}-day`}
            type="number"
            min="1"
            max="31"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            placeholder="1"
            aria-label={`Day for ${toolName}`}
            className="input-field"
          />
        </InputArea>
      </div>

      <button onClick={() => { const now = new Date(); setYear(now.getFullYear().toString()); setMonth((now.getMonth() + 1).toString()); setDay(now.getDate().toString()); }} className="text-sm text-blue-600 hover:text-blue-800">
        Use Today
      </button>

      <button onClick={convert} aria-label="Convert to Hebrew calendar" className="btn-primary">
        Convert
      </button>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Hebrew Calendar Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-4 rounded-lg border border-gray-200">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
