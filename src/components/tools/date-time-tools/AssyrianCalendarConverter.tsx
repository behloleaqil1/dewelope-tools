'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AssyrianCalendarConverter - Convert Gregorian dates to the Assyrian calendar.
 * The Assyrian calendar begins from 4750 BCE (year 1), so Assyrian year = Gregorian year + 4750.
 */
export default function AssyrianCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const assyrianMonths = [
    'Nisan', 'Iyyar', 'Khziran', 'Tammuz', 'Ab', 'Elul',
    'Tishrin I', 'Tishrin II', 'Kanun I', 'Kanun II', 'Shvat', 'Adar'
  ];

  const gregorianMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    // Validate date
    const date = new Date(y, m - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
      setOutput('Invalid date. Please check the day for the given month.');
      return;
    }

    // Assyrian calendar epoch: 4750 BCE
    const assyrianYear = y + 4750;

    // The Assyrian new year (Kha b-Nisan) starts April 1
    // Determine Assyrian month based on approximate mapping
    // Nisan starts ~April 1, each month ~30 days
    const dayOfYear = Math.floor((date.getTime() - new Date(y, 0, 1).getTime()) / 86400000) + 1;
    
    // April 1 is approximately day 91 (or 92 in leap year)
    const isLeap = (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    const nisanStart = isLeap ? 92 : 91;
    
    let assyrianDayOfYear = dayOfYear - nisanStart;
    let displayYear = assyrianYear;
    if (assyrianDayOfYear < 0) {
      assyrianDayOfYear += isLeap ? 366 : 365;
      displayYear = assyrianYear - 1;
    }

    const assyrianMonthIndex = Math.floor(assyrianDayOfYear / 30) % 12;
    const assyrianDay = (assyrianDayOfYear % 30) + 1;

    const lines = [
      '=== Assyrian Calendar Conversion ===',
      '',
      '--- Gregorian Date ---',
      `${gregorianMonths[m - 1]} ${d}, ${y} CE`,
      '',
      '--- Assyrian Date ---',
      `${assyrianDay} ${assyrianMonths[assyrianMonthIndex]}, ${displayYear}`,
      `Year: ${displayYear} (Assyrian Era)`,
      `Month: ${assyrianMonths[assyrianMonthIndex]} (Month ${assyrianMonthIndex + 1})`,
      `Day: ${assyrianDay}`,
      '',
      '--- Calendar Information ---',
      `Assyrian New Year (Kha b-Nisan): April 1`,
      `Epoch: 4750 BCE (beginning of Assyrian civilization)`,
      `Gregorian year ${y} = Assyrian year ${assyrianYear}`,
      '',
      '--- Assyrian Months ---',
      ...assyrianMonths.map((name, i) => `  ${i + 1}. ${name}${i === assyrianMonthIndex ? ' ← current' : ''}`),
      '',
      '--- Notes ---',
      '• The Assyrian calendar is a solar calendar with 12 months',
      '• Each month has approximately 30 days',
      '• Kha b-Nisan (Assyrian New Year) is celebrated on April 1',
      '• The calendar commemorates the founding of Assyrian civilization',
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} className="input-field" aria-label={`Year for ${toolName}`} />
          </div>
          <div>
            <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select id={`${toolId}-month`} value={month} onChange={(e) => setMonth(e.target.value)} className="input-field" aria-label="Month">
              {gregorianMonths.map((name, i) => (
                <option key={i} value={i + 1}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} className="input-field" aria-label="Day" />
          </div>
        </div>
        <button onClick={convert} className="btn-primary mt-4">Convert to Assyrian Calendar</button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Assyrian Calendar Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-lg">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
