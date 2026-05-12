'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * BengaliCalendarConverter - Convert Gregorian dates to the Bengali (Bangla) calendar.
 * The Bengali calendar (Bangabda) starts from April 14 (or 15 in leap years).
 */
export default function BengaliCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [dateInput, setDateInput] = useState('');
  const [output, setOutput] = useState('');

  const bengaliMonths = [
    'Boishakh', 'Jyoishtho', 'Asharh', 'Shrabon', 'Bhadro', 'Ashwin',
    'Kartik', 'Ogrohayon', 'Poush', 'Magh', 'Falgun', 'Choitro'
  ];

  const bengaliDays = ['Robibar', 'Sombar', 'Mongolbar', 'Budhbar', 'Brihoshpotibar', 'Shukrobar', 'Shonibar'];

  // Days in each Bengali month (standard year)
  const monthDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];

  function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  function convertToBengali(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed
    const day = date.getDate();
    const dayOfWeek = date.getDay();

    // Bengali New Year starts April 14 (or 15 in leap year)
    const newYearDay = isLeapYear(year) ? 14 : 14;
    const newYearMonth = 3; // April (0-indexed)

    // Calculate Bengali year
    let bengaliYear: number;
    if (month > newYearMonth || (month === newYearMonth && day >= newYearDay)) {
      bengaliYear = year - 593;
    } else {
      bengaliYear = year - 594;
    }

    // Calculate day of Bengali year
    let startDate: Date;
    if (month > newYearMonth || (month === newYearMonth && day >= newYearDay)) {
      startDate = new Date(year, newYearMonth, newYearDay);
    } else {
      startDate = new Date(year - 1, newYearMonth, newYearDay);
    }

    const diffMs = date.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Find Bengali month and day
    let remaining = diffDays;
    let bengaliMonth = 0;
    for (let i = 0; i < 12; i++) {
      const daysInMonth = monthDays[i];
      if (remaining < daysInMonth) {
        bengaliMonth = i;
        break;
      }
      remaining -= daysInMonth;
    }
    const bengaliDay = remaining + 1;

    return {
      year: bengaliYear,
      month: bengaliMonth,
      day: bengaliDay,
      dayOfWeek,
      monthName: bengaliMonths[bengaliMonth],
      dayName: bengaliDays[dayOfWeek],
    };
  }

  function handleConvert() {
    if (!dateInput) {
      setOutput('');
      return;
    }

    const date = new Date(dateInput + 'T00:00:00');
    if (isNaN(date.getTime())) {
      setOutput('Invalid date.');
      return;
    }

    const result = convertToBengali(date);
    const lines = [
      `Gregorian: ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
      ``,
      `--- Bengali Calendar (Bangabda) ---`,
      `Date: ${result.day} ${result.monthName} ${result.year}`,
      `Day: ${result.dayName}`,
      `Month: ${result.monthName} (Month ${result.month + 1} of 12)`,
      `Year: ${result.year} BS (Bangabda/Bengali San)`,
      ``,
      `Note: The Bengali calendar starts on Pohela Boishakh (April 14).`,
    ];
    setOutput(lines.join('\n'));
  }

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <label htmlFor={`${toolId}-date`} className="block text-sm font-medium text-gray-700 mb-1">
          Select a Gregorian Date
        </label>
        <input
          id={`${toolId}-date`}
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          aria-label={`Date input for ${toolName}`}
          className="input-field"
        />
        <button onClick={handleConvert} className="btn-primary mt-2">
          Convert to Bengali Calendar
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Bengali Calendar Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
