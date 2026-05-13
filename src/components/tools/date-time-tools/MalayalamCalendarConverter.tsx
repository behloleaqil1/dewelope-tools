'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * MalayalamCalendarConverter - Convert Gregorian dates to the Malayalam/Kollam calendar system.
 * Shows Malayalam year (Kollam Era), month name, and day.
 */
export default function MalayalamCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const malayalamMonths = [
    'Chingam', 'Kanni', 'Thulam', 'Vrischikam', 'Dhanu', 'Makaram',
    'Kumbham', 'Meenam', 'Medam', 'Edavam', 'Mithunam', 'Karkidakam'
  ];

  const malayalamDays = [
    'Njayar (Sunday)', 'Thingal (Monday)', 'Chovva (Tuesday)',
    'Budhan (Wednesday)', 'Vyazham (Thursday)', 'Velli (Friday)', 'Shani (Saturday)'
  ];

  const convert = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Please enter a valid date.');
      return;
    }

    const date = new Date(y, m - 1, d);
    if (date.getMonth() !== m - 1) {
      setOutput('Invalid date for the given month.');
      return;
    }

    // Kollam Era starts in 825 CE
    // Malayalam new year (Chingam 1) typically falls around August 17
    const kollamOffset = 825;

    // Approximate month boundaries for Malayalam calendar
    // Chingam: Aug 17 - Sep 16, Kanni: Sep 17 - Oct 16, etc.
    const monthStarts = [
      { month: 8, day: 17 },  // Chingam
      { month: 9, day: 17 },  // Kanni
      { month: 10, day: 17 }, // Thulam
      { month: 11, day: 16 }, // Vrischikam
      { month: 12, day: 16 }, // Dhanu
      { month: 1, day: 15 },  // Makaram
      { month: 2, day: 13 },  // Kumbham
      { month: 3, day: 15 },  // Meenam
      { month: 4, day: 14 },  // Medam
      { month: 5, day: 15 },  // Edavam
      { month: 6, day: 15 },  // Mithunam
      { month: 7, day: 17 },  // Karkidakam
    ];

    // Determine Malayalam month and day
    let malayalamMonth = 0;
    let malayalamDay = 0;

    for (let i = 0; i < 12; i++) {
      const start = monthStarts[i];
      const nextIdx = (i + 1) % 12;
      const end = monthStarts[nextIdx];

      const startDate = new Date(y, start.month - 1, start.day);
      let endDate: Date;
      if (end.month < start.month) {
        endDate = new Date(y + 1, end.month - 1, end.day);
      } else {
        endDate = new Date(y, end.month - 1, end.day);
      }

      if (date >= startDate && date < endDate) {
        malayalamMonth = i;
        malayalamDay = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        break;
      }
    }

    // If date is before Chingam 1 of current year, it belongs to previous Kollam year
    const chingamStart = new Date(y, 7, 17); // Aug 17
    let kollamYear: number;
    if (date >= chingamStart) {
      kollamYear = y - kollamOffset;
    } else {
      kollamYear = y - kollamOffset - 1;
    }

    const dayOfWeek = date.getDay();

    const results = [
      `=== Malayalam/Kollam Calendar ===`,
      ``,
      `Gregorian Date: ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      ``,
      `Malayalam Calendar:`,
      `  Kollam Year: ${kollamYear} ME (Malayalam Era)`,
      `  Month: ${malayalamMonths[malayalamMonth]}`,
      `  Day: ${malayalamDay}`,
      `  Day of Week: ${malayalamDays[dayOfWeek]}`,
      ``,
      `Full Date: ${malayalamDay} ${malayalamMonths[malayalamMonth]} ${kollamYear} ME`,
      ``,
      `Notes:`,
      `  - Kollam Era (ME) began in 825 CE`,
      `  - Malayalam New Year (Chingam 1) falls around August 17`,
      `  - The calendar is a solar sidereal calendar`,
      `  - Used in Kerala, India for traditional purposes`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              id={`${toolId}-year`}
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="input-field"
              aria-label={`Year for ${toolName}`}
            />
          </div>
          <div>
            <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              id={`${toolId}-month`}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="input-field"
              aria-label="Month"
            >
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map((name, i) => (
                <option key={i} value={i + 1}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">
              Day
            </label>
            <input
              id={`${toolId}-day`}
              type="number"
              min="1"
              max="31"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="input-field"
              aria-label="Day"
            />
          </div>
        </div>
        <button
          onClick={convert}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Convert to Malayalam Calendar
        </button>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conversion Result</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 break-all bg-gray-50 p-4 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
