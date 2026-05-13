'use client';

import { useState } from 'react';
import InputArea from '@/components/tools/InputArea';
import OutputArea from '@/components/tools/OutputArea';
import CopyToClipboard from '@/components/tools/CopyToClipboard';

/**
 * AnnoMundiCalculator - Convert Gregorian dates to Anno Mundi (Hebrew year from creation).
 * The Hebrew calendar epoch is 3761 BCE (year 1 AM).
 */
export default function AnnoMundiCalculator({ toolId, toolName }: { toolId: string; toolName: string }) {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());
  const [day, setDay] = useState(new Date().getDate().toString());
  const [output, setOutput] = useState('');

  const calculate = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) {
      setOutput('Error: Please enter a valid date.');
      return;
    }

    // Hebrew calendar epoch offset: 3761 years before 1 CE
    // The Hebrew new year (Rosh Hashanah) falls in September/October
    // Before Rosh Hashanah, we're still in the previous Hebrew year
    const hebrewYearOffset = 3761;

    // Approximate: if month is before September, Hebrew year = Gregorian + 3760
    // If September or later, Hebrew year = Gregorian + 3761
    let hebrewYear: number;
    if (m >= 9) {
      hebrewYear = y + hebrewYearOffset;
    } else {
      hebrewYear = y + hebrewYearOffset - 1;
    }

    // Calculate Hebrew calendar cycle info
    const metonic = ((hebrewYear - 1) % 19) + 1;
    const isLeapYear = [3, 6, 8, 11, 14, 17, 19].includes(metonic);

    // Day of week
    const date = new Date(y, m - 1, d);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

    // Julian Day Number for reference
    const a = Math.floor((14 - m) / 12);
    const yJdn = y + 4800 - a;
    const mJdn = m + 12 * a - 3;
    const jdn = d + Math.floor((153 * mJdn + 2) / 5) + 365 * yJdn + Math.floor(yJdn / 4) - Math.floor(yJdn / 100) + Math.floor(yJdn / 400) - 32045;

    const results = [
      `=== Anno Mundi Conversion ===`,
      ``,
      `Gregorian Date: ${dayOfWeek}, ${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      ``,
      `Hebrew Year (AM): ${hebrewYear}`,
      `Anno Mundi: Year ${hebrewYear} from Creation`,
      ``,
      `=== Hebrew Calendar Info ===`,
      `Metonic Cycle Position: ${metonic}/19`,
      `Hebrew Leap Year: ${isLeapYear ? 'Yes (13 months)' : 'No (12 months)'}`,
      ``,
      `=== Notes ===`,
      `• The Hebrew year begins at Rosh Hashanah (Sep/Oct)`,
      `• Before Rosh Hashanah, the Hebrew year is one less`,
      `• This is an approximation; exact conversion requires`,
      `  the full Hebrew calendar algorithm`,
      ``,
      `Julian Day Number: ${jdn}`,
    ];

    setOutput(results.join('\n'));
  };

  return (
    <div className="space-y-4" data-tool-id={toolId}>
      <InputArea>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label htmlFor={`${toolId}-year`} className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input id={`${toolId}-year`} type="number" value={year} onChange={(e) => setYear(e.target.value)} className="input-field" aria-label={`Year for ${toolName}`} />
            </div>
            <div>
              <label htmlFor={`${toolId}-month`} className="block text-sm font-medium text-gray-700 mb-1">Month (1-12)</label>
              <input id={`${toolId}-month`} type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} className="input-field" aria-label="Month" />
            </div>
            <div>
              <label htmlFor={`${toolId}-day`} className="block text-sm font-medium text-gray-700 mb-1">Day (1-31)</label>
              <input id={`${toolId}-day`} type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} className="input-field" aria-label="Day" />
            </div>
          </div>
          <button onClick={calculate} className="btn-primary">Convert to Anno Mundi</button>
        </div>
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
