'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * GujaratiCalendarConverter - Convert Gregorian dates to Gujarati calendar.
 * Shows Vikram Samvat year, Gujarati month name, and tithi information.
 */
export default function GujaratiCalendarConverter({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const gujaratiMonths = [
    'Kartik', 'Magshar', 'Posh', 'Maha', 'Fagan', 'Chaitra',
    'Vaishakh', 'Jeth', 'Ashadh', 'Shravan', 'Bhadarvo', 'Aso'
  ];

  const gujaratiMonthsScript = [
    'કારતક', 'માગશર', 'પોષ', 'મહા', 'ફાગણ', 'ચૈત્ર',
    'વૈશાખ', 'જેઠ', 'અષાઢ', 'શ્રાવણ', 'ભાદરવો', 'આસો'
  ];

  const gujaratiDays = ['રવિવાર', 'સોમવાર', 'મંગળવાર', 'બુધવાર', 'ગુરુવાર', 'શુક્રવાર', 'શનિવાર'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

    // Vikram Samvat is approximately 56-57 years ahead of Gregorian
    // Gujarati new year starts around Kartik (Oct/Nov)
    const vikramYear = y + 56 + (m >= 11 ? 1 : 0);

    // Approximate Gujarati month mapping
    // Gujarati calendar is lunisolar; this is a simplified approximation
    const monthIndex = ((m + 6) % 12); // Offset to align with Kartik start
    const gujaratiMonth = gujaratiMonths[monthIndex];
    const gujaratiMonthScript = gujaratiMonthsScript[monthIndex];

    const dayOfWeek = date.getDay();

    // Approximate paksha (fortnight) - simplified
    // Based on lunar cycle approximation
    const dayOfYear = Math.floor((date.getTime() - new Date(y, 0, 1).getTime()) / 86400000);
    const lunarDay = ((dayOfYear * 29.5306 / 30) % 30) + 1;
    const paksha = lunarDay <= 15 ? 'Shukla Paksha (શુક્લ પક્ષ)' : 'Krishna Paksha (કૃષ્ણ પક્ષ)';
    const tithi = Math.floor(lunarDay <= 15 ? lunarDay : lunarDay - 15);

    const lines = [
      `=== Gujarati Calendar Conversion ===`,
      ``,
      `Gregorian Date: ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      `Day: ${dayNames[dayOfWeek]} (${gujaratiDays[dayOfWeek]})`,
      ``,
      `Vikram Samvat Year: ${vikramYear}`,
      `Gujarati Month: ${gujaratiMonth} (${gujaratiMonthScript})`,
      `Paksha: ${paksha}`,
      `Tithi: ${tithi}`,
      ``,
      `Note: This is an approximation. The Gujarati calendar`,
      `is lunisolar and exact dates require astronomical`,
      `calculations for the lunar phase.`,
    ];

    setOutput(lines.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} aria-label={`Year for ${toolName}`} className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} aria-label="Month" className="input-field" />
            </div>
            <div>
              <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} aria-label="Day" className="input-field" />
            </div>
          </div>
          <button onClick={convert} className="btn-primary w-full">
            Convert to Gujarati Calendar
          </button>
        </div>
      </InputArea>

      <OutputArea hasContent={!!output}>
        {output && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Gujarati Calendar Date</label>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800 bg-gray-50 p-3 rounded-md">{output}</pre>
            <CopyToClipboard text={output} />
          </div>
        )}
      </OutputArea>
    </div>
  );
}
